require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

async function testAPI() {
    try {
        console.log("Testing API with GEMINI_API_KEY...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Say hello world'
        });
        console.log("Success! AI responded:", response.text);
    } catch (e) {
        console.error("AI Error:", e);
    }
}
testAPI();
