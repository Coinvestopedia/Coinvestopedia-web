import { createClient } from '@supabase/supabase-js';
import pkg from '@notionhq/client';
const { Client } = pkg;
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
const resend = new Resend(process.env.RESEND_API_KEY);

const NOTION_DATA_SOURCE_ID = '35096d9d-d3ba-806e-9543-fc9d0460298b';

async function getDrafts() {
  const response = await notion.search({
    filter: {
      property: 'object',
      value: 'page',
    },
  });
  return response.results.filter(page => 
    page.parent && 
    page.parent.database_id === NOTION_DATA_SOURCE_ID && 
    page.properties.Status?.status?.name === 'Complete'
  );
}

async function getPageContent(pageId) {
  const blocks = await notion.blocks.children.list({ block_id: pageId });
  return blocks.results;
}

function notionBlocksToHtml(blocks) {
  let html = '';
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${block.paragraph.rich_text.map(t => t.plain_text).join('')}</p>`;
        break;
      case 'heading_1':
        html += `<h1 style="color:#fff;font-size:24px;margin:32px 0 16px;">${block.heading_1.rich_text.map(t => t.plain_text).join('')}</h1>`;
        break;
      case 'heading_2':
        html += `<h2 style="color:#fff;font-size:20px;margin:24px 0 12px;">${block.heading_2.rich_text.map(t => t.plain_text).join('')}</h2>`;
        break;
      case 'heading_3':
        html += `<h3 style="color:#fff;font-size:18px;margin:20px 0 10px;">${block.heading_3.rich_text.map(t => t.plain_text).join('')}</h3>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}</li>`;
        break;
      // Add more block types as needed
    }
  }
  return html;
}

async function broadcast() {
  console.log('Fetching drafts from Notion...');
  const drafts = await getDrafts();

  if (drafts.length === 0) {
    console.log('No drafts marked as "Complete".');
    return;
  }

  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('email, confirmation_token')
    .eq('status', 'active');

  if (subError) throw subError;

  console.log(`Found ${subscribers.length} active subscribers.`);

  for (const draft of drafts) {
    const title = draft.properties.Title.title[0].plain_text;
    const pageId = draft.id;
    
    console.log(`Processing newsletter: ${title}`);
    const blocks = await getPageContent(pageId);
    const contentHtml = notionBlocksToHtml(blocks);

    const fullHtmlTemplate = (unsubscribeUrl) => `
<div style="font-family:Inter,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#0a0a0a;color:#e0e0e0;">
  <p style="color:#9B8B5F;font-size:11px;font-weight:600;letter-spacing:2px;margin:0 0 24px;">THE BRIEFING</p>
  <h1 style="color:#fff;font-size:28px;margin:0 0 24px;">${title}</h1>
  <div style="color:#a0a0a0;font-size:16px;line-height:1.8;margin:0 0 40px;">
    ${contentHtml}
  </div>
  <hr style="border:none;border-top:1px solid #1a1a1a;margin:40px 0;">
  <p style="color:#444;font-size:11px;text-align:center;">
    You are receiving this because you subscribed to The Briefing. <br>
    <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">Unsubscribe</a> from this list.
  </p>
</div>`;

    // Batch send or individual send
    // For simplicity and to handle unsubscribe tokens, we send individually
    for (const sub of subscribers) {
      const unsubUrl = `${process.env.VITE_SUPABASE_URL}/functions/v1/unsubscribe?token=${sub.confirmation_token}`;
      
      const { data, error } = await resend.emails.send({
        from: 'The Briefing <newsletter@coinvestopedia.com>',
        to: sub.email,
        subject: title,
        html: fullHtmlTemplate(unsubUrl),
      });

      if (error) {
        console.error(`Failed to send to ${sub.email}:`, error);
      } else {
        console.log(`Sent to ${sub.email}`);
      }
    }

    // 4. Mark as sent in Notion (optional, handle errors if property missing)
    try {
      await notion.pages.update({
        page_id: draft.id,
        properties: {
          'Status': { status: { name: 'Complete' } }
        },
      });
      console.log(`Updated Notion status for: ${title}`);
    } catch (err) {
      console.warn(`Could not update Notion page status: ${err.message}`);
    }
  }

  console.log('Newsletter sync completed successfully!');
}

broadcast().catch(err => {
  console.error('Fatal error in broadcast:', err);
  process.exit(1);
});
