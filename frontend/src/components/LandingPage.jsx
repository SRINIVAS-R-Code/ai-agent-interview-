import { useState } from 'react'

const ROLES = [
  'Backend Software Engineer', 'Frontend Developer', 'Full Stack Engineer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
  'Product Manager', 'System Design Architect',
]

export default function LandingPage({ onStartScreening, onStartInterview }) {
  const [role, setRole] = useState(ROLES[0])
  const [custom, setCustom] = useState(false)
  const [mode, setMode] = useState(null) // 'screen' | 'direct'

  return (
    <div style={{ padding: '0', margin: '0' }}>
      {/* HERO SECTION */}
      <section className="perspective-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div className="fade-up" style={{ marginBottom: '48px', maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '100px', padding: '8px 20px', marginBottom: '28px', fontSize: '0.82rem', color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', backdropFilter: 'blur(10px)' }}>
            <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
            Powered by Groq LLaMA 3.3 70B & SBERT
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Hire the Top 1% with <span className="gradient-text">AI-Driven</span> Interviews
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            The premier industry-standard platform for NLP-powered resume screening and automated technical evaluations.
          </p>
        </div>

        {/* Mode picker (or setup box) */}
        {!mode && (
          <div className="fade-up" style={{ width: '100%', maxWidth: 640, marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { id: 'screen', icon: '📄', title: 'Screen + Interview', desc: 'Upload resume, match JD, then interview' },
                { id: 'direct', icon: '🎤', title: 'Direct Interview', desc: 'Jump straight into an AI interview session' },
              ].map(m => (
                <button key={m.id} className="glass card-3d" onClick={() => setMode(m.id)} style={{ padding: '32px 24px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>{m.icon}</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8, fontSize: '1.1rem' }}>{m.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Role + Setup */}
        {mode && (
          <div className="glass card-3d fade-up" style={{ width: '100%', maxWidth: 520, padding: '32px', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {mode === 'screen' ? 'Screen + Interview Setup' : 'Direct Interview Setup'}
              </span>
              <button onClick={() => setMode(null)} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", padding: '6px 12px' }}>← Back</button>
            </div>

            <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Select the target role</label>
            {!custom ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{ background: role === r ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${role === r ? 'rgba(139,92,246,0.6)' : 'var(--border)'}`, borderRadius: 8, padding: '12px 14px', color: role === r ? '#c4b5fd' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: role === r ? 600 : 400, cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter', sans-serif", transition: 'var(--transition)' }}>
                      {r}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setCustom(true); setRole('') }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif", padding: 0 }}>+ Enter custom role</button>
              </>
            ) : (
              <>
                <input className="input-field" type="text" placeholder="e.g. iOS Developer, ML Researcher..." value={role} onChange={e => setRole(e.target.value)} autoFocus style={{ marginBottom: 12, fontSize: '1rem', padding: '14px' }} />
                <button onClick={() => { setCustom(false); setRole('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", padding: '4px 0' }}>← View Presets</button>
              </>
            )}

            <div style={{ margin: '24px 0', padding: '16px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12 }}>
              <div style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Assessment Format
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                25 Questions <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(20 MCQ + 5 Written)</span>
              </div>
            </div>

            <button className="btn-primary card-3d" style={{ width: '100%', fontSize: '1rem', padding: '16px' }} disabled={!role.trim()}
              onClick={() => mode === 'screen' ? onStartScreening(role.trim()) : onStartInterview(role.trim(), 25)}>
              {mode === 'screen' ? 'Upload Resume & Screen →' : 'Start Direct Interview →'}
            </button>
          </div>
        )}
      </section>

      {/* TRUST BADGES SECTION */}
      <section style={{ padding: '40px 24px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Trusted by innovative engineering teams</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8%', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(100%)' }}>
            {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map(company => (
              <div key={company} style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="perspective-container" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 16 }}>The Future of Technical Hiring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>Eliminate bias and scale your recruiting with deterministic AI grading and contextual resume analysis.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            { icon: '🧠', title: 'SBERT NLP Matching', desc: 'We calculate semantic similarity between candidate resumes and job descriptions using Sentence-BERT to identify skill gaps before the interview.' },
            { icon: '⚡', title: 'Groq-Powered LLMs', desc: 'Experience zero-latency question generation and instantaneous answer grading powered by LLaMA 3.3 70B running on Groq LPUs.' },
            { icon: '📊', title: 'Comprehensive Evaluation', desc: 'Candidates are evaluated across 25 adaptive questions. Get an immediate hire recommendation with detailed strengths and weaknesses.' },
          ].map(f => (
            <div key={f.title} className="glass card-3d" style={{ padding: '40px 32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="solutions" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.05))', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 16 }}>How InterviewAgent Works</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 800, margin: '0 auto' }}>
            {[
              { num: '01', title: 'Upload & Contextualize', desc: 'Upload a candidate resume and job description. The AI parses the text and identifies matching skills and critical gaps.' },
              { num: '02', title: 'Dynamic Generation', desc: 'The system generates a custom 25-question interview tailored specifically to the candidate\'s background and the role requirements.' },
              { num: '03', title: 'Interactive Interview', desc: 'The candidate completes a mix of multiple-choice and open-ended written questions in a beautiful, low-stress environment.' },
              { num: '04', title: 'Instant Verdict', desc: 'Receive an automated evaluation dashboard with graded scores, hire recommendations, and transcript justifications.' },
            ].map((step, idx) => (
              <div key={idx} className="glass" style={{ display: 'flex', gap: 32, padding: 32, alignItems: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'rgba(139,92,246,0.3)', fontFamily: "'Space Grotesk', sans-serif" }}>{step.num}</div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
