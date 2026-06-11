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

async function run() {
  try {
    console.log("Starting Institutional On-Chain Pulse Data Generation...");

    // 1. Fetch DeFi TVL (Total Value Locked)
    console.log("Fetching DeFi TVL from DefiLlama...");
    const tvlRes = await fetch('https://api.llama.fi/charts');
    const tvlData = await tvlRes.json();
    const latestTvlObj = tvlData[tvlData.length - 1];
    const latestTvl = latestTvlObj.totalLiquidityUSD;

    // Find TVL 24 hours ago
    const targetTvlTimestamp = Number(latestTvlObj.date) - 86400;
    let closestTvlIndex = tvlData.length - 2;
    let minTvlDiff = Math.abs(Number(tvlData[closestTvlIndex].date) - targetTvlTimestamp);
    for (let i = tvlData.length - 2; i >= 0; i--) {
      const diff = Math.abs(Number(tvlData[i].date) - targetTvlTimestamp);
      if (diff < minTvlDiff) {
        minTvlDiff = diff;
        closestTvlIndex = i;
      } else if (diff > minTvlDiff + 7200) {
        break;
      }
    }
    const prevTvl = tvlData[closestTvlIndex].totalLiquidityUSD;
    const tvlChangePercent = ((latestTvl - prevTvl) / prevTvl) * 100;

    // 2. Fetch Stablecoins Market Cap
    console.log("Fetching Stablecoins Market Cap from DefiLlama...");
    const stabRes = await fetch('https://stablecoins.llama.fi/stablecoins');
    const stabData = await stabRes.json();
    let totalStableCap = 0;
    let totalStableCapPrev = 0;
    if (stabData.peggedAssets && Array.isArray(stabData.peggedAssets)) {
      stabData.peggedAssets.forEach((asset: any) => {
        if (asset.circulating && asset.circulating.peggedUSD) {
          totalStableCap += asset.circulating.peggedUSD;
        }
        if (asset.circulatingPrevDay && asset.circulatingPrevDay.peggedUSD) {
          totalStableCapPrev += asset.circulatingPrevDay.peggedUSD;
        }
      });
    }
    const stableChangePercent = totalStableCapPrev > 0 ? ((totalStableCap - totalStableCapPrev) / totalStableCapPrev) * 100 : 0.2;

    // 3. Fetch Lido Staking & Ethereum Price for Staking Ratio
    console.log("Fetching Lido TVL and ETH Price...");
    const lidoRes = await fetch('https://api.llama.fi/protocol/lido');
    const lidoData = await lidoRes.json();
    const latestLidoTvlObj = lidoData.tvl[lidoData.tvl.length - 1];
    const latestLidoTvl = latestLidoTvlObj.totalLiquidityUSD;

    const ethPriceRes = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum');
    const ethPriceData = await ethPriceRes.json();
    const ethPrice = ethPriceData.coins['coingecko:ethereum']?.price || 1630;

    // Estimate Staked ETH supply from Lido's TVL (Lido represents ~28.5% of total Ethereum staking, total circulating is ~120.4M)
    const lidoStakedEth = latestLidoTvl / ethPrice;
    const totalStakedEth = lidoStakedEth / 0.285;
    const calculatedStakingRatio = (totalStakedEth / 120400000) * 100;

    // We use Lido's TVL 24h change as a proxy for the staking ratio's change
    const targetLidoTimestamp = Number(latestLidoTvlObj.date) - 86400;
    let closestLidoIndex = lidoData.tvl.length - 2;
    let minLidoDiff = Math.abs(Number(lidoData.tvl[closestLidoIndex].date) - targetLidoTimestamp);
    for (let i = lidoData.tvl.length - 2; i >= 0; i--) {
      const diff = Math.abs(Number(lidoData.tvl[i].date) - targetLidoTimestamp);
      if (diff < minLidoDiff) {
        minLidoDiff = diff;
        closestLidoIndex = i;
      } else if (diff > minLidoDiff + 7200) {
        break;
      }
    }
    const prevLidoTvl = lidoData.tvl[closestLidoIndex].totalLiquidityUSD;
    // Staking amount change is very slow, we divide the change by a damping factor or use direct lido ETH change to get realistic staked ETH change.
    const lidoEthPrev = prevLidoTvl / ethPrice; // approx price close
    const stakingChangePercent = ((lidoStakedEth - lidoEthPrev) / lidoEthPrev) * 100;

    // 4. Fetch DEX Volume (24h)
    console.log("Fetching DEX Volume...");
    const dexRes = await fetch('https://api.llama.fi/overview/dexs');
    const dexData = await dexRes.json();
    const dexVolume24h = dexData.total24h || 4100000000;
    const dexChangePercent = dexData.change_1d !== undefined && dexData.change_1d !== null ? Number(dexData.change_1d) : -2.1;

    // Construct format strings
    const defiTvlFormatted = {
      value: `$${(latestTvl / 1e9).toFixed(1)}B`,
      change: `${tvlChangePercent >= 0 ? '+' : ''}${tvlChangePercent.toFixed(1)}%`
    };

    const stablecoinMktCapFormatted = {
      value: `$${(totalStableCap / 1e9).toFixed(1)}B`,
      change: `${stableChangePercent >= 0 ? '+' : ''}${stableChangePercent.toFixed(1)}%`
    };

    const ethStakingRatioFormatted = {
      value: `${calculatedStakingRatio.toFixed(1)}%`,
      change: `${stakingChangePercent >= 0 ? '+' : ''}${stakingChangePercent.toFixed(1)}%`
    };

    const dexVolume24hFormatted = {
      value: `$${(dexVolume24h / 1e9).toFixed(1)}B`,
      change: `${dexChangePercent >= 0 ? '+' : ''}${dexChangePercent.toFixed(1)}%`
    };

    const outputData = {
      defiTvl: defiTvlFormatted,
      stablecoinMktCap: stablecoinMktCapFormatted,
      ethStakingRatio: ethStakingRatioFormatted,
      dexVolume24h: dexVolume24hFormatted,
      timestamp: new Date().toISOString()
    };

    const filePath = path.join(process.cwd(), 'public', 'onChainPulse.json');
    fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2));
    console.log("Successfully saved updated metrics to public/onChainPulse.json");

    // Commit and push
    if (githubToken) {
      console.log("Pushing to GitHub...");
      try {
        execSync('git config user.name "AI Automator"');
        execSync('git config user.email "automator@coinvestopedia.com"');
        execSync('git add public/onChainPulse.json pages/Home.tsx');
        execSync('git commit -m "Auto-update: Institutional On-Chain Pulse"');
        const remoteUrl = `https://${githubToken}@github.com/Coinvestopedia/Coinvestopedia-web.git`;
        execSync(`git push ${remoteUrl} main`);
        console.log("Pushed successfully.");
      } catch (gitErr: any) {
        console.error("Git error:", gitErr.message);
      }
    }

    // Send Telegram Notification
    const msg = `📊 <b>Institutional On-Chain Pulse Updated</b>\n\n` +
      `• <b>Total Value Locked:</b> ${defiTvlFormatted.value} (${defiTvlFormatted.change})\n` +
      `• <b>Stablecoin Mkt Cap:</b> ${stablecoinMktCapFormatted.value} (${stablecoinMktCapFormatted.change})\n` +
      `• <b>ETH Staking Ratio:</b> ${ethStakingRatioFormatted.value} (${ethStakingRatioFormatted.change})\n` +
      `• <b>DEX Volume (24h):</b> ${dexVolume24hFormatted.value} (${dexVolume24hFormatted.change})`;
    await sendTelegramMessage(msg);
    console.log("Done!");
  } catch (error: any) {
    console.error("Error generating on-chain pulse metrics:", error);
    await sendTelegramMessage(`❌ <b>On-Chain Pulse Failed</b>\n\nError: ${error.message}`);
  }
}

run();
