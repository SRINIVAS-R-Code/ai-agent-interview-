import React from 'react'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      {/* Navbar */}
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(8, 11, 20, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span style={{ color: '#fff' }}>I</span>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            InterviewAgent<span style={{ color: 'var(--accent)' }}>.AI</span>
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 24, fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'var(--transition)' }} className="hover-white">Features</span>
          <span onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'var(--transition)' }} className="hover-white">Solutions</span>
          <span onClick={() => alert("Pricing plans will be announced soon!")} style={{ cursor: 'pointer', transition: 'var(--transition)' }} className="hover-white">Pricing</span>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'rgba(8, 11, 20, 0.6)', padding: '40px 32px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 12 }}>
              InterviewAgent<span style={{ color: 'var(--accent)' }}>.AI</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: 280, lineHeight: 1.6 }}>
              The industry standard for AI-driven technical screening and automated behavioral interviews.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 16 }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ cursor: 'pointer' }}>Resume Screening</span>
                <span style={{ cursor: 'pointer' }}>AI Interviewer</span>
                <span style={{ cursor: 'pointer' }}>Pricing</span>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 16 }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ cursor: 'pointer' }}>About Us</span>
                <span style={{ cursor: 'pointer' }}>Careers</span>
                <span style={{ cursor: 'pointer' }}>Contact</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>© 2026 InterviewAgent AI. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
