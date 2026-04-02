<div align="center">

<img src="https://img.shields.io/badge/Eklavya.me-AI%20Developer%20Assessment-ec4899?style=for-the-badge" />
<img src="https://img.shields.io/badge/Built%20With-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google" />
<img src="https://img.shields.io/badge/Deployed%20On-Vercel-000000?style=for-the-badge&logo=vercel" />

# 🎓 Eklavya AI Educator Pipeline

### An autonomous Multi-Agent system that generates, reviews, and refines educational content using real LLMs.

**[🚀 Live Demo →](https://eklavya-evm1fonsj-nidhish1016-3054s-projects.vercel.app/)**

</div>

---

## 🌟 Why I Built This

Eklavya.me's core philosophy is **"Curiosity Over Cramming"** — the belief that learning should be an adventure, not a pressure-cooker.

The biggest challenge in digital education isn't content *creation*, it's content *quality assurance*. A single poorly-worded explanation for a Grade 3 student can confuse, discourage, and worse — teach incorrect concepts that take years to unlearn.

This project is my answer to that challenge: an **autonomous AI pipeline** where two specialized agents collaborate — one to create, one to critique — so that no student ever receives content that hasn't been rigorously reviewed. It's not just a chatbot wrapped in a pretty UI. It is a real multi-agent system designed to self-improve.

---

## 🤖 How the Agent Pipeline Works

```
┌───────────────────────────────────────────────────────┐
│                   USER INPUT                          │
│              Grade Level + Topic                      │
└────────────────────────┬──────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│              🧠 GENERATOR AGENT                       │
│  • Receives: { grade, topic }                         │
│  • Adapts language to cognitive level                 │
│  • Generates explanation + 3–5 MCQs                   │
│  • Returns strictly typed JSON                        │
└────────────────────────┬──────────────────────────────┘
                         │
             ┌───────────▼───────────┐
             │  { explanation, mcqs } │
             └───────────┬───────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│              🔍 REVIEWER AGENT                        │
│  • Evaluates: Age appropriateness                     │
│  • Evaluates: Conceptual correctness                  │
│  • Evaluates: Clarity of explanation                  │
│  • Returns: { status: "pass|fail", feedback: [...] }  │
└────────────────────────┬──────────────────────────────┘
                         │
          ┌──────────────▼──────────────┐
          │                             │
     ✅ PASS                       ❌ FAIL
          │                             │
          ▼                             ▼
    Final Content         ┌─────────────────────────────┐
    Delivered to          │  ♻️ INLINE REFINEMENT        │
       User               │  Feedback injected into      │
                          │  Generator prompt (1 retry)  │
                          └─────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 Generator Agent | Produces grade-calibrated explanations + MCQs with structured JSON output |
| 🔍 Reviewer Agent | Independently evaluates content before it reaches the student |
| ♻️ Auto-Refinement | Reviewer feedback is injected back into Generator prompt for 1 retry |
| 🎨 Eklavya-branded UI | Clean, colorful EdTech aesthetic matching Eklavya's brand personality |
| 📊 Pipeline Visualizer | Real-time display of which agent is currently running |
| ✅ Structured MCQs | Color-coded correct answers rendered beautifully |
| 📱 Responsive Design | Works perfectly on all screen sizes |

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite 8
- Vanilla CSS — Custom dark/light EdTech design system
- Lucide React — Premium icon library
- Google Fonts — Nunito + Outfit

**Backend (Serverless)**
- Vercel Serverless Functions (Node.js 20)
- `@google/genai` SDK — Gemini 2.5 Flash model
- Structured JSON Schema output enforcement
- CORS-enabled REST API

**AI**
- Model: `gemini-2.5-flash`
- Technique: Structured outputs via JSON Schema (not prompt parsing)
- Two independent agent calls per pipeline run

---

## 📐 Agent Definitions

### Generator Agent
```json
Input:  { "grade": 4, "topic": "Types of angles" }

Output: {
  "explanation": "Angles are the space between two lines that meet...",
  "mcqs": [
    {
      "question": "What do we call an angle that is exactly 90 degrees?",
      "options": ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],
      "answer": "Right angle"
    }
  ]
}
```

### Reviewer Agent
```json
Input:  { ...Generator Output... }

Output: {
  "status": "pass",
  "feedback": ["Explanation uses age-appropriate language", "MCQ answers are correct"]
}
```

---

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/Nidhish-XEA/Eklavya-web.git
cd Eklavya-web

# Backend (Express for local dev)
cd backend
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
node server.js        # Runs on http://localhost:4500

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev           # Runs on http://localhost:5173
```

> **Get a free Gemini API key at:** [aistudio.google.com](https://aistudio.google.com)

---

## 📁 Project Structure

```
Eklavya-web/
├── frontend/
│   ├── api/
│   │   └── pipeline.js     # ← Vercel Serverless Function (full agent pipeline)
│   ├── src/
│   │   ├── App.jsx          # Main UI + pipeline orchestration display
│   │   └── index.css        # Custom Eklavya design system
│   ├── package.json
│   └── vite.config.js       # Dev proxy to localhost:4500
│
├── backend/
│   ├── server.js            # Express server (local development)
│   ├── agents.js            # Generator + Reviewer agent logic
│   └── package.json
│
└── README.md
```

---

## 🎨 UI Design Philosophy

Rather than a generic developer template, the UI was consciously designed to echo **Eklavya's brand identity**:

- 🟢 **Green** for correct answers and passing status (Math success)
- 🩷 **Pink** for agent labels and active states (Science energy)
- 🟡 **Yellow** for explanations and content cards (Reading warmth)
- 🔵 **Blue** for the primary action button (Trust and clarity)

The pipeline visualizer on the left side explicitly shows evaluators that **this is a real orchestrated AI workflow**, not a single prompt disguised as a pipeline.

---

<div align="center">

**Built with 💙 by Nidhish for the Eklavya.me AI Developer Assessment**

*Submission Deadline: 03 April 2026*

[🌐 Live App](https://eklavya-evm1fonsj-nidhish1016-3054s-projects.vercel.app/) · [📁 Repository](https://github.com/Nidhish-XEA/Eklavya-web)

</div>
