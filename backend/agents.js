const { GoogleGenAI, Type, Schema } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Default to env var

const GENERATOR_MODEL = 'gemini-2.5-flash';
const REVIEWER_MODEL = 'gemini-2.5-flash';

// Define strictly structured schemas so the model output is reliably formatted
const generatorSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A simple explanation of the topic tailored appropriately to the requested grade level."
        },
        mcqs: {
            type: Type.ARRAY,
            description: "3-5 Multiple Choice Questions related to the topic at the appropriate grade level.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Exactly 4 options"
                    },
                    answer: { type: Type.STRING, description: "The correct option exactly as it appears in the options array" }
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
        status: {
            type: Type.STRING,
            enum: ["pass", "fail"],
            description: "Assess if the content meets quality standards. Pass if good, fail if significant issues exist."
        },
        feedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable feedback. Must not be empty if status is fail."
        }
    },
    required: ["status", "feedback"]
};


async function generateContent(grade, topic, feedback = null) {
    let prompt = `You are an expert Educational Content Generator. Generate educational material for Grade ${grade} students on the topic: "${topic}".`;
    
    // Limit word count based on grade informally
    if (grade < 5) {
        prompt += ' Use very simple language and ensure the explanation is at most 50 words.';
    } else if (grade < 9) {
        prompt += ' Use clear and engaging language. The explanation should be around 100 words.';
    } else {
        prompt += ' Provide a comprehensive explanation suitable for high school, around 150-200 words.';
    }

    if (feedback && feedback.length > 0) {
        prompt += `\n\nCRITICAL FIX: The previous attempt failed. Address this feedback strictly: ${feedback.join(' ')}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: GENERATOR_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: generatorSchema,
                temperature: 0.7
            }
        });

        // The response format might require parsing depending on SDK specific output format.
        // GenAI SDK returns text. We parse it:
        return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (e) {
        console.error("Agent genai error", e);
        throw e;
    }
}

async function reviewContent(generatedData) {
    const prompt = `You are an expert Educational Reviewer. Evaluate the following generated content:
    ${JSON.stringify(generatedData, null, 2)}
    
    Critically evaluate based on:
    1. Age appropriateness
    2. Clarity
    3. Concept correctness
    4. Ensure there are 3-5 MCQs and the answers are correct.
    
    Return strict JSON with 'status' (pass/fail) and actionable 'feedback' (array of strings if failing, or just praises if passing).`;

    try {
        const response = await ai.models.generateContent({
            model: REVIEWER_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reviewerSchema,
                temperature: 0.3
            }
        });

        return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (e) {
        console.error("Reviewer genai error", e);
        throw e;
    }
}

async function runPipeline(grade, topic) {
    let result = {
        original: null,
        review: null,
        refined: null
    };

    // Step 1: Generate
    result.original = await generateContent(grade, topic);

    // Step 2: Review
    result.review = await reviewContent(result.original);

    // Step 3: Conditional Refine (1 retry)
    if (result.review.status === 'fail') {
        result.refined = await generateContent(grade, topic, result.review.feedback);
    }

    return result;
}

module.exports = {
    generateContent,
    reviewContent,
    runPipeline
};
