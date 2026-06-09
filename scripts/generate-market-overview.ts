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

    let text = process.argv[2];

    if (!text) {
      if (!geminiApiKey) throw new Error("VITE_GEMINI_API_KEY not found and no text provided.");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `You are an expert crypto and macro analyst. Generate a 4-sentence market overview analyzing the current state of the global markets, crypto, and geopolitical news. Provide only the text, no markdown.`;
      
      console.log("Fetching insight from Gemini...");
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              temperature: 0.7,
          }
      });
      text = response.text || "Market data unavailable.";
    } else {
      console.log("Using provided text argument.");
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
        // Push using the provided token URL. Assumes remote 'origin' is set.
        // We will just do a standard push if the token is already in the remote URL,
        // or we can set it.
        const remoteUrl = `https://${githubToken}@github.com/Coinvestopedia/Coinvestopedia-web.git`;
        execSync(`git push ${remoteUrl} main`);
        console.log("Pushed successfully.");
      } catch (gitErr: any) {
        console.error("Git error:", gitErr.message);
      }
    }

    await sendTelegramMessage(`✅ <b>Market Overview Updated</b>\n\n${text}`);
    console.log("Done!");
  } catch (error: any) {
    console.error("Error generating market overview:", error);
    await sendTelegramMessage(`❌ <b>Market Overview Failed</b>\n\nError: ${error.message}`);
  }
}

run();
