import https from 'https';

const req = https.request("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log(`HTTP ${res.statusCode} -> ${body.slice(0, 500)}`));
});
req.write(JSON.stringify({
    model: "openrouter/free",
    messages: [{ role: "user", content: "Hi" }]
}));
req.end();
