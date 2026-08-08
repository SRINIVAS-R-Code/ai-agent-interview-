import { useState } from 'react'
import LandingPage from './components/LandingPage'
import ResumeScreening from './components/ResumeScreening'
import InterviewSession from './components/InterviewSession'
import EvaluationDashboard from './components/EvaluationDashboard'

// Phases: 'landing' | 'screening' | 'interview' | 'results'
export default function App() {
  const [phase, setPhase] = useState('landing')
  const [config, setConfig] = useState({ role: '', n: 5, jdContext: '', screeningResult: null, sessionId: null })
  const [transcript, setTranscript] = useState([])
  const [summary, setSummary] = useState(null)

  const handleStartScreening = (role) => {
    setConfig(c => ({ ...c, role }))
    setPhase('screening')
  }

  const handleStartInterview = ({ role, n, jdContext, screeningResult, sessionId }) => {
    setConfig({ role, n, jdContext: jdContext || '', screeningResult: screeningResult || null, sessionId: sessionId || null })
    setTranscript([])
    setSummary(null)
    setPhase('interview')
  }

  const handleFinish = (transcript, summary) => {
    setTranscript(transcript)
    setSummary(summary)
    setPhase('results')
  }

  const handleRestart = () => {
    setPhase('landing')
    setTranscript([])
    setSummary(null)
    setConfig({ role: '', n: 5, jdContext: '', screeningResult: null, sessionId: null })
  }

  return (
    <>
      {phase === 'landing' && (
        <LandingPage
          onStartScreening={handleStartScreening}
          onStartInterview={(role, n) => handleStartInterview({ role, n })}
        />
      )}
      {phase === 'screening' && (
        <ResumeScreening
          initialRole={config.role}
          onStartInterview={handleStartInterview}
          onBack={() => setPhase('landing')}
        />
      )}
      {phase === 'interview' && (
        <InterviewSession
          role={config.role}
          n={config.n}
          jdContext={config.jdContext}
          sessionId={config.sessionId}
          onFinish={handleFinish}
        />
      )}
      {phase === 'results' && (
        <EvaluationDashboard
          summary={summary}
          transcript={transcript}
          role={config.role}
          screeningResult={config.screeningResult}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
