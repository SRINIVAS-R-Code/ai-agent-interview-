export default function EvaluationDashboard({ summary, transcript, role, screeningResult, onRestart }) {
  if (!summary) return null

  const avg = summary.average_score ?? 0
  const pct = Math.round((avg / 10) * 100)
  const scoreColor = avg >= 7 ? 'var(--green)' : avg >= 4 ? 'var(--yellow)' : 'var(--red)'
  const grade = avg >= 8 ? 'A' : avg >= 6 ? 'B' : avg >= 4 ? 'C' : 'D'
  const r = 54, circ = 2 * Math.PI * r, dash = (pct / 100) * circ

  const hireColor = {
    'Strong Yes': 'var(--green)', 'Yes': 'var(--green)',
    'Maybe': 'var(--yellow)', 'No': 'var(--red)'
  }[summary.hire_recommendation] || 'var(--text-muted)'

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '6px 18px', fontSize: '0.78rem', color: '#c4b5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
          Interview Complete
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: 10 }}>
          <span className="gradient-text">Final Evaluation</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Role: <strong style={{ color: 'var(--text-primary)' }}>{role}</strong>&nbsp;·&nbsp;{transcript.length} Questions
        </p>
      </div>

      {/* Combined score row — resume + interview */}
      {screeningResult && (
        <div className="glass fade-up" style={{ padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 24, flex: 1, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>Resume Match</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 800, color: screeningResult.match_score >= 70 ? 'var(--green)' : screeningResult.match_score >= 45 ? 'var(--yellow)' : 'var(--red)' }}>
                {screeningResult.match_score}%
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>Interview Score</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 800, color: scoreColor }}>{avg.toFixed(1)}/10</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>Hire Recommendation</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: hireColor }}>{summary.hire_recommendation}</div>
            </div>
          </div>
        </div>
      )}

      {/* Score + Verdict */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }} className="fade-up">
        <div className="glass" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle cx="70" cy="70" r={r} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }} />
            <text x="70" y="62" textAnchor="middle" fill={scoreColor} fontSize="26" fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{avg.toFixed(1)}</text>
            <text x="70" y="82" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontFamily="'Inter',sans-serif">/ 10</text>
          </svg>
          <div style={{ background: `${scoreColor}22`, border: `1px solid ${scoreColor}`, borderRadius: '100px', padding: '6px 20px', color: scoreColor, fontWeight: 700, fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            Grade {grade}
          </div>
          {!screeningResult && (
            <div style={{ color: hireColor, fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', fontFamily: "'Space Grotesk',sans-serif" }}>
              {summary.hire_recommendation}
            </div>
          )}
        </div>
        <div className="glass" style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Overall Verdict</div>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 24 }}>{summary.overall_verdict}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {transcript.map(t => {
              const c = t.score >= 7 ? 'var(--green)' : t.score >= 4 ? 'var(--yellow)' : 'var(--red)'
              return (
                <div key={t.question_number} title={`Q${t.question_number}: ${t.score}/10`} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${c}`, background: `${c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: c, fontFamily: "'Space Grotesk',sans-serif", cursor: 'default' }}>
                  {t.score}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="fade-up">
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span>✅</span><span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)' }}>Strengths</span>
          </div>
          {summary.strengths?.length > 0
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{summary.strengths.map((s, i) => <span key={i} className="tag tag-green" style={{ alignSelf: 'flex-start' }}>✦ {s}</span>)}</div>
            : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notable strengths identified.</p>}
        </div>
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span>🎯</span><span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171' }}>Areas to Improve</span>
          </div>
          {summary.gaps?.length > 0
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{summary.gaps.map((g, i) => <span key={i} className="tag tag-red" style={{ alignSelf: 'flex-start' }}>✦ {g}</span>)}</div>
            : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No significant gaps found.</p>}
        </div>
      </div>

      {/* Transcript */}
      <div className="glass fade-up" style={{ padding: '24px', marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 20 }}>Full Transcript</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {transcript.map(t => {
            const c = t.score >= 7 ? 'var(--green)' : t.score >= 4 ? 'var(--yellow)' : 'var(--red)'
            return (
              <div key={t.question_number} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-start', gap: 12 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: 8 }}>Q{t.question_number}.</span>{t.question}
                  </p>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, border: `2px solid ${c}`, background: `${c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: c, fontFamily: "'Space Grotesk',sans-serif" }}>{t.score}</div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 4 }}><span style={{ color: 'var(--text-muted)' }}>A: </span>{t.answer}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, fontStyle: 'italic' }}>{t.justification}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn-primary" onClick={onRestart}>New Interview</button>
        <button className="btn-secondary" onClick={() => {
          const blob = new Blob([JSON.stringify({ summary, transcript, screeningResult }, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'evaluation.json'; a.click()
        }}>Download JSON</button>
      </div>
    </div>
  )
}
