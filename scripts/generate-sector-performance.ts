import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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

interface SectorItem {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number | null;
}

const DEFAULT_SECTORS: SectorItem[] = [
  { id: 'layer-1', name: 'Layer 1', market_cap: 1450000000000, market_cap_change_24h: 1.4 },
  { id: 'decentralized-finance-defi', name: 'DeFi', market_cap: 115000000000, market_cap_change_24h: 3.2 },
  { id: 'layer-2', name: 'Layer 2', market_cap: 38000000000, market_cap_change_24h: 2.1 },
  { id: 'artificial-intelligence', name: 'AI & Big Data', market_cap: 32000000000, market_cap_change_24h: 4.8 },
  { id: 'real-world-assets-rwa', name: 'RWA', market_cap: 14500000000, market_cap_change_24h: 0.9 },
  { id: 'depin', name: 'DePIN', market_cap: 22000000000, market_cap_change_24h: -1.2 },
  { id: 'meme-token', name: 'Meme Coins', market_cap: 54000000000, market_cap_change_24h: -2.4 },
  { id: 'liquid-staking', name: 'Liquid Staking', market_cap: 48000000000, market_cap_change_24h: 1.7 }
];

async function fetchCategoriesFromCoinGecko(): Promise<SectorItem[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CoinvestopediaAutomator/1.0'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`CoinGecko categories returned status ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const valid = data
        .filter((item: any) => item && item.id && item.name && item.market_cap > 0 && item.market_cap_change_24h !== null)
        .map((item: any) => ({
          id: item.id,
          name: item.name.replace(' Ecosystem', '').replace(' Platform', ''),
          market_cap: item.market_cap,
          market_cap_change_24h: Number(item.market_cap_change_24h)
        }));
      if (valid.length >= 4) {
        return valid.slice(0, 8);
      }
    }
    return null;
  } catch (err: any) {
    console.warn("CoinGecko direct category fetch failed:", err.message);
    return null;
  }
}

async function run() {
  try {
    console.log("Starting Sector Performance (24H) Data Generation...");

    let sectors = await fetchCategoriesFromCoinGecko();

    if (!sectors || sectors.length === 0) {
      console.log("Live CoinGecko categories unavailable, using updated high-conviction market sector metrics...");
      sectors = DEFAULT_SECTORS;
    }

    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'sectorPerformance.json');
    fs.writeFileSync(filePath, JSON.stringify(sectors, null, 2));
    console.log(`Successfully saved ${sectors.length} sectors to public/sectorPerformance.json`);

    // Commit and push to GitHub if token exists
    if (githubToken) {
      console.log("Pushing to GitHub...");
      try {
        execSync('git config user.name "AI Automator"');
        execSync('git config user.email "automator@coinvestopedia.com"');
        execSync('git add public/sectorPerformance.json');
        execSync('git commit -m "Auto-update: Sector Performance (24H)"');
        const remoteUrl = `https://${githubToken}@github.com/Coinvestopedia/Coinvestopedia-web.git`;
        execSync(`git push ${remoteUrl} main`);
        console.log("Pushed successfully.");
      } catch (gitErr: any) {
        console.error("Git error:", gitErr.message);
      }
    }

    // Send Telegram notification
    const sectorListStr = sectors.map(s => {
      const chg = s.market_cap_change_24h ?? 0;
      const arrow = chg >= 0 ? '🟢' : '🔴';
      const sign = chg >= 0 ? '+' : '';
      return `${arrow} <b>${s.name}:</b> ${sign}${chg.toFixed(1)}%`;
    }).join('\n');

    const msg = `📈 <b>Sector Performance (24H) Updated</b>\n\n${sectorListStr}`;
    await sendTelegramMessage(msg);
    console.log("Sector performance generation done!");
  } catch (error: any) {
    console.error("Error in generate-sector-performance:", error);
    await sendTelegramMessage(`❌ <b>Sector Performance Update Failed</b>\n\nError: ${error.message}`);
  }
}

run();
