import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const careerData = [
  {
    id: 1,
    title: 'AI/ML Engineer',
    match: 96,
    salary: '$120K–$200K',
    growth: 'Rising',
    skills: ['Python', 'Deep Learning', 'Mathematics'],
    accent: '#00d4ff',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="18" r="3" fill="currentColor" />
        <circle cx="30" cy="18" r="3" fill="currentColor" />
        <circle cx="18" cy="30" r="3" fill="currentColor" />
        <circle cx="30" cy="30" r="3" fill="currentColor" />
        <line x1="18" y1="18" x2="30" y2="30" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="18" x2="18" y2="30" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'UX Designer',
    match: 91,
    salary: '$90K–$150K',
    growth: 'Rising',
    skills: ['Design Thinking', 'Prototyping', 'User Research'],
    accent: '#ec4899',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M16 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="16" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Data Scientist',
    match: 89,
    salary: '$110K–$180K',
    growth: 'Rising',
    skills: ['Statistics', 'Python', 'Visualization'],
    accent: '#7c3aed',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <rect x="8" y="28" width="6" height="12" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="17" y="20" width="6" height="20" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="26" y="14" width="6" height="26" rx="1" fill="currentColor" opacity="0.85" />
        <rect x="35" y="8" width="6" height="32" rx="1" fill="currentColor" />
        <line x1="6" y1="42" x2="43" y2="42" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Product Manager',
    match: 85,
    salary: '$100K–$170K',
    growth: 'Stable',
    skills: ['Strategy', 'Analytics', 'Communication'],
    accent: '#f59e0b',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="18" x2="22" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="13" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="31" cy="28" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 26l4 4 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Biotech Researcher',
    match: 82,
    salary: '$80K–$140K',
    growth: 'Rising',
    skills: ['Biology', 'Lab Skills', 'Research'],
    accent: '#10b981',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <path d="M18 8v12l-8 16a4 4 0 003.5 6h21a4 4 0 003.5-6l-8-16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="24" cy="34" rx="6" ry="3" fill="currentColor" opacity="0.4" />
        <circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="28" cy="32" r="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Cybersecurity Analyst',
    match: 78,
    salary: '$95K–$160K',
    growth: 'Rising',
    skills: ['Networks', 'Security', 'Analysis'],
    accent: '#ef4444',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="career-card__icon-svg">
        <path d="M24 4L8 12v12c0 10 8 18 16 20 8-2 16-10 16-20V12L24 4z" stroke="currentColor" strokeWidth="2" />
        <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const recentActivity = [
  {
    id: 1,
    text: 'Completed "Analytical Thinking" assessment',
    time: '2 hours ago',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" />
        <path d="M6 10l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 2,
    text: 'Explored AI/ML Engineer career path',
    time: '5 hours ago',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="9" stroke="#00d4ff" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    text: 'New skill match found: Machine Learning',
    time: '1 day ago',
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

/* ---- Career Card ---- */
function CareerCard({ career, index }) {
  return (
    <div
      className="career-card glass-card animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        '--card-accent': career.accent,
      }}
    >
      {/* Accent top border */}
      <div className="career-card__accent" />

      <div className="career-card__header">
        <div className="career-card__icon" style={{ color: career.accent }}>
          {career.icon}
        </div>
        <CircularProgress percent={career.match} size={58} strokeWidth={4} color={career.accent} />
      </div>

      <h3 className="career-card__title">{career.title}</h3>

      <div className="career-card__meta">
        <span className="career-card__salary">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {career.salary}
        </span>
        <span className={`career-card__growth career-card__growth--${career.growth.toLowerCase()}`}>
          {career.growth === 'Rising' ? (
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
              <path d="M2 10l4-4 2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
              <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {career.growth}
        </span>
      </div>

      <div className="career-card__skills">
        {career.skills.map((skill) => (
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
  const [activeTab, setActiveTab] = useState('all')

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
                Welcome back, Explorer! <span className="dashboard__wave">👋</span>
              </h1>
              <p className="dashboard__subtitle">Your AI has discovered 12 potential futures</p>
            </div>

            <div className="dashboard__stats">
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">94%</div>
                <div className="dashboard__stat-label">Match Score</div>
              </div>
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">8/12</div>
                <div className="dashboard__stat-label">Paths Explored</div>
              </div>
              <div className="dashboard__stat glass-card">
                <div className="dashboard__stat-value gradient-text">24</div>
                <div className="dashboard__stat-label">Skills Mapped</div>
              </div>
            </div>
          </header>

          {/* --- Universe Constellation --- */}
          <section className="constellation animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="constellation__ring constellation__ring--outer" />
            <div className="constellation__ring constellation__ring--inner" />

            {/* Center "You" node */}
            <div className="constellation__center">
              <div className="constellation__center-pulse" />
              <span className="constellation__center-label">You</span>
            </div>

            {/* Orbiting career dots */}
            {careerData.map((c, i) => {
              const angle = (i / careerData.length) * 360
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
              {careerData.map((c, i) => {
                const angle = ((i / careerData.length) * 360 - 90) * (Math.PI / 180)
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
              {careerData
                .filter((c) => {
                  if (activeTab === 'all') return true
                  return c.growth.toLowerCase() === activeTab
                })
                .map((career, i) => (
                  <CareerCard key={career.id} career={career} index={i} />
                ))}
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
                Based on your <strong>analytical skills</strong> and <strong>technology interest</strong>,
                STEM careers are your strongest match. Consider exploring{' '}
                <strong>AI/ML Engineering</strong> for the highest alignment.
              </p>
            </div>
            <Link to="/career/1" className="insight__link">
              Explore top match
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
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
