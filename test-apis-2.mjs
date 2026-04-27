import https from 'https';

const getFreeModels = () => {
    https.get('https://openrouter.ai/api/v1/models', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            const data = JSON.parse(body);
            const freeModels = data.data.filter(m => 
                m.pricing && m.pricing.prompt === "0" && m.pricing.completion === "0"
            );
            console.log("Found free models:", freeModels.map(m => m.id).slice(0, 15));
        });
    });
};

getFreeModels();
