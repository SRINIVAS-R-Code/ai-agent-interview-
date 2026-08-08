import { useState, useEffect } from 'react'

function ScorePill({ score, justification }) {
  const cls = score >= 7 ? 'score-high' : score >= 4 ? 'score-mid' : 'score-low'
  const label = score >= 7 ? 'Strong' : score >= 4 ? 'Decent' : 'Weak'
  return (
    <div className="glass pop-in" style={{ padding: '20px 24px', marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 20, borderRadius: 'var(--radius)' }}>
      <div className={`score-badge ${cls}`}>{score}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: score >= 7 ? 'var(--green)' : score >= 4 ? 'var(--yellow)' : 'var(--red)', marginBottom: 6 }}>{label} Answer</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{justification}</p>
      </div>
    </div>
  )
}

export default function InterviewSession({ role, n, jdContext, sessionId: initialSessionId, onFinish }) {
  const [questions, setQuestions] = useState([])
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [transcript, setTranscript] = useState([])
  const [scoreResult, setScoreResult] = useState(null)
  const [loadingQ, setLoadingQ] = useState(true)
  const [loadingScore, setLoadingScore] = useState(false)
  const [loadingFinal, setLoadingFinal] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoadingQ(true)
    setError(null)
    fetch('/api/interview/questions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, jd_context: jdContext || '' }),
    })
      .then(r => { if (!r.ok) throw new Error('Question generation failed'); return r.json() })
      .then(data => {
        setQuestions(data.questions)
        if (data.session_id) setSessionId(data.session_id)
        setLoadingQ(false)
      })
      .catch(e => { setError(e.message); setLoadingQ(false) })
  }, [role, jdContext])

  const handleSubmitAnswer = async (submittedAnswer = answer) => {
    if (!submittedAnswer.trim() || loadingScore) return
    setLoadingScore(true)
    setScoreResult(null)
    const currentQ = questions[current]
    try {
      const res = await fetch('/api/interview/score/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          question_number: current + 1, 
          question: currentQ.text, 
          answer: submittedAnswer,
          question_type: currentQ.type || 'text',
          correct_answer: currentQ.correct_answer || '',
          options: currentQ.options || []
        }),
      })
      const result = await res.json()
      const entry = { question_number: current + 1, question: currentQ.text, answer: submittedAnswer, score: result.score, justification: result.justification }
      setTranscript(prev => [...prev, entry])
      setScoreResult(result)
      setAnswered(true)
    } catch { setError('Scoring failed.') }
    setLoadingScore(false)
  }

  const handleNext = async () => {
    const next = current + 1
    if (next >= questions.length) {
      setLoadingFinal(true)
      try {
        const res = await fetch('/api/interview/evaluate/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, transcript }),
        })
        const summary = await res.json()
        onFinish(transcript, summary)
      } catch { setError('Final evaluation failed.'); setLoadingFinal(false) }
    } else {
      setCurrent(next); setAnswer(''); setScoreResult(null); setAnswered(false)
    }
  }

  const progress = questions.length > 0 ? ((current + (answered ? 1 : 0)) / questions.length) * 100 : 0
  const isLast = current === questions.length - 1

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: 40, maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
        <p style={{ color: 'var(--red)', marginBottom: 20 }}>{error}</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  )

  if (loadingQ) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
      <p style={{ color: 'var(--text-muted)' }}>Generating {n} questions for <strong style={{ color: 'var(--text-secondary)' }}>{role}</strong>{jdContext ? ' (JD-tailored)' : ''}...</p>
    </div>
  )

  if (loadingFinal) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
      <p style={{ color: 'var(--text-muted)' }}>Generating your final evaluation...</p>
    </div>
  )

  return (
    <div className="perspective-container" style={{ minHeight: '100vh', padding: '32px 24px', maxWidth: 680, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ marginBottom: 32 }} className="fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Role: </span>
            <span style={{ color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600 }}>{role}</span>
            {jdContext && <span style={{ color: 'var(--green)', fontSize: '0.78rem', marginLeft: 8, fontWeight: 500 }}>JD-tailored</span>}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Q <strong style={{ color: 'var(--text-secondary)' }}>{current + 1}</strong> / {questions.length}
          </span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      {/* Question */}
      <div key={current} className="glass card-3d fade-up" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '4px 14px', fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Q{current + 1}</div>
          {questions[current]?.type === 'mcq' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Multiple Choice</div>
          )}
        </div>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-primary)', fontWeight: 500 }}>{questions[current]?.text || questions[current]}</p>
      </div>

      {/* Answer */}
      {!answered ? (
        <div className="fade-up" style={{ animationDelay: '0.1s' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Your Answer</label>
          
          {questions[current]?.type === 'mcq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {questions[current].options?.map((opt, i) => (
                <button key={i} className="card-3d" onClick={() => { setAnswer(opt); handleSubmitAnswer(opt); }} disabled={loadingScore} style={{ textAlign: 'left', padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', cursor: loadingScore ? 'not-allowed' : 'pointer', transition: 'var(--transition)', fontFamily: "'Inter', sans-serif", fontSize: '0.95rem' }}>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="card-3d">
              <textarea className="input-field" placeholder="Type your answer..." value={answer} onChange={e => setAnswer(e.target.value)} style={{ minHeight: 150 }}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleSubmitAnswer() }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Ctrl+Enter to submit</span>
                <button className="btn-primary" onClick={() => handleSubmitAnswer()} disabled={!answer.trim() || loadingScore} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {loadingScore ? <><span className="spinner" /> Scoring...</> : 'Submit Answer →'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="fade-up">
          <div className="glass card-3d" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', marginBottom: 4 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Answer</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{answer}</p>
          </div>
          {scoreResult && <ScorePill score={scoreResult.score} justification={scoreResult.justification} />}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn-primary" onClick={handleNext}>
              {isLast ? 'See Final Results →' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}

      {/* Answered history */}
      {transcript.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Completed — {transcript.length} question{transcript.length > 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transcript.map(t => {
              const cls = t.score >= 7 ? 'score-high' : t.score >= 4 ? 'score-mid' : 'score-low'
              return (
                <div key={t.question_number} className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className={`score-badge ${cls}`} style={{ width: 44, height: 44, fontSize: '1rem', flexShrink: 0 }}>{t.score}</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{t.question}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
