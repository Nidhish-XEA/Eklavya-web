import { useState } from 'react';
import './index.css';
import { Sparkles, Brain, CheckCircle, AlertCircle, RefreshCw, Activity, ArrowRight, Info } from 'lucide-react';

function App() {
  const [grade, setGrade] = useState('5');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [currentStep, setCurrentStep] = useState('idle'); 
  const [pipelineResult, setPipelineResult] = useState(null);
  const [error, setError] = useState('');

  const startPipeline = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to begin');
      return;
    }
    
    setError('');
    setLoading(true);
    setPipelineResult(null);
    setCurrentStep('generating');

    try {
      // Simulate rapid UX step-through
      setTimeout(() => setCurrentStep('reviewing'), 1500); 

      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/_/backend/pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: parseInt(grade), topic })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Pipeline failed');
      }

      const data = await response.json();
      setPipelineResult(data);
      setCurrentStep('complete');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during the educational assessment format.');
      setCurrentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const renderMCQs = (mcqs) => {
    if (!mcqs || mcqs.length === 0) return null;
    return (
      <div>
        <h3 style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b'}}>
          📝 Learning Assessment
        </h3>
        <div className="mcq-grid">
          {mcqs.map((mcq, i) => (
            <div key={i} className="mcq-card">
              <div className="mcq-question">Q{i + 1}. {mcq.question}</div>
              <div className="mcq-options">
                {mcq.options.map((opt, j) => (
                  <div key={j} className={`mcq-option ${opt === mcq.answer ? 'correct' : ''}`}>
                    {opt === mcq.answer ? <CheckCircle size={18} color="var(--ek-green)" /> : <div style={{width: 18, height: 18, borderRadius: '50%', border: '2px solid #cbd5e1'}}/>}
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="app-header">
        <div className="brand-badge">Eklavya.me</div>
        <div className="header-text">
          <h2>AI Educator Pipeline</h2>
          <p>Curiosity Over Cramming</p>
        </div>
      </header>

      <div className="app-container">
        {/* LEFT COLUMN: Input Form & Pipeline Viz */}
        <div className="sidebar">
          <div className="card" style={{marginBottom: '32px'}}>
            <h3 style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Brain color="var(--ek-pink)" /> Content Configuration
            </h3>

            {error && (
              <div style={{padding: '16px', background: '#fef2f2', borderLeft: '4px solid var(--ek-red)', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontWeight: 600}}>
                {error}
              </div>
            )}

            <div className="input-group">
              <label>Target Grade Level</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} disabled={loading}>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>Grade {i+1}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Learning Topic</label>
              <input 
                type="text" 
                placeholder="e.g. Types of angles, Ecosystems" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <button className="primary" onClick={startPipeline} disabled={loading}>
              {loading ? <RefreshCw className="spinner" size={22} /> : <Sparkles size={22} />}
              {loading ? 'Running AI Agents...' : 'Generate Validated Course'}
            </button>
          </div>

          {/* Pipeline Visualizer */}
          {(currentStep !== 'idle' || pipelineResult) && (
            <div className="card animate-fade-in">
              <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <Activity color="var(--brand-primary)"/> Agent Pipeline
              </h3>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Real-time autonomous coordination</p>
              
              <div className="pipeline-stepper">
                <div className={`pipeline-step ${currentStep === 'generating' ? 'active' : ''} ${(pipelineResult || currentStep === 'reviewing' || currentStep === 'complete') ? 'completed' : ''}`}>
                  <div className="step-icon">1</div>
                  <div className="step-details">
                    <h4>Generator Agent</h4>
                    <p>Creating age-appropriate draft</p>
                  </div>
                </div>

                <div className={`pipeline-step ${currentStep === 'reviewing' ? 'active' : ''} ${pipelineResult?.review ? 'completed' : ''}`}>
                  <div className="step-icon">2</div>
                  <div className="step-details">
                    <h4>Reviewer Agent</h4>
                    <p>Validating clarity & concepts</p>
                  </div>
                </div>

                {pipelineResult?.refined && (
                  <div className={`pipeline-step completed`}>
                    <div className="step-icon">3</div>
                    <div className="step-details">
                      <h4>Refiner Agent (Inline)</h4>
                      <p>Implementing reviewer feedback</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="results-area">
          {!pipelineResult && !loading && (
            <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '500px', textAlign: 'center', background: 'transparent', border: '2px dashed #cbd5e1', boxShadow: 'none'}}>
              <div style={{background: '#f1f5f9', padding: '24px', borderRadius: '50%', marginBottom: '24px'}}>
                <Sparkles size={48} color="var(--brand-primary)" />
              </div>
              <h2 style={{fontSize: '1.8rem', marginBottom: '12px'}}>Ready to Inspire</h2>
              <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.6'}}>
                Enter a grade and a topic on the left. The Eklavya AI will generate engaging content, review it structurally, and perfect it for your students.
              </p>
            </div>
          )}

          {loading && !pipelineResult && (
            <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '500px', textAlign: 'center'}}>
              <RefreshCw className="spinner" size={56} color="var(--ek-pink)" style={{marginBottom: '24px'}} />
              <h2 style={{fontSize: '1.8rem', marginBottom: '12px'}}>Agents Orchestrating...</h2>
              <p style={{fontSize: '1.1rem', color: 'var(--text-muted)'}}>Validating cognitive framework constraints</p>
            </div>
          )}

          {pipelineResult && (
            <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              
              {/* Reviewer Verdict */}
              <div className={`status-banner ${pipelineResult.review.status}`}>
                <div className="status-content">
                  <h3>
                    {pipelineResult.review.status === 'pass' ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                    Reviewer Agent Verdict: {pipelineResult.review.status.toUpperCase()}
                  </h3>
                  <p style={{color: pipelineResult.review.status === 'pass' ? '#065f46' : '#991b1b', marginTop: '4px', fontWeight: 500}}>
                    {pipelineResult.review.status === 'pass' 
                      ? 'The generated content perfectly matched the grade level standards and constraints.'
                      : 'Initial draft failed quality checks. Triggering automatic inline refinement.'}
                  </p>
                </div>
              </div>

              {/* Actionable Feedback Display */}
              {pipelineResult.review.status === 'fail' && (
                <div className="feedback-container">
                  <h4 style={{color: '#7f1d1d', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem'}}>
                    <Info size={20}/> Critique from Reviewer:
                  </h4>
                  <ul className="feedback-list">
                    {pipelineResult.review.feedback.map((fb, idx) => (
                      <li key={idx}>{fb}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Refined Content (If failed originally) */}
              {pipelineResult.refined && (
                <div className="card animate-fade-in" style={{border: '2px solid var(--brand-primary)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                    <h2 style={{color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <Sparkles /> Final Refined Material
                    </h2>
                    <span style={{background: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700}}>
                      POST-REFINEMENT
                    </span>
                  </div>
                  
                  <div className="explanation-box">
                    <p>{pipelineResult.refined.explanation}</p>
                  </div>
                  {renderMCQs(pipelineResult.refined.mcqs)}
                </div>
              )}

              {/* Original Content */}
              <div className="card animate-fade-in" style={{opacity: pipelineResult.refined ? 0.6 : 1, transform: pipelineResult.refined ? 'scale(0.98)' : 'none'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                  <h2 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {pipelineResult.refined ? 'Original Rejected Draft' : 'Final Certified Material'}
                  </h2>
                  {pipelineResult.refined && (
                    <span style={{background: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700}}>
                      PRE-REFINEMENT
                    </span>
                  )}
                </div>

                <div className="explanation-box" style={{borderColor: pipelineResult.refined ? '#cbd5e1' : 'var(--ek-yellow)', background: pipelineResult.refined ? '#f8fafc' : '#fffbeb'}}>
                  <p>{pipelineResult.original.explanation}</p>
                </div>
                {renderMCQs(pipelineResult.original.mcqs)}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <footer style={{background: 'white', padding: '60px 40px', marginTop: '40px', borderTop: '2px solid #f1f5f9'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'}}>
            
            <div>
              <h3 style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--brand-primary)', marginBottom: '16px'}}>
                <Brain /> The Multi-Agent Pipeline
              </h3>
              <p style={{color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem'}}>
                This platform doesn't just use a single AI prompt. We utilize a rigid <strong>Multi-Agent Orchestration</strong> architecture. A Generator Agent drafts the initial educational material based on strict cognitive boundaries. Then, a Reviewer Agent independently evaluates the content for clinical accuracy, clarity, and age appropriateness. If the draft fails, the pipeline automatically triggers an inline refinement loop to self-correct the material before presenting it to the user.
              </p>
            </div>

            <div>
              <h3 style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ek-pink)', marginBottom: '16px'}}>
                <Info /> Why Eklavya.me?
              </h3>
              <p style={{color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem'}}>
                Designed specifically for the <strong>Eklavya.me AI Developer Assessment</strong>, this interface embraces the philosophy of "Curiosity Over Cramming". The UI sheds generic corporate palettes in favor of a playful, immersive, and highly engaging aesthetic drawing from Eklavya's playful environment—making learning feel like an adventure while maintaining robust enterprise-grade backend architecture.
              </p>
            </div>

          </div>
          <div style={{textAlign: 'center', marginTop: '60px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600}}>
            Developed by Nidhish for Eklavya.me | April 2026
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
