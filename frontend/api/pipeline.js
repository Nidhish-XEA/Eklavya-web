const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callAI(systemPrompt, userPrompt) {
    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://eklavya.me',
            'X-Title': 'Eklavya AI Pipeline'
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        let err = await response.text().catch(() => '');
        try { err = JSON.parse(err); } catch(e) {}
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from AI');

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
}

async function generateContent(grade, topic, feedback = null) {
    let wordLimit = grade < 5 ? '50 words max' : grade < 9 ? 'around 100 words' : '150-200 words';

    const systemPrompt = `You are an expert Educational Content Generator. 
You MUST respond with ONLY valid JSON matching this exact structure:
{
  "explanation": "string",
  "mcqs": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string (must be one of the options exactly)"
    }
  ]
}
Rules: explanation must be ${wordLimit}. mcqs must have exactly 3-5 questions. Each question must have exactly 4 options. answer must exactly match one of the options.`;

    let userPrompt = `Generate educational material for Grade ${grade} students on the topic: "${topic}".`;
    if (feedback && feedback.length > 0) {
        userPrompt += `\n\nCRITICAL: Previous attempt failed review. Fix these issues: ${feedback.join(' ')}`;
    }

    return await callAI(systemPrompt, userPrompt);
}

async function reviewContent(generatedData) {
    const systemPrompt = `You are an expert Educational Reviewer.
You MUST respond with ONLY valid JSON matching this exact structure:
{
  "status": "pass" or "fail",
  "feedback": ["string", "string"]
}
Rules: status must be exactly "pass" or "fail". feedback is an array of strings (praises if pass, issues if fail).`;

    const userPrompt = `Evaluate this educational content critically for:
1. Age appropriateness
2. Clarity and engagement  
3. Concept correctness
4. MCQ quality (3-5 questions, correct answers, 4 options each)

Content to review:
${JSON.stringify(generatedData, null, 2)}`;

    return await callAI(systemPrompt, userPrompt);
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
