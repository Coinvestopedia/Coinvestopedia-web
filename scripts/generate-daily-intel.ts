import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const geminiApiKey = process.env.VITE_GEMINI_API_KEY;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const githubToken = process.env.GITHUB_TOKEN;

async function sendTelegramMessage(message: string, attempt = 1): Promise<void> {
  if (!telegramBotToken || !telegramChatId) {
    console.warn("Telegram credentials missing, skipping notification.");
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      console.error("Telegram error:", await response.text());
    } else {
      console.log("Telegram notification sent.");
    }
  } catch (error: any) {
    clearTimeout(timeout);
    if (attempt < 3) {
      console.warn(`Telegram attempt ${attempt} failed, retrying in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
      return sendTelegramMessage(message, attempt + 1);
    }
    console.error("Failed to send telegram message after 3 attempts:", error?.message ?? error);
  }
}

// ─── MACRO INTEL STYLE REFERENCE ────────────────────────────────────────────
// Based on: "Fed Holds + Strong Dollar Regime: BTC in a Risk-Off World"
// Structure: specific named indicator in title, analytical subtitle, 4 keyMetrics
// with live tickers, 4 keyInsights (data-driven), 3-4 sections with rich JSX:
//   1. Macro Context (policy, central banks, rates, geopolitics)
//   2. Transmission Analysis (how macro moves crypto — 3-channel grid card layout)
//   3. What Professional Investors Are Watching (bulleted watch list with thresholds)
//   4. Risk Matrix / Outlook (numbered scenario analysis)
// Tone: Bloomberg-grade, precise, named data points, no generic copy.

const MACRO_STYLE_PROMPT = `You are a top-tier Bloomberg-caliber macro analyst for Coinvestopedia.

STYLE REFERENCE: Follow the exact structure of this published article:
- Title format: "Specific Named Event/Indicator: Implication for BTC/Markets"
- Subtitle: One analytical sentence that explains the mechanism.
- 4 keyMetrics with real current ticker values (DXY, BTC price, a rate, an equity index)
- 4 keyInsights: each a single precise sentence with a specific data point
- 3-4 sections, each named:
  1. "Macro Context" — Central bank policy, rates, geopolitics, what's driving the current regime. Named institutions, named officials, named figures.
  2. "Transmission Analysis" — How the macro event transmits into crypto through 3 channels (risk appetite, liquidity, opportunity cost). Include correlation coefficients, lag analysis, specific % data.
  3. "What Professional Investors Are Watching" — 4 specific level/threshold bullet points professionals are monitoring as regime-change signals (e.g. "DXY 107.8: above this, BTC-DXY inverse correlation strengthens to -0.85+").
  4. "Scenario Analysis / Risk Matrix" — 2-3 numbered scenarios (bull/base/bear) with probability estimates and BTC price targets.

CONTENT REQUIREMENTS:
- Choose a highly specific, CURRENT topic from the last 48 hours of macro/crypto news.
- All sections must be multi-paragraph, analytical, and data-dense.
- Use named organizations, named officials, specific dates, specific price levels.
- Avoid generic copy and hollow phrases like "in a complex environment" or "investors should watch."
- Each section content should have paragraphs separated by \\n\\n.

Return ONLY a valid JSON object matching this schema:
{
  "id": "unique-hyphenated-slug-with-date",
  "title": "Specific Title: Specific Implication",
  "subtitle": "One analytical sentence about the mechanism.",
  "tab": "weekly",
  "date": "Month DD, YYYY",
  "readTime": "14 min read",
  "confidenceLevel": "High",
  "keyMetrics": [
    {"label": "Indicator Name", "value": "Value", "direction": "up" | "down" | "neutral", "symbol": "TICKER", "format": "number" | "percent"},
    {"label": "Indicator Name", "value": "Value", "direction": "up" | "down" | "neutral"},
    {"label": "Indicator Name", "value": "Value", "direction": "up" | "down" | "neutral"},
    {"label": "Indicator Name", "value": "Value", "direction": "up" | "down" | "neutral"}
  ],
  "keyInsights": [
    "Specific data point sentence 1.",
    "Specific data point sentence 2.",
    "Specific data point sentence 3.",
    "Specific data point sentence 4."
  ],
  "sections": [
    {"title": "Macro Context", "content": "Paragraph 1.\\n\\nParagraph 2."},
    {"title": "Transmission Analysis", "content": "Paragraph 1 setting up 3 channels.\\n\\nChannel 1: Risk Appetite — [data].\\n\\nChannel 2: Liquidity — [data].\\n\\nChannel 3: Opportunity Cost — [data].\\n\\nSynthesis paragraph."},
    {"title": "What Professional Investors Are Watching", "content": "Intro sentence.\\n\\n• Level/Threshold 1: [specific threshold and meaning].\\n\\n• Level/Threshold 2: [specific threshold and meaning].\\n\\n• Level/Threshold 3: [specific threshold and meaning].\\n\\n• Level/Threshold 4: [specific threshold and meaning]."},
    {"title": "Scenario Analysis", "content": "Base Case (55% probability): [BTC/market outlook with target].\\n\\nBull Case (25% probability): [catalyst and target].\\n\\nBear Case (20% probability): [risk and target]."}
  ]
}`;

// ─── INSTITUTIONAL INSIGHT STYLE REFERENCE ───────────────────────────────────
// Based on: "The GEO Framework: Evaluating Bitcoin Through Global Liquidity,
//            Ecosystem Leverage, and On-Chain Analysis"
// Structure: Framework/thesis title, analytical italic subtitle, hero stat grid (4 metrics),
// optional hero image, multi-section deep dive with h2 headers + icons,
// data tables or 3-column card grids, synthesis blockquote callout, disclaimer footer.
// Tone: Institutional research note, deep analytical, framework-driven, multi-lens.

const INSIGHT_STYLE_PROMPT = `You are a top-tier institutional crypto research analyst for Coinvestopedia.

STYLE REFERENCE: Follow the exact structure of this published benchmark article:
"Mexico's Tax 'Kill Switch' & Brazil's DeCripto: The New Era of Regional Surveillance"

STRUCTURE TO FOLLOW:
- Title: A compelling institutional title (e.g. "Specific Event: The New Era of X")
- desc: 2-sentence analytical abstract (the thesis + the finding)
- 5 keyInsights: each a single data-dense sentence with named framework component and metric
- content string (use \\n\\n between blocks):
  1. Opening italic thesis statement.
  2. Hero Image Banner: Use standard markdown image syntax with a high-quality relevant Unsplash image URL, immediately followed by an italicized caption line starting with "Banner:".
  3. Sections with ## headers. Include paragraphs with named data points.
  4. 2-Column Grid Cards: To break down concepts, use "GRID: IconName | Card Title | Card description" (Use valid lucide-react icon names like Shield, Zap, Database, Globe, Activity). Output two GRID lines sequentially.
  5. Data Tables: Provide a comparative markdown table (e.g., | Feature | Model A | Model B |).
  6. Synthesis/Conclusion blockquote: A 2-sentence research verdict starting with "> " and a registry tag at the bottom starting with "_Research Registry".

CONTENT REQUIREMENTS:
- Choose a CURRENT, highly specific institutional topic from today.
- All data must be specific and named: institutions, $ amounts, %, dates.
- Avoid generic content — every paragraph must contain at least one specific named data point.

Return ONLY a valid JSON object matching this schema:
{
  "id": "unique-hyphenated-slug",
  "title": "Institutional Title: The Implication",
  "category": "Institutional",
  "tags": ["LatAm", "Regulation", "Institutional", "Macro"],
  "readTime": "12 min read",
  "date": "Month DD, YYYY",
  "desc": "Sentence 1 describing the thesis. Sentence 2 describing the key finding.",
  "keyInsights": [
    "Specific metric finding 1.",
    "Specific metric finding 2.",
    "Specific metric finding 3.",
    "Specific metric finding 4.",
    "Synthesis conclusion with data point."
  ],
  "content": "Opening italic thesis statement.\\n\\n![RegTech Infrastructure](https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2622&auto=format&fit=crop)\\n\\n_Banner: Institutional Oversight: The convergence of tax law and digital platforms._\\n\\n## Enforcement Mechanisms\\n\\nParagraph 1 with named data.\\n\\nGRID: Zap | Enforcement Mechanism | Non-compliance can lead to...\\nGRID: Database | Continuous Query Access | The policy shifts the burden...\\n\\n## Regional Alignment\\n\\nParagraph 2 with data.\\n\\n| Feature | Mexico | Brazil |\\n|---|---|---|\\n| Target | Digital Services | Exchanges |\\n\\n## Synthesis: [Date] State\\n\\n> Research verdict sentence 1. Research verdict sentence 2.\\n\\n_Research Registry — #[TAG]_"
}`;

async function run() {
  try {
    console.log("Starting Daily Intel Generation...");

    const ai = new GoogleGenAI({ apiKey: geminiApiKey || '' });

    // ── 1. Generate Macro Intel ──────────────────────────────────────────────
    console.log("Generating Macro Intel...");
    let macroData: any = {};
    const tempMacroPath = path.join(process.cwd(), 'scripts', 'temp-macro.json');

    if (fs.existsSync(tempMacroPath)) {
      console.log("Reading Macro Intel from temp-macro.json...");
      macroData = JSON.parse(fs.readFileSync(tempMacroPath, 'utf8'));
      fs.unlinkSync(tempMacroPath);
    } else {
      if (!geminiApiKey) throw new Error("VITE_GEMINI_API_KEY not found and temp-macro.json does not exist.");
      const macroRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: MACRO_STYLE_PROMPT,
        config: { temperature: 0.75, responseMimeType: "application/json" }
      });
      macroData = JSON.parse(macroRes.text || "{}");
    }

    // ── Build Macro TSX ──────────────────────────────────────────────────────
    let macroTsx = `  {\n`;
    macroTsx += `    id: '${macroData.id}',\n`;
    macroTsx += `    title: \`${macroData.title}\`,\n`;
    macroTsx += `    subtitle: \`${macroData.subtitle}\`,\n`;
    macroTsx += `    tab: '${macroData.tab}',\n`;
    macroTsx += `    date: '${macroData.date}',\n`;
    macroTsx += `    readTime: '${macroData.readTime}',\n`;
    macroTsx += `    confidenceLevel: '${macroData.confidenceLevel}',\n`;
    macroTsx += `    keyMetrics: ${JSON.stringify(macroData.keyMetrics)},\n`;
    macroTsx += `    keyInsights: ${JSON.stringify(macroData.keyInsights)},\n`;
    macroTsx += `    sections: [\n`;

    const sectionIcons = ['<Globe size={18} />', '<TrendingUp size={18} />', '<Eye size={18} />', '<BarChart3 size={18} />'];
    for (let i = 0; i < macroData.sections.length; i++) {
      const sec = macroData.sections[i];
      const icon = sectionIcons[i] || '<Globe size={18} />';
      macroTsx += `      {\n`;
      macroTsx += `        icon: ${icon},\n`;
      macroTsx += `        title: \`${sec.title}\`,\n`;

      // Build rich JSX content: split on \\n\\n, detect bullet lines (•)
      let jsxParts = '';
      const rawContent: string = sec.content || '';
      const blocks = rawContent.split(/\\n\\n|\n\n/).filter((b: string) => b.trim());

      let channelBlocks: string[] = [];
      let listItems: string[] = [];
      
      const flushChannels = () => {
        if (channelBlocks.length > 0) {
          jsxParts += `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">${channelBlocks.join('')}</div>`;
          channelBlocks = [];
        }
      };

      const flushLists = () => {
        if (listItems.length > 0) {
          jsxParts += `<ul className="space-y-4 mb-4">${listItems.join('')}</ul>`;
          listItems = [];
        }
      };

      const highlightPercentages = (text: string) => {
        return text.replace(/(-?\d+(\.\d+)?%)/g, (match) => {
          return `<span className="${match.startsWith('-') ? 'text-red-400' : 'text-emerald-400'} font-bold">${match}</span>`;
        });
      };

      const escapeHtml = (text: string) => {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      };

      const processText = (text: string) => {
        let processed = escapeHtml(text);
        processed = highlightPercentages(processed);
        processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        return processed;
      };

      blocks.forEach((block: string) => {
        const trimmed = block.trim();
        
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          flushChannels();
          const items = trimmed.split(/\\n|\n/).filter((l: string) => l.trim()).map((l: string) => {
            let clean = l.replace(/^[•-]\s*/, '');
            clean = processText(clean);
            const colonIdx = clean.indexOf(':');
            if (colonIdx > 0 && colonIdx < 60) {
              const label = clean.substring(0, colonIdx);
              const rest = clean.substring(colonIdx + 1);
              return `<li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">${label}:</strong><span className="text-text-muted">${rest}</span></div></li>`;
            }
            return `<li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">${clean}</span></li>`;
          });
          listItems.push(...items);
        } else if (trimmed.startsWith('Channel')) {
          flushLists();
          const colonIdx = trimmed.indexOf(':');
          let label = trimmed.substring(0, colonIdx > 0 ? colonIdx : 9);
          let rest = trimmed.substring(colonIdx > 0 ? colonIdx + 1 : 10).trim();
          
          const emdashIdx = rest.indexOf('—');
          if (emdashIdx > -1 && emdashIdx < 30) {
            label = label + ": " + rest.substring(0, emdashIdx).trim();
            rest = rest.substring(emdashIdx + 1).trim();
          }

          rest = processText(rest);
          channelBlocks.push(`<div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">${label}</h4><p className="text-xs text-text-muted">${rest}</p></div>`);
        } else if (trimmed.startsWith('Base Case') || trimmed.startsWith('Bull Case') || trimmed.startsWith('Bear Case')) {
          flushChannels();
          flushLists();
          const colonIdx = trimmed.indexOf(':');
          if (colonIdx > 0) {
            const label = trimmed.substring(0, colonIdx);
            const rest = processText(trimmed.substring(colonIdx + 1));
            jsxParts += `<p className="mb-4"><strong>${label}:</strong>${rest}</p>`;
          } else {
            jsxParts += `<p className="mb-4">${processText(trimmed)}</p>`;
          }
        } else {
          flushChannels();
          flushLists();
          jsxParts += `<p className="mb-4">${processText(trimmed)}</p>`;
        }
      });
      flushChannels();
      flushLists();

      macroTsx += `        content: (<>${jsxParts}</>), \n`;
      macroTsx += `      },\n`;
    }
    macroTsx += `    ]\n  },\n`;

    const macroFilePath = path.join(process.cwd(), 'pages', 'MacroIntel.tsx');
    let macroFileContent = fs.readFileSync(macroFilePath, 'utf8');
    macroFileContent = macroFileContent.replace(/const REPORTS: MacroReport\[\] = \[\r?\n/, `const REPORTS: MacroReport[] = [\n${macroTsx}`);
    fs.writeFileSync(macroFilePath, macroFileContent);
    console.log("Updated MacroIntel.tsx");

    // ── 2. Generate Institutional Insight ────────────────────────────────────
    console.log("Generating Institutional Insight...");
    let insightData: any = {};
    const tempInsightPath = path.join(process.cwd(), 'scripts', 'temp-insight.json');

    if (fs.existsSync(tempInsightPath)) {
      console.log("Reading Institutional Insight from temp-insight.json...");
      insightData = JSON.parse(fs.readFileSync(tempInsightPath, 'utf8'));
      fs.unlinkSync(tempInsightPath);
    } else {
      if (!geminiApiKey) throw new Error("VITE_GEMINI_API_KEY not found and temp-insight.json does not exist.");
      const insightRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: INSIGHT_STYLE_PROMPT,
        config: { temperature: 0.75, responseMimeType: "application/json" }
      });
      insightData = JSON.parse(insightRes.text || "{}");
    }

    // ── Build Insight TSX ────────────────────────────────────────────────────
    const escapeHtml = (text: string) => {
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const highlightPercentages = (text: string) => {
      return text.replace(/(-?\d+(\.\d+)?%)/g, (match) => {
        return `<span className="${match.startsWith('-') ? 'text-red-400' : 'text-emerald-400'} font-bold">${match}</span>`;
      });
    };

    const processInsightText = (text: string) => {
      return highlightPercentages(escapeHtml(text));
    };

    const rawInsightContent: string = insightData.content || '';
    const insightBlocks = rawInsightContent.split(/\\n\\n|\n\n/).filter((b: string) => b.trim());

    let insightJsx = '';
    let currentGrid: string[] = [];
    let currentTable: string[] = [];
    
    const flushGrid = () => {
      if (currentGrid.length > 0) {
        insightJsx += `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">\n${currentGrid.join('')}\n</div>\n`;
        currentGrid = [];
      }
    };

    const flushTable = () => {
      if (currentTable.length > 0) {
        const rows = currentTable.map(r => r.split('|').map(c => c.trim()).slice(1, -1));
        if (rows.length >= 2) {
          const headers = rows[0];
          const trHeaders = headers.map(h => `<th className="p-4 bg-surface/50 font-bold border-b border-border text-text">${h}</th>`).join('');
          
          let trBody = '';
          for (let i = 2; i < rows.length; i++) {
            const cells = rows[i].map((c, idx) => `<td className="p-4 border-b border-border border-dashed text-text-muted ${idx===0 ? 'font-medium text-text' : ''}">${processInsightText(c)}</td>`).join('');
            trBody += `<tr>${cells}</tr>`;
          }
          
          insightJsx += `
<div className="leather-card p-6 rounded-xl mb-10 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left border-collapse min-w-[600px]">
      <thead><tr>${trHeaders}</tr></thead>
      <tbody>${trBody}</tbody>
    </table>
  </div>
</div>\n`;
        }
        currentTable = [];
      }
    };

    for (let i = 1; i < insightBlocks.length; i++) {
      const block = insightBlocks[i];
      const trimmed = block.trim();
      
      if (trimmed.startsWith('GRID:')) {
        flushTable();
        const lines = trimmed.split(/\n/);
        for (const line of lines) {
          if (line.startsWith('GRID:')) {
            const parts = line.replace('GRID:', '').split('|').map(p => p.trim());
            const iconName = parts[0] || 'Zap';
            const title = parts[1] || '';
            const desc = processInsightText(parts[2] || '');
            currentGrid.push(`
<div className="p-6 bg-surface border border-border rounded-xl">
  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-400"><${iconName} className="w-5 h-5" /> ${title}</h3>
  <p className="text-sm text-text-muted leading-relaxed">${desc}</p>
</div>`);
          }
        }
        continue;
      }
      
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushGrid();
        const lines = trimmed.split(/\n/);
        for (const line of lines) {
           if(line.startsWith('|')) currentTable.push(line);
        }
        continue;
      }
      
      flushGrid();
      flushTable();
      
      const processed = processInsightText(trimmed);
      
      if (trimmed.startsWith('![') && trimmed.includes('](')) {
        const altMatch = trimmed.match(/!\[([^\]]+)\]/);
        const urlMatch = trimmed.match(/\(([^)]+)\)/);
        if (urlMatch) {
           insightJsx += `<div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">\n  <img src="${urlMatch[1]}" alt="${altMatch ? altMatch[1] : 'Image'}" className="w-full h-auto object-cover max-h-[500px]" />\n`;
        }
        continue;
      }
      
      if (trimmed.startsWith('_Banner:') && trimmed.endsWith('_')) {
        const caption = processed.replace(/^_Banner:/, '').replace(/_$/, '').trim();
        insightJsx += `  <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">${caption}</div>\n</div>\n`;
        continue;
      }

      if (trimmed.startsWith('## ')) {
        const heading = processed.replace(/^## /, '');
        insightJsx += `<h2 className="text-2xl font-bold mt-10 mb-4 text-text">${heading}</h2>\n`;
        continue;
      }
      if (trimmed.startsWith('_') && trimmed.endsWith('_')) {
        insightJsx += `<p className="text-xs text-text-muted italic border-t border-border pt-4 text-right mt-10">${processed.replace(/_/g, '')}</p>\n`;
        continue;
      }
      if (trimmed.startsWith('> ') || (trimmed.length < 300 && !trimmed.includes('.'))) {
        const inner = processed.replace(/^> /, '');
        insightJsx += `<blockquote className="border-l-4 border-primary pl-6 py-2 my-6 italic text-text-muted">${inner}</blockquote>\n`;
        continue;
      }
      
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const items = trimmed.split(/\\n|\n/).filter(l => l.trim()).map(l => {
          let clean = l.replace(/^[•-]\s*/, '');
          clean = processInsightText(clean);
          return `<li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">${clean}</span></li>`;
        });
        insightJsx += `<ul className="space-y-4 mb-6">${items.join('')}</ul>\n`;
        continue;
      }

      const withBold = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      insightJsx += `<p className="mb-6">${withBold}</p>\n`;
    }
    flushGrid();
    flushTable();

    let insightTsx = `  {\n`;
    insightTsx += `    id: '${insightData.id}',\n`;
    insightTsx += `    title: \`${insightData.title}\`,\n`;
    insightTsx += `    category: '${insightData.category}',\n`;
    insightTsx += `    tags: ${JSON.stringify(insightData.tags)},\n`;
    insightTsx += `    readTime: '${insightData.readTime}',\n`;
    insightTsx += `    date: '${insightData.date}',\n`;
    insightTsx += `    image: '/geo-framework-hero.png',\n`;
    insightTsx += `    desc: \`${insightData.desc}\`,\n`;
    insightTsx += `    icon: <Building2 className="text-blue-400" size={24} />,\n`;
    insightTsx += `    keyInsights: ${JSON.stringify(insightData.keyInsights)},\n`;
    insightTsx += `    content: (<>\n`;
    insightTsx += `      <p className="text-xl text-text-muted mb-8 italic">${(insightBlocks[0] || '').replace(/^_|_$/g, '').trim()}</p>\n`;
    insightTsx += `      ${insightJsx}\n`;
    insightTsx += `    </>)\n  },\n`;

    const insightFilePath = path.join(process.cwd(), 'pages', 'Insights.tsx');
    let insightFileContent = fs.readFileSync(insightFilePath, 'utf8');
    insightFileContent = insightFileContent.replace(/export const ARTICLES: Article\[\] = \[\r?\n/, `export const ARTICLES: Article[] = [\n${insightTsx}`);
    fs.writeFileSync(insightFilePath, insightFileContent);
    console.log("Updated Insights.tsx");

    // ── Push to GitHub ───────────────────────────────────────────────────────
    if (githubToken) {
      console.log("Pushing to GitHub...");
      try {
        execSync('git config user.name "AI Automator"');
        execSync('git config user.email "automator@coinvestopedia.com"');
        execSync('git add pages/MacroIntel.tsx pages/Insights.tsx');
        execSync('git commit -m "Auto-update: Daily Intel & Insights"');
        const remoteUrl = `https://${githubToken}@github.com/Coinvestopedia/Coinvestopedia-web.git`;
        execSync(`git push ${remoteUrl} main`);
        console.log("Pushed successfully.");
      } catch (gitErr: any) {
        console.error("Git error:", gitErr.message);
      }
    }

    const macroPreview = macroData.title || 'N/A';
    const insightPreview = insightData.title || 'N/A';
    const msg = `✅ <b>Daily Intel Published</b>\n\n<b>Macro Report:</b> ${macroPreview}\n\n<b>Insight Article:</b> ${insightPreview}`;
    await sendTelegramMessage(msg);
    console.log("Done!");

  } catch (error: any) {
    console.error("Error generating daily intel:", error);
    await sendTelegramMessage(`❌ <b>Daily Intel Failed</b>\n\nError: ${error.message}`);
  }
}

run();
