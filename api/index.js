require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { runPipeline, generateContent, reviewContent } = require('./agents');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        const { grade, topic, feedback } = req.body;
        if (!grade || !topic) return res.status(400).json({ error: 'Grade and topic are required' });
        
        const result = await generateContent(grade, topic, feedback);
        res.json(result);
    } catch (error) {
        console.error("Generator error:", error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

app.post('/review', async (req, res) => {
    try {
        const { generatedData } = req.body;
        if (!generatedData) return res.status(400).json({ error: 'Generated data is required' });
        
        const review = await reviewContent(generatedData);
        res.json(review);
    } catch (error) {
        console.error("Review error:", error);
        res.status(500).json({ error: 'Failed to review content' });
    }
});

app.post('/api/pipeline', async (req, res) => {
    try {
        const { grade, topic } = req.body;
        if (!grade || !topic) return res.status(400).json({ error: 'Grade and topic are required' });
        
        const pipelineResult = await runPipeline(grade, topic);
        res.json(pipelineResult);
    } catch (error) {
        console.error("Pipeline error:", error);
        res.status(500).json({ error: 'Pipeline execution failed: ' + (error.message || String(error)) });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = 4500;
    app.listen(PORT, () => {
        console.log(`Backend is running on http://localhost:${PORT}`);
        setInterval(() => {}, 1000 * 60 * 60); 
    });
}
module.exports = app;
