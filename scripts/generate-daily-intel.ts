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
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
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

async function run() {
  try {
    console.log("Starting Daily Intel Generation...");

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    // 1. Generate Macro Intel
    console.log("Generating Macro Intel...");
    let macroData: any = {};
    const tempMacroPath = path.join(process.cwd(), 'scripts', 'temp-macro.json');
    
    if (fs.existsSync(tempMacroPath)) {
      console.log("Reading Macro Intel from temp-macro.json...");
      macroData = JSON.parse(fs.readFileSync(tempMacroPath, 'utf8'));
      fs.unlinkSync(tempMacroPath); // Clean up
    } else {
      if (!geminiApiKey) throw new Error("VITE_GEMINI_API_KEY not found and temp-macro.json does not exist.");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const macroPrompt = `You are a top-tier macro analyst. Write a new macro intelligence report combining traditional markets, crypto, tech, politics, and regulations.
Return ONLY a valid JSON object matching this schema exactly:
{
  "id": "unique-slug-date",
  "title": "String",
  "subtitle": "String",
  "tab": "weekly",
  "date": "Month DD, YYYY",
  "readTime": "12 min read",
  "confidenceLevel": "High",
  "keyMetrics": [ {"label": "String", "value": "String", "direction": "up" | "down" | "neutral"} ],
  "keyInsights": ["String (3-4 items)"],
  "sections": [
    { "title": "String (e.g. Macro Context, Transmission Analysis, Risk Matrix)", "content": "String (Use paragraphs separated by \\n\\n)" }
  ]
}`;

      const macroRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: macroPrompt,
        config: { temperature: 0.7, responseMimeType: "application/json" }
      });
      macroData = JSON.parse(macroRes.text || "{}");
    }

    // Convert Macro JSON to TSX string
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
    for (const sec of macroData.sections) {
      macroTsx += `      {\n`;
      macroTsx += `        icon: <Globe size={18} />,\n`;
      macroTsx += `        title: \`${sec.title}\`,\n`;
      const paragraphs = sec.content.split('\\n\\n').map((p: string) => `<p className="mb-4">${p}</p>`).join('');
      macroTsx += `        content: (<>${paragraphs}</>),\n`;
      macroTsx += `      },\n`;
    }
    macroTsx += `    ]\n  },\n`;

    const macroFilePath = path.join(process.cwd(), 'pages', 'MacroIntel.tsx');
    let macroFileContent = fs.readFileSync(macroFilePath, 'utf8');
    macroFileContent = macroFileContent.replace(/const REPORTS: MacroReport\[\] = \[\r?\n/, `const REPORTS: MacroReport[] = [\n${macroTsx}`);
    fs.writeFileSync(macroFilePath, macroFileContent);
    console.log("Updated MacroIntel.tsx");


    // 2. Generate Institutional Insight
    console.log("Generating Institutional Insight...");
    let insightData: any = {};
    const tempInsightPath = path.join(process.cwd(), 'scripts', 'temp-insight.json');

    if (fs.existsSync(tempInsightPath)) {
      console.log("Reading Institutional Insight from temp-insight.json...");
      insightData = JSON.parse(fs.readFileSync(tempInsightPath, 'utf8'));
      fs.unlinkSync(tempInsightPath); // Clean up
    } else {
      if (!geminiApiKey) throw new Error("VITE_GEMINI_API_KEY not found and temp-insight.json does not exist.");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const insightPrompt = `You are a top-tier institutional crypto researcher. Write a new institutional insight article regarding digital assets and institutional adoption.
Return ONLY a valid JSON object matching this schema exactly:
{
  "id": "unique-slug-date",
  "title": "String",
  "category": "Institutional",
  "tags": ["Institution", "Macro", "Adoption"],
  "readTime": "15 min read",
  "date": "Month DD, YYYY",
  "desc": "String (1-2 sentences)",
  "keyInsights": ["String (3-4 items)"],
  "content": "String (Use paragraphs separated by \\n\\n, and use Markdown for bolding)"
}`;

      const insightRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: insightPrompt,
        config: { temperature: 0.7, responseMimeType: "application/json" }
      });
      insightData = JSON.parse(insightRes.text || "{}");
    }

    // Convert Insight JSON to TSX string
    let insightTsx = `  {\n`;
    insightTsx += `    id: '${insightData.id}',\n`;
    insightTsx += `    title: \`${insightData.title}\`,\n`;
    insightTsx += `    category: '${insightData.category}',\n`;
    insightTsx += `    tags: ${JSON.stringify(insightData.tags)},\n`;
    insightTsx += `    readTime: '${insightData.readTime}',\n`;
    insightTsx += `    date: '${insightData.date}',\n`;
    insightTsx += `    image: '/europe-crypto-featured.png',\n`;
    insightTsx += `    desc: \`${insightData.desc}\`,\n`;
    insightTsx += `    icon: <Building2 className="text-blue-400" size={24} />,\n`;
    insightTsx += `    keyInsights: ${JSON.stringify(insightData.keyInsights)},\n`;
    const inParagraphs = insightData.content.split('\\n\\n').map((p: string) => `<p className="mb-6">${p}</p>`).join('');
    insightTsx += `    content: (<>${inParagraphs}</>)\n  },\n`;

    const insightFilePath = path.join(process.cwd(), 'pages', 'Insights.tsx');
    let insightFileContent = fs.readFileSync(insightFilePath, 'utf8');
    insightFileContent = insightFileContent.replace(/export const ARTICLES: Article\[\] = \[\r?\n/, `export const ARTICLES: Article[] = [\n${insightTsx}`);
    fs.writeFileSync(insightFilePath, insightFileContent);
    console.log("Updated Insights.tsx");

    // Commit and push
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

    const msg = `✅ <b>Daily Intel Published</b>\n\n<b>Macro Report:</b> ${macroData.title}\n\n<b>Insight Article:</b> ${insightData.title}`;
    await sendTelegramMessage(msg);
    console.log("Done!");
  } catch (error: any) {
    console.error("Error generating daily intel:", error);
    await sendTelegramMessage(`❌ <b>Daily Intel Failed</b>\n\nError: ${error.message}`);
  }
}

run();
