const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generatorSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: { type: Type.STRING },
        mcqs: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING }
                },
                required: ["question", "options", "answer"]
            }
        }
    },
    required: ["explanation", "mcqs"]
};

const reviewerSchema = {
    type: Type.OBJECT,
    properties: {
        status: { type: Type.STRING, enum: ["pass", "fail"] },
        feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["status", "feedback"]
};

async function generateContent(grade, topic, feedback = null) {
    let prompt = `You are an expert Educational Content Generator. Generate educational material for Grade ${grade} students on the topic: "${topic}".`;
    if (grade < 5) prompt += ' Use very simple language, max 50 words for the explanation.';
    else if (grade < 9) prompt += ' Use clear language, around 100 words.';
    else prompt += ' Comprehensive explanation, 150-200 words.';
    if (feedback && feedback.length > 0) {
        prompt += `\n\nCRITICAL FIX: Previous attempt failed. Address strictly: ${feedback.join(' ')}`;
    }
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: generatorSchema, temperature: 0.7 }
    });
    return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
}

async function reviewContent(generatedData) {
    const prompt = `You are an expert Educational Reviewer. Critically evaluate this content:
${JSON.stringify(generatedData, null, 2)}
Evaluate: age appropriateness, clarity, concept correctness, MCQ validity.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: reviewerSchema, temperature: 0.3 }
    });
    return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { grade, topic } = req.body;
        if (!grade || !topic) return res.status(400).json({ error: 'Grade and topic are required' });

        const original = await generateContent(grade, topic);
        const review = await reviewContent(original);
        let refined = null;
        if (review.status === 'fail') {
            refined = await generateContent(grade, topic, review.feedback);
        }

        res.json({ original, review, refined });
    } catch (error) {
        console.error("Pipeline error:", error);
        res.status(500).json({ error: 'Pipeline failed: ' + (error.message || String(error)) });
    }
};
