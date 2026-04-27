import https from 'https';

const modelsToTest = [
    "deepseek/deepseek-chat:free",
    "meta-llama/llama-3.2-1b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "huggingfaceh4/zephyr-7b-beta:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "qwen/qwen-2-7b-instruct:free",
    "google/gemma-7b-it:free"
];

const testOpenRouter = (model) => {
    return new Promise((resolve) => {
        const payload = JSON.stringify({
            model: model,
            messages: [{ role: "user", content: "Say hi" }]
        });

        const req = https.request("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`[${model}] HTTP ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log(`SUCCESS: ${model} works!`);
                }
                resolve();
            });
        });
        req.on('error', (e) => resolve());
        req.write(payload);
        req.end();
    });
};

const runAll = async () => {
    for (const m of modelsToTest) {
        await testOpenRouter(m);
    }
};

runAll();
