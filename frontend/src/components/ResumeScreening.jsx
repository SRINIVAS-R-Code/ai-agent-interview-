import { useState, useRef } from 'react'

function ScoreCircle({ score }) {
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)'
  const r = 40, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x="50" y="46" textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{score}%</text>
      <text x="50" y="62" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="'Inter',sans-serif">match</text>
    </svg>
  )
}

export default function ResumeScreening({ initialRole, onStartInterview, onBack }) {
  const [role] = useState(initialRole || '')
  const [jdText, setJdText] = useState('')
  const [n, setN] = useState(5)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleAnalyze = async () => {
    if (!file || !jdText.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jd_text', jdText)
      formData.append('role', role)
      const res = await fetch('/api/screening/analyze/', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Analysis failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleProceed = () => {
    onStartInterview({
      role,
      n: 25,
      jdContext: jdText,
      screeningResult: result,
      sessionId: null,
    })
  }

  return (
    <div className="perspective-container" style={{ minHeight: '100vh', padding: '32px 24px', maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif", marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Resume Screening</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Role: <strong style={{ color: 'var(--text-primary)' }}>{role}</strong>
          &nbsp;·&nbsp;NLP similarity powered by SBERT + TF-IDF
        </p>
      </div>

      {!result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* File upload */}
          <div className="glass card-3d fade-up" style={{ padding: 24 }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>1. Upload Resume (PDF / DOCX / TXT)</label>
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              style={{ border: `2px dashed ${file ? 'rgba(139,92,246,0.6)' : 'var(--border)'}`, borderRadius: 12, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', transition: 'var(--transition)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>{file ? '✅' : '📄'}</div>
              <p style={{ color: file ? '#c4b5fd' : 'var(--text-primary)', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
                {file ? file.name : 'Drag and drop your resume here'}
              </p>
              {!file && (
                <button className="btn-secondary" style={{ pointerEvents: 'none', padding: '6px 16px', fontSize: '0.85rem', marginTop: 8 }}>
                  Browse Files
                </button>
              )}
            </div>
            {file && <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</p>}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} onClick={e => e.stopPropagation()} style={{ display: 'none' }} />
          </div>

          {/* JD input */}
          <div className="glass card-3d fade-up" style={{ padding: 24 }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Job Description</label>
            <textarea className="input-field" placeholder="Paste the job description here..." value={jdText} onChange={e => setJdText(e.target.value)} style={{ minHeight: 180 }} />
          </div>

          {error && (
            <div style={{ background: 'var(--red-glow)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: '0.88rem' }}>{error}</div>
          )}

          <button className="btn-primary card-3d" onClick={handleAnalyze} disabled={!file || !jdText.trim() || loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {loading ? <><span className="spinner" /> Analyzing with NLP...</> : 'Analyze Resume Match →'}
          </button>
        </div>
      ) : (
        /* Results */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Score card */}
          <div className="glass card-3d pop-in" style={{ padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 28 }}>
            <ScoreCircle score={result.match_score} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                NLP Method: <span style={{ color: '#c4b5fd' }}>{result.method === 'sbert+tfidf' ? 'SBERT + TF-IDF' : 'TF-IDF'}</span>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                {result.recommendation}
              </h3>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {result.sbert_score != null && <span>SBERT: <strong style={{ color: 'var(--text-secondary)' }}>{(result.sbert_score * 100).toFixed(1)}%</strong></span>}
                <span>TF-IDF: <strong style={{ color: 'var(--text-secondary)' }}>{(result.tfidf_score * 100).toFixed(1)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass card-3d" style={{ padding: 20 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', marginBottom: 12 }}>
                Matched Skills ({result.matched_skills.length})
              </div>
              {result.matched_skills.length > 0
                ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{result.matched_skills.map(s => <span key={s} className="tag tag-green">{s}</span>)}</div>
                : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None detected</p>}
            </div>
            <div className="glass card-3d" style={{ padding: 20 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171', marginBottom: 12 }}>
                Missing Skills ({result.missing_skills.length})
              </div>
              {result.missing_skills.length > 0
                ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{result.missing_skills.map(s => <span key={s} className="tag tag-red">{s}</span>)}</div>
                : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No gaps detected</p>}
            </div>
          </div>

          {/* Proceed */}
          <div className="glass card-3d" style={{ padding: 20 }}>
            <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8 }}>
              <div style={{ color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Format: 25 Questions
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                20 Multiple Choice + 5 Written Answers
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary card-3d" onClick={handleProceed} style={{ flex: 1 }}>
                Start Interview (JD-Tailored) →
              </button>
              <button className="btn-secondary card-3d" onClick={() => setResult(null)}>Re-analyze</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
