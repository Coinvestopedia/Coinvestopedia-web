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

async function sendTelegramMessage(message: string) {
  if (!telegramBotToken || !telegramChatId) {
    console.warn("Telegram credentials missing, skipping notification.");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error("Failed to send telegram message:", error);
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

STYLE REFERENCE: Follow the exact structure of this published article:
"The GEO Framework: Evaluating Bitcoin Through Global Liquidity, Ecosystem Leverage, and On-Chain Analysis"

STRUCTURE TO FOLLOW:
- Title: A named framework, thesis, or analytical lens (e.g. "The X Framework: Evaluating Y Through Z")
- desc: 2-sentence analytical abstract (the thesis + the finding)
- 5 keyInsights: each a single data-dense sentence with named framework component and metric
- content sections (use \\n\\n between paragraphs):
  1. Opening italic thesis statement (what the framework reveals as of today)
  2. Section 1 with named icon concept: Deep dive — Macro/Global lens (liquidity, M2, DXY correlations with named r² values)
  3. Section 2 with named icon concept: Leverage/Derivatives lens (open interest, funding rates, basis compression with $ figures)
  4. Section 3 with named icon concept: On-Chain lens (realized price tiers, cohort analysis, HODL wave insights)
  5. Section 4: Cycle or structural analysis (halving cycles, institutional shift data, ETF flow data)
  6. Synthesis/Conclusion blockquote: A 2-sentence research verdict with a registry-style tag at the bottom

CONTENT REQUIREMENTS:
- Choose a CURRENT, highly specific institutional topic from today (ETF developments, RWA tokenization, derivatives infrastructure, custody, regulation, central bank digital assets, on-chain analytics milestones).
- All data must be specific and named: institutions, $ amounts, %, dates, correlation coefficients.
- Avoid generic content — every paragraph must contain at least one specific named data point.
- Use a 3-dimensional analytical framework (like GEO) to structure the thesis.
- Content paragraphs separated by \\n\\n.

Return ONLY a valid JSON object matching this schema:
{
  "id": "unique-hyphenated-slug",
  "title": "Framework Title: Evaluating X Through Y, Z, and W",
  "category": "Institutional",
  "tags": ["Framework", "On-Chain", "Institutional", "Macro"],
  "readTime": "18 min read",
  "date": "Month DD, YYYY",
  "desc": "Sentence 1 describing the framework. Sentence 2 describing the key finding.",
  "keyInsights": [
    "Named lens 1: specific metric finding.",
    "Named lens 2: specific metric finding.",
    "Named lens 3: specific metric finding.",
    "Structural/cycle finding with data.",
    "Synthesis conclusion with data point."
  ],
  "content": "Opening italic thesis statement.\\n\\n## Global/Macro Lens\\n\\nParagraph 1 with named data.\\n\\nParagraph 2 with named correlation.\\n\\n## Leverage/Derivatives Lens\\n\\nParagraph 1 with OI and funding rate data.\\n\\nParagraph 2 with basis analysis.\\n\\n## On-Chain Lens\\n\\nParagraph 1 with realized price data.\\n\\nParagraph 2 with cohort analysis.\\n\\n## Structural Analysis\\n\\nParagraph 1 with ETF or cycle data.\\n\\nParagraph 2 with institutional shift data.\\n\\n## Synthesis: [Date] State\\n\\nResearch verdict sentence 1. Research verdict sentence 2.\\n\\n_Research Registry — #[FRAMEWORK-TAG]_"
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
      const rawContent: string = sec.content || '';
      const blocks = rawContent.split(/\\n\\n|\n\n/).filter((b: string) => b.trim());
      const jsxParts = blocks.map((block: string) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const items = trimmed.split(/\n/).filter((l: string) => l.trim()).map((l: string) => {
            const clean = l.replace(/^[•\-]\s*/, '');
            const colonIdx = clean.indexOf(':');
            if (colonIdx > 0 && colonIdx < 60) {
              const label = clean.substring(0, colonIdx);
              const rest = clean.substring(colonIdx + 1);
              return `<li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">${label}:</strong><span className="text-text-muted">${rest}</span></div></li>`;
            }
            return `<li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">${clean}</span></li>`;
          }).join('');
          return `<ul className="space-y-4 mb-4">${items}</ul>`;
        }
        if (trimmed.startsWith('Channel') || trimmed.startsWith('Base Case') || trimmed.startsWith('Bull Case') || trimmed.startsWith('Bear Case')) {
          const colonIdx = trimmed.indexOf(':');
          if (colonIdx > 0) {
            const label = trimmed.substring(0, colonIdx);
            const rest = trimmed.substring(colonIdx + 1);
            return `<p className="mb-4"><strong>${label}:</strong>${rest}</p>`;
          }
        }
        return `<p className="mb-4">${trimmed}</p>`;
      }).join('');

      macroTsx += `        content: (<>${jsxParts}</>),\n`;
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
    // Parse structured content with ## headers
    const insightRaw: string = insightData.content || '';
    const insightBlocks = insightRaw.split(/\\n\\n|\n\n/).filter((b: string) => b.trim());

    const insightJsx = insightBlocks.slice(1).map((block: string) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        const heading = trimmed.replace(/^## /, '');
        return `<h2 className="text-2xl font-bold mt-10 mb-4 text-text">${heading}</h2>`;
      }
      if (trimmed.startsWith('_') && trimmed.endsWith('_')) {
        return `<p className="text-xs text-text-muted italic border-t border-border pt-4 text-right mt-10">${trimmed.replace(/_/g, '')}</p>`;
      }
      if (trimmed.startsWith('> ') || (trimmed.length < 300 && !trimmed.includes('.'))) {
        const inner = trimmed.replace(/^> /, '');
        return `<blockquote className="border-l-4 border-primary pl-6 py-2 my-6 italic text-text-muted">${inner}</blockquote>`;
      }
      // Bold **text** handling
      const withBold = trimmed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return `<p className="mb-6">${withBold}</p>`;
    }).join('');

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
