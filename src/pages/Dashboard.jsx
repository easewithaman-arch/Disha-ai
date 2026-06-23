import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './Dashboard.css'

/* ---- Accent color palette for career cards ---- */
const ACCENT_COLORS = [
  '#00d4ff', '#ec4899', '#7c3aed', '#f59e0b',
  '#10b981', '#ef4444', '#6366f1', '#14b8a6',
  '#f97316', '#8b5cf6', '#06b6d4', '#e11d48',
]

const recentActivity = [
  {
    id: 1,
    text: 'Completed onboarding profile',
    time: 'Just now',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" />
        <path d="M6 10l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 2,
    text: 'AI career analysis generated',
    time: 'Just now',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="9" stroke="#00d4ff" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    text: 'Skills profile mapped',
    time: 'Just now',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="9" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M10 6v8M6 10h8" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

/* ---- Circular progress ring ---- */
function CircularProgress({ percent, size = 60, strokeWidth = 4, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="circular-progress__bar"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#f1f5f9"
        fontSize="14"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {percent}%
      </text>
    </svg>
  )
}

/* ---- Letter icon (colored circle with first letter) ---- */
function LetterIcon({ title, color }) {
  const letter = (title || '?').charAt(0).toUpperCase()
  return (
    <div className="career-card__icon" style={{ color }}>
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="2" fill={`${color}18`} />
        <text
          x="24"
          y="25"
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize="20"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {letter}
        </text>
      </svg>
    </div>
  )
}

/* ---- Career Card ---- */
function CareerCard({ career, index }) {
  const accent = career.accent || ACCENT_COLORS[index % ACCENT_COLORS.length]
  const growthLabel = career.growth || 'Stable'
  const growthKey = growthLabel.toLowerCase()

  return (
    <div
      className="career-card glass-card animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        '--card-accent': accent,
      }}
    >
      {/* Accent top border */}
      <div className="career-card__accent" />

      <div className="career-card__header">
        <LetterIcon title={career.title} color={accent} />
        <CircularProgress percent={career.match} size={58} strokeWidth={4} color={accent} />
      </div>

      <h3 className="career-card__title">{career.title}</h3>

      <div className="career-card__meta">
        <span className="career-card__salary">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {career.salary || 'N/A'}
        </span>
        <span className={`career-card__growth career-card__growth--${growthKey}`}>
          {growthKey === 'rising' ? (
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
              <path d="M2 10l4-4 2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
              <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {growthLabel}
        </span>
      </div>

      <div className="career-card__skills">
        {(career.skills || []).map((skill) => (
          <span key={skill} className="career-card__skill-tag">
            {skill}
          </span>
        ))}
      </div>

      <Link to={`/career/${career.id}`} className="career-card__explore-btn">
        Explore
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}

/* ---- Main Dashboard ---- */
export default function Dashboard() {
  const { profile, careerPaths } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  /* ---- No profile → redirect to onboarding ---- */
  if (!profile) {
    return (
      <div className="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ color: '#fff' }}>Welcome to DISHA AI!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Complete your profile to discover career paths</p>
        <Link to="/onboarding" className="dashboard-explore-btn">Start Onboarding</Link>
      </div>
    )
  }

  /* ---- Derive data from context ---- */
  const careers = (careerPaths?.careers || []).map((c, i) => ({
    ...c,
    id: c.id || i + 1,
    accent: ACCENT_COLORS[i % ACCENT_COLORS.length],
  }))

  const matchScore = careerPaths?.overallMatchScore || '--'
  const pathsExplored = careerPaths?.careers?.length || 0

  // Count skills from profile.skills object
  const skillsMapped = profile.skills
    ? Object.values(profile.skills).flat().filter(Boolean).length
    : 0

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Explorer'
  const insightText = careerPaths?.insight || null

  return (
    <div className="page-wrapper dashboard">
      {/* ===== Background particles ===== */}
      <div className="dashboard__particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="dashboard__particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      <div className="container dashboard__layout">
        {/* ===== Main Content ===== */}
        <main className="dashboard__main">
          {/* --- Header --- */}
          <header className="dashboard__header animate-fade-in-up">
            <div className="dashboard__welcome">
              <h1 className="dashboard__title">
                Welcome back, {firstName}! <span className="dashboard__wave">👋</span>
              </h1>
              <p className="dashboard__subtitle">
                {careers.length > 0
                  ? `Your AI has discovered ${careers.length} potential futures`
                  : 'Your AI is ready to explore career paths'}
              </p>
            </div>

            <div className="dashboard__stats">
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">{matchScore}{matchScore !== '--' ? '%' : ''}</div>
                <div className="dashboard__stat-label">Match Score</div>
              </div>
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">{pathsExplored}</div>
                <div className="dashboard__stat-label">Paths Explored</div>
              </div>
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">{skillsMapped}</div>
                <div className="dashboard__stat-label">Skills Mapped</div>
              </div>
            </div>
          </header>

          {/* --- Universe Constellation --- */}
          {careers.length > 0 && (
            <section className="constellation animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="constellation__ring constellation__ring--outer" />
              <div className="constellation__ring constellation__ring--inner" />

              {/* Center "You" node */}
              <div className="constellation__center">
                <div className="constellation__center-pulse" />
                <span className="constellation__center-label">You</span>
              </div>

              {/* Orbiting career dots */}
              {careers.map((c, i) => {
                const angle = (i / careers.length) * 360
                return (
                  <div
                    key={c.id}
                    className="constellation__node"
                    style={{
                      '--angle': `${angle}deg`,
                      '--accent': c.accent,
                    }}
                  >
                    <div className="constellation__dot" />
                    <span className="constellation__node-label">{c.title.split(' ')[0]}</span>
                  </div>
                )
              })}

              {/* Connecting lines rendered behind the nodes */}
              <svg className="constellation__lines" viewBox="0 0 400 400" fill="none">
                {careers.map((c, i) => {
                  const angle = ((i / careers.length) * 360 - 90) * (Math.PI / 180)
                  const x = 200 + Math.cos(angle) * 140
                  const y = 200 + Math.sin(angle) * 140
                  return (
                    <line
                      key={c.id}
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  )
                })}
              </svg>
            </section>
          )}

          {/* --- Career Cards Section --- */}
          <section className="careers-section">
            <div className="careers-section__header animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="careers-section__title">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="M12 2l2.09 6.26L20.18 9l-5 4.09L16.54 20 12 16.27 7.46 20l1.36-6.91L4 9l5.91-.74L12 2z" fill="url(#starGrad)" />
                  <defs>
                    <linearGradient id="starGrad" x1="4" y1="2" x2="20" y2="20">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                Top Career Paths
              </h2>

              <div className="careers-section__tabs">
                {['all', 'rising', 'stable'].map((tab) => (
                  <button
                    key={tab}
                    className={`careers-section__tab ${activeTab === tab ? 'careers-section__tab--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="careers-grid">
              {careers.length > 0 ? (
                careers
                  .filter((c) => {
                    if (activeTab === 'all') return true
                    return (c.growth || 'stable').toLowerCase() === activeTab
                  })
                  .map((career, i) => (
                    <CareerCard key={career.id} career={career} index={i} />
                  ))
              ) : (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                    No career paths generated yet. Complete your profile to get AI-powered recommendations.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* ===== Sidebar ===== */}
        <aside className="dashboard__sidebar">
          {/* Quick Actions */}
          <div className="sidebar-card glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="sidebar-card__title">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <path d="M11 2L4 12h5l-1 6 7-10h-5l1-6z" fill="url(#boltGrad)" />
                <defs>
                  <linearGradient id="boltGrad" x1="4" y1="2" x2="15" y2="18">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              Quick Actions
            </h3>

            <div className="sidebar-actions">
              <Link to="/compare" className="sidebar-action">
                <div className="sidebar-action__icon" style={{ background: 'rgba(0,212,255,0.12)', color: '#00d4ff' }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <rect x="2" y="4" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="12" y="4" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 8h4M8 12h4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" />
                  </svg>
                </div>
                <div>
                  <span className="sidebar-action__label">Compare Paths</span>
                  <span className="sidebar-action__desc">Side-by-side analysis</span>
                </div>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className="sidebar-action__arrow">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link to="/skills" className="sidebar-action">
                <div className="sidebar-action__icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <span className="sidebar-action__label">Skills Map</span>
                  <span className="sidebar-action__desc">Gap analysis &amp; growth</span>
                </div>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className="sidebar-action__arrow">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link to="/mentor" className="sidebar-action">
                <div className="sidebar-action__icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <path d="M4 16v-1a4 4 0 014-4h4a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <span className="sidebar-action__label">AI Mentor</span>
                  <span className="sidebar-action__desc">Personalized guidance</span>
                </div>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className="sidebar-action__arrow">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* AI Insights */}
          <div className="sidebar-card sidebar-card--insight glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="sidebar-card__title">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <circle cx="10" cy="10" r="8" stroke="url(#insightGrad)" strokeWidth="1.5" />
                <path d="M10 6v5l3 2" stroke="url(#insightGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="insightGrad" x1="2" y1="2" x2="18" y2="18">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              AI Insights
            </h3>
            <div className="insight__body">
              <div className="insight__sparkle" aria-hidden="true">✨</div>
              <p className="insight__text">
                {insightText || (
                  <>
                    Complete your profile and let our AI analyze your strengths to provide
                    personalized career insights and recommendations.
                  </>
                )}
              </p>
            </div>
            {careers.length > 0 && (
              <Link to={`/career/${careers[0].id}`} className="insight__link">
                Explore top match
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          {/* Recent Activity */}
          <div className="sidebar-card glass-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="sidebar-card__title">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <circle cx="10" cy="10" r="8" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <path d="M10 6v4l3 2" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Recent Activity
            </h3>

            <ul className="activity-list">
              {recentActivity.map((item) => (
                <li key={item.id} className="activity-item">
                  <div className="activity-item__icon">{item.icon}</div>
                  <div className="activity-item__content">
                    <span className="activity-item__text">{item.text}</span>
                    <span className="activity-item__time">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
