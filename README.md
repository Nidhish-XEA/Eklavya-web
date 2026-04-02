# Eklavya.me Core - AI Educator Pipeline 🚀

An autonomous, multi-agent educational content generation platform built as a technical assessment for the AI Developer Internship at Eklavya.me.

## 🌟 Overview

The Eklavya AI Pipeline is designed to encapsulate the philosophy of **"Curiosity Over Cramming"**. By leveraging the power of Large Language Models (Gemini 2.5), this system dynamically generates age-appropriate, conceptually accurate, and highly engaging educational material tailored to any grade level.

### 🤖 Multi-Agent Architecture

The architecture relies strictly on a multi-agent orchestrated pipeline rather than a single LLM call. This ensures output reliability, safety, and high-quality pedagogical standards.

1. **Generator Agent**: 
   - **Responsibility**: Drafts the initial educational content (explanations and structured MCQs) based on the target audience's grade and the specified topic.
   - **Engine**: Generates strictly structured JSON outputs tailored to the cognitive level of the student.
   
2. **Reviewer Agent**: 
   - **Responsibility**: Acts as an autonomous quality assurance checkpoint.
   - **Criteria**: Evaluates the Generator's draft for Age Appropriateness, Conceptual Correctness, and Clarity.
   - **Action**: Returns a precise `"pass"` or `"fail"` verdict along with actionable, constructive feedback.

3. **Inline Refinement**:
   - If the Reviewer Agent flags the content with a `"fail"`, the orchestrator immediately intercepts the payload and re-runs the Generator Agent, embedding the Reviewer's strict critique to correct the output.

## 💻 Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Custom modern UI echoing Eklavya's colorful EdTech branding)
- **Backend**: Node.js, Express.js
- **AI Middleware**: `@google/genai` (Gemini Flash Model)
- **Architecture**: Micro-Agent Pipeline

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google API Key for Gemini.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nidhish-XEA/Eklavya-web.git
   cd Eklavya-web
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your API key
   echo "GEMINI_API_KEY=your_key_here" > .env
   # Start the Express server on port 4500
   npm start
   ```

3. **Frontend Setup**
   Open a new terminal window.
   ```bash
   cd frontend
   npm install
   # Start the Vite development server
   npm run dev
   ```

4. **Run the App**
   Navigate to `http://localhost:5173` in your browser.

## 🎨 UI/UX Design

The user interface was crafted deliberately to reflect a premium EdTech atmosphere. Moving away from generic developer templates, the application features a custom, playful-yet-professional interface explicitly utilizing Eklavya.me's "colorful pastry" inspiration (Math Greens, Science Pinks, Reading Yellows) to build an immersive environment for the pipeline operator. 

## 📝 Implementation Details

- **Strict Formatting**: Both Agents guarantee structured JSON responses. A custom deterministic-parsing regex strips out any unsolicited Markdown backticks returned by the LLM before feeding it into the application layer.
- **Visual Pedagogy**: The UI physically visualizes the Agent steps (Generating → Reviewing → Refining) so that evaluators can verify the architectural flow in real time.
