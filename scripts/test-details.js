async function test() {
  try {
    console.log("Fetching stablecoins...");
    const stabRes = await fetch('https://stablecoins.llama.fi/stablecoins');
    const stabData = await stabRes.json();
    if (stabData.peggedAssets?.length > 0) {
      console.log("First stablecoin element structure:", JSON.stringify(stabData.peggedAssets[0], null, 2));
    }

    console.log("\nFetching DEX overview...");
    const dexRes = await fetch('https://api.llama.fi/overview/dexs');
    const dexData = await dexRes.json();
    console.log("DEX total24h:", dexData.total24h);
    console.log("DEX total48hto24h:", dexData.total48hto24h);
    console.log("DEX change_1d:", dexData.change_1d);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
