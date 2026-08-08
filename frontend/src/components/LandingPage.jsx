import { useState } from 'react'

const ROLES = [
  'Backend Software Engineer', 'Frontend Developer', 'Full Stack Engineer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
  'Product Manager', 'System Design Architect',
]

export default function LandingPage({ onStartScreening, onStartInterview }) {
  const [role, setRole] = useState('')
  const [n, setN] = useState(5)
  const [custom, setCustom] = useState(false)
  const [mode, setMode] = useState(null) // 'screen' | 'direct'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '100px', padding: '8px 20px', marginBottom: '28px', fontSize: '0.82rem', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
          Groq · LLaMA 3.3 70B · SBERT NLP
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, lineHeight: 1.1, marginBottom: '20px' }}>
          <span className="gradient-text">AI Interview</span><br />
          <span style={{ color: 'var(--text-primary)' }}>Agent</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', lineHeight: 1.7 }}>
          Screen resumes with NLP similarity scoring, then conduct AI-powered interviews with real-time feedback.
        </p>
      </div>

      {/* Mode picker */}
      {!mode && (
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 520, marginBottom: 32 }}>
          {[
            { id: 'screen', icon: '📄', title: 'Screen + Interview', desc: 'Upload resume, match JD, then interview' },
            { id: 'direct', icon: '🎤', title: 'Direct Interview', desc: 'Jump straight into an AI interview session' },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 20px', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)', fontFamily: "'Inter', sans-serif" }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{m.icon}</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, fontSize: '0.95rem' }}>{m.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>{m.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Role + N selector */}
      {mode && (
        <div className="glass fade-up" style={{ width: '100%', maxWidth: 520, padding: '32px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {mode === 'screen' ? 'Screen + Interview' : 'Direct Interview'}
            </span>
            <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>← Back</button>
          </div>

          {/* Role grid */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Select Role</label>
          {!custom ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{ background: role === r ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${role === r ? 'rgba(139,92,246,0.6)' : 'var(--border)'}`, borderRadius: 8, padding: '10px 12px', color: role === r ? '#c4b5fd' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: role === r ? 600 : 400, cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter', sans-serif", transition: 'var(--transition)' }}>
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={() => { setCustom(true); setRole('') }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", padding: 0 }}>+ Custom role</button>
            </>
          ) : (
            <>
              <input className="input-field" type="text" placeholder="e.g. iOS Developer, ML Researcher..." value={role} onChange={e => setRole(e.target.value)} autoFocus style={{ marginBottom: 8 }} />
              <button onClick={() => { setCustom(false); setRole('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", padding: '4px 0' }}>← Presets</button>
            </>
          )}

          {/* N questions */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 10px' }}>
            Questions — <span style={{ color: '#c4b5fd' }}>{n}</span>
          </label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[3, 5, 7, 10].map(num => (
              <button key={num} onClick={() => setN(num)} style={{ flex: 1, padding: 10, background: n === num ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${n === num ? 'rgba(139,92,246,0.6)' : 'var(--border)'}`, borderRadius: 8, color: n === num ? '#c4b5fd' : 'var(--text-secondary)', fontWeight: n === num ? 700 : 400, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'var(--transition)' }}>{num}</button>
            ))}
          </div>

          <button className="btn-primary" style={{ width: '100%' }} disabled={!role.trim()}
            onClick={() => mode === 'screen' ? onStartScreening(role.trim()) : onStartInterview(role.trim(), n)}>
            {mode === 'screen' ? '📄 Upload Resume & Screen →' : '🎤 Start Interview →'}
          </button>
        </div>
      )}

      {/* Feature pills */}
      <div className="fade-up" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🧠 SBERT NLP Scoring', '⚡ Groq LLaMA 3.3 70B', '📊 Skill Gap Analysis', '🎯 Hire Recommendation'].map(f => (
          <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{f}</span>
        ))}
      </div>
    </div>
  )
}
