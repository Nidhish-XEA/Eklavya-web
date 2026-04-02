require('dotenv').config();

async function testAPI() {
    console.log("Testing OpenRouter API with key:", process.env.OPENROUTER_API_KEY?.substring(0, 15) + '...');
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemma-3-27b-it:free',
                messages: [{ role: 'user', content: 'Say hello world in one sentence.' }]
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(data));
        console.log("✅ Success! AI responded:", data.choices[0].message.content);
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

testAPI();
