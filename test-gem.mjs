import https from 'https';
const req = https.request('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA4PHzV3LoH91H5Oo8rFhy385utqrsAu-Y', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => console.log(`HTTP ${res.statusCode} -> ${body.slice(0,300)}`));
        });
        req.write(JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] }));
        req.end();
