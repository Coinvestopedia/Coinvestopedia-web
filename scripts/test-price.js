async function test() {
  try {
    const res = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum');
    const data = await res.json();
    console.log("Ethereum Price:", data.coins['coingecko:ethereum']?.price);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
