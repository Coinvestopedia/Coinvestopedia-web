async function test() {
  try {
    console.log("Fetching Lido...");
    const res = await fetch('https://api.llama.fi/protocol/lido');
    const data = await res.json();
    console.log("Lido keys:", Object.keys(data));
    console.log("Lido currentTVL:", data.tvl[data.tvl.length - 1]);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
