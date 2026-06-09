import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const githubToken = process.env.GITHUB_TOKEN;

async function sendTelegramMessage(message: string) {
  if (!telegramBotToken || !telegramChatId) {
    console.warn("Telegram credentials missing, skipping notification.");
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    if (!response.ok) {
      console.error("Telegram error:", await response.text());
    }
  } catch (error) {
    console.error("Failed to send telegram message:", error);
  }
}

async function run() {
  try {
    console.log("Starting Market Overview Generation...");

    // Read from temp-overview.json (written by the agent before running this script)
    const tempOverviewPath = path.join(process.cwd(), 'scripts', 'temp-overview.json');

    let text: string;

    if (fs.existsSync(tempOverviewPath)) {
      console.log("Reading overview from temp-overview.json...");
      const raw = JSON.parse(fs.readFileSync(tempOverviewPath, 'utf8'));
      text = raw.text;
      fs.unlinkSync(tempOverviewPath); // Clean up
    } else {
      throw new Error("temp-overview.json not found. Please create it before running this script.");
    }

    if (!text || text.trim().length < 50) {
      throw new Error("Overview text is too short or empty.");
    }

    const data = {
      text,
      timestamp: new Date().toISOString(),
      sources: []
    };

    const filePath = path.join(process.cwd(), 'public', 'aiMarketOverview.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Saved to public/aiMarketOverview.json");

    // Commit and push
    if (githubToken) {
      console.log("Pushing to GitHub...");
      try {
        execSync('git config user.name "AI Automator"');
        execSync('git config user.email "automator@coinvestopedia.com"');
        execSync('git add public/aiMarketOverview.json');
        execSync('git commit -m "Auto-update: AI Market Overview"');
        const remoteUrl = `https://${githubToken}@github.com/Coinvestopedia/Coinvestopedia-web.git`;
        execSync(`git push ${remoteUrl} main`);
        console.log("Pushed successfully.");
      } catch (gitErr: any) {
        console.error("Git error:", gitErr.message);
      }
    }

    // Send truncated preview to Telegram (first 300 chars)
    const preview = text.length > 300 ? text.substring(0, 300) + '...' : text;
    await sendTelegramMessage(`✅ <b>Market Overview Updated</b>\n\n${preview}`);
    console.log("Done!");
  } catch (error: any) {
    console.error("Error generating market overview:", error);
    await sendTelegramMessage(`❌ <b>Market Overview Failed</b>\n\nError: ${error.message}`);
  }
}

run();
