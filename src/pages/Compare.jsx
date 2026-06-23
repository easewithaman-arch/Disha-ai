import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { compareCareerPaths } from '../services/gemini'
import './Compare.css'

const FALLBACK_CAREERS = [
  'Software Engineer',
  'Data Scientist',
  'UX Designer',
  'Product Manager',
  'Cybersecurity Analyst',
  'AI/ML Engineer',
  'Full Stack Developer',
  'Digital Marketer',
]

const RADAR_DIMENSIONS = [
  { key: 'salary', label: 'Salary' },
  { key: 'growth', label: 'Growth' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'technicalDepth', label: 'Tech Depth' },
  { key: 'socialImpact', label: 'Social Impact' },
  { key: 'workLifeBalance', label: 'Work-Life' },
]

/* ───── small sub-components ───── */

function MatchScoreRing({ score, color }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="compare-match-ring">
      <svg viewBox="0 0 100 100" className="compare-match-ring__svg">
        <circle cx="50" cy="50" r="42" className="compare-match-ring__bg" />
        <circle
          cx="50"
          cy="50"
          r="42"
          className="compare-match-ring__progress"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            stroke: color,
          }}
        />
      </svg>
      <span className="compare-match-ring__value" style={{ color }}>
        {score}%
      </span>
    </div>
  )
}

function SalaryBar({ data, color, maxSalary }) {
  const widthPercent = (data.avg / maxSalary) * 100
  return (
    <div className="compare-salary">
      <div className="compare-salary__bar-track">
        <div
          className="compare-salary__bar-fill"
          style={{ width: `${widthPercent}%`, background: color }}
        />
      </div>
      <div className="compare-salary__labels">
        <span className="compare-salary__range">
          ${data.min}K – ${data.max}K
        </span>
        <span className="compare-salary__avg" style={{ color }}>
          Avg ${data.avg}K
        </span>
      </div>
    </div>
  )
}

function BalanceDots({ value, color }) {
  const filled = Math.round(value)
  const dots = []
  for (let i = 1; i <= 5; i++) {
    dots.push(
      <span key={i} style={{ color: i <= filled ? color : 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>
        {i <= filled ? '●' : '○'}
      </span>
    )
  }
  return (
    <div className="compare-stars">
      {dots}
      <span className="compare-stars__val">{value}/5</span>
    </div>
  )
}

function RemoteIcon({ value, color }) {
  const icons = {
    Yes: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    Partial: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    No: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  }
  return (
    <span className="compare-remote">
      {icons[value] || icons['Partial']}
      <span>{value}</span>
    </span>
  )
}

/* ───── Radar Chart (pure CSS + inline SVG) ───── */

function RadarChart({ careers }) {
  const size = 300
  const cx = size / 2
  const cy = size / 2
  const levels = 5
  const radius = 120

  const angleSlice = (2 * Math.PI) / RADAR_DIMENSIONS.length

  const getPoint = (i, value) => {
    const r = (value / 100) * radius
    const angle = angleSlice * i - Math.PI / 2
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  // grid rings
  const rings = Array.from({ length: levels }, (_, l) => {
    const r = (radius / levels) * (l + 1)
    const points = RADAR_DIMENSIONS.map((_, i) => {
      const angle = angleSlice * i - Math.PI / 2
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    }).join(' ')
    return <polygon key={l} points={points} className="radar-ring" />
  })

  // axis lines
  const axes = RADAR_DIMENSIONS.map((_, i) => {
    const [x, y] = getPoint(i, 100)
    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
  })

  // labels
  const labels = RADAR_DIMENSIONS.map((dim, i) => {
    const [x, y] = getPoint(i, 118)
    return (
      <text key={dim.key} x={x} y={y} className="radar-label" textAnchor="middle" dominantBaseline="central">
        {dim.label}
      </text>
    )
  })

  // career polygons — radarScores are 0-10, scale to 0-100
  const polygons = careers.map((career) => {
    const points = RADAR_DIMENSIONS.map((dim, i) => {
      const raw = career.radarScores?.[dim.key] ?? 0
      const val = raw <= 10 ? raw * 10 : raw // handle 0-10 or 0-100 scale
      return getPoint(i, val).join(',')
    }).join(' ')
    return (
      <polygon
        key={career.title}
        points={points}
        className="radar-polygon"
        style={{
          stroke: career.color,
          fill: career.color,
        }}
      />
    )
  })

  // dots
  const dots = careers.flatMap((career) =>
    RADAR_DIMENSIONS.map((dim, i) => {
      const raw = career.radarScores?.[dim.key] ?? 0
      const val = raw <= 10 ? raw * 10 : raw
      const [x, y] = getPoint(i, val)
      return <circle key={`${career.title}-${dim.key}`} cx={x} cy={y} r="4" fill={career.color} className="radar-dot" />
    })
  )

  return (
    <div className="radar-wrapper">
      <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg">
        {rings}
        {axes}
        {polygons}
        {dots}
        {labels}
      </svg>
      <div className="radar-legend">
        {careers.map((c) => (
          <span key={c.title} className="radar-legend__item">
            <span className="radar-legend__dot" style={{ background: c.color }} />
            {c.title}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───── Loading Spinner ───── */

function LoadingSpinner() {
  return (
    <div className="compare-loading" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      gap: '24px',
    }}>
      <div style={{
        width: 56,
        height: 56,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#7c3aed',
        borderRightColor: '#00d4ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        AI is analyzing careers...
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Comparing salaries, growth, skills, and more
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ───── Main Page ───── */

export default function Compare() {
  const { profile, careerPaths } = useUser()
  const [selectedCareers, setSelectedCareers] = useState([])
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Build career options from AI-generated paths or fallback
  const careerOptions = careerPaths?.careers
    ? careerPaths.careers.map((c) => c.title)
    : FALLBACK_CAREERS

  // Pre-select first two careers when options become available
  useEffect(() => {
    if (selectedCareers.length === 0 && careerOptions.length >= 2) {
      setSelectedCareers([careerOptions[0], careerOptions[1]])
    }
  }, [careerOptions]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (index, value) => {
    setSelectedCareers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const addPath = () => {
    if (selectedCareers.length >= 3) return
    const unused = careerOptions.find((o) => !selectedCareers.includes(o))
    if (unused) setSelectedCareers((prev) => [...prev, unused])
  }

  const removePath = (index) => {
    if (selectedCareers.length <= 2) return
    setSelectedCareers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCompare = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await compareCareerPaths(selectedCareers, profile)
      setComparisonData(result)
    } catch (err) {
      setError('Failed to generate comparison. Please try again.')
    }
    setLoading(false)
  }

  // No profile — prompt onboarding
  if (!profile) {
    return (
      <div className="page-wrapper compare-page">
        <header className="compare-header container">
          <h1 className="section-title animate-fade-in-up">
            Compare <span className="gradient-text">Career Paths</span>
          </h1>
        </header>
        <section className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="compare-ai__card" style={{ maxWidth: 520, margin: '0 auto', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="compare-ai__icon">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="url(#onbGrad)" strokeWidth="2" />
                <path d="M16 20a8 8 0 1116 0c0 4-3.5 6-5 8h-6c-1.5-2-5-4-5-8z" fill="url(#onbGrad)" opacity="0.8" />
                <rect x="19" y="30" width="10" height="3" rx="1.5" fill="url(#onbGrad)" opacity="0.6" />
                <defs>
                  <linearGradient id="onbGrad" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="compare-ai__content" style={{ textAlign: 'center' }}>
              <h3 className="compare-ai__title">Complete Your Profile First</h3>
              <p className="compare-ai__text" style={{ marginBottom: 20 }}>
                To get AI-powered career comparisons tailored to your skills and interests,
                please complete the onboarding process first.
              </p>
              <a
                href="/onboarding"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Start Onboarding →
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Derive accent color for each selected career (from careerPaths data or generate)
  const getCareerColor = (title, idx) => {
    const match = careerPaths?.careers?.find((c) => c.title === title)
    if (match?.color) return match.color
    const defaults = ['#00d4ff', '#ec4899', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7']
    return defaults[idx % defaults.length]
  }

  const maxSalary = comparisonData
    ? Math.max(...comparisonData.careers.map((c) => c.salary?.max || 200))
    : 200

  return (
    <div className="page-wrapper compare-page">
      {/* ── Header ── */}
      <header className="compare-header container">
        <h1 className="section-title animate-fade-in-up">
          Compare <span className="gradient-text">Career Paths</span>
        </h1>
        <p className="section-subtitle animate-fade-in-up stagger-1">
          See how different futures stack up against each other
        </p>
      </header>

      {/* ── Selector Bar ── */}
      <section className="compare-selectors container animate-fade-in-up stagger-2">
        <div className="compare-selectors__row">
          {selectedCareers.map((career, idx) => (
            <div key={idx} className="compare-selector glass-card" style={{ '--card-accent': getCareerColor(career, idx) }}>
              <span className="compare-selector__num" style={{ background: getCareerColor(career, idx) }}>
                {idx + 1}
              </span>
              <select
                className="compare-selector__select"
                value={career}
                onChange={(e) => handleChange(idx, e.target.value)}
              >
                {careerOptions.map((opt) => (
                  <option key={opt} value={opt} disabled={selectedCareers.includes(opt) && opt !== career}>
                    {opt}
                  </option>
                ))}
              </select>
              {selectedCareers.length > 2 && (
                <button className="compare-selector__remove" onClick={() => removePath(idx)} aria-label="Remove">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {selectedCareers.length < 3 && (
            <button className="compare-selector compare-selector--add glass-card" onClick={addPath}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Path</span>
            </button>
          )}
        </div>

        {/* Compare Button */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={handleCompare}
            disabled={loading || selectedCareers.length < 2}
            style={{
              padding: '14px 48px',
              borderRadius: '999px',
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer',
              border: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
              opacity: loading || selectedCareers.length < 2 ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
            }}
          >
            {loading ? 'Analyzing...' : '✦ Compare Careers'}
          </button>
        </div>
      </section>

      {/* ── Error ── */}
      {error && (
        <section className="container" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            display: 'inline-block',
            padding: '14px 28px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}>
            {error}
          </div>
        </section>
      )}

      {/* ── Loading ── */}
      {loading && <LoadingSpinner />}

      {/* ── Comparison Cards ── */}
      {!loading && comparisonData?.careers && (
        <>
          <section className="compare-grid container animate-fade-in-up stagger-3" style={{ '--cols': comparisonData.careers.length }}>
            {comparisonData.careers.map((career, idx) => (
              <article key={career.title} className="compare-card glass-card" style={{ '--card-accent': career.color, animationDelay: `${0.15 * idx}s` }}>
                {/* accent bar */}
                <div className="compare-card__accent" style={{ background: career.color }} />

                <h2 className="compare-card__title" style={{ color: career.color }}>{career.title}</h2>

                {/* Match Score */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Match Score</h3>
                  <MatchScoreRing score={career.matchScore} color={career.color} />
                </div>

                {/* Salary */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Average Salary</h3>
                  <SalaryBar data={career.salary} color={career.color} maxSalary={maxSalary} />
                </div>

                {/* Job Growth */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Job Growth</h3>
                  <div className="compare-growth">
                    <span className="compare-growth__value" style={{ color: career.color }}>
                      +{String(career.jobGrowth).replace('%', '')}%
                    </span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={career.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    <span className="compare-growth__period">over 10 years</span>
                  </div>
                </div>

                {/* Education */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Education Required</h3>
                  <p className="compare-card__text">{career.education}</p>
                </div>

                {/* Time to Proficiency */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Time to Proficiency</h3>
                  <p className="compare-card__text compare-card__text--accent" style={{ color: career.color }}>{career.timeToProficiency}</p>
                </div>

                {/* Work-Life Balance */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Work-Life Balance</h3>
                  <BalanceDots value={career.workLifeBalance} color={career.color} />
                </div>

                {/* Remote Friendly */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Remote Friendly</h3>
                  <RemoteIcon value={career.remoteFriendly} color={career.color} />
                </div>

                {/* Skills */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Top Skills Required</h3>
                  <div className="compare-tags">
                    {(career.topSkills || career.skills || []).map((s) => (
                      <span key={s} className="compare-tag" style={{ borderColor: career.color, color: career.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Day in the Life */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">A Day in the Life</h3>
                  <p className="compare-card__text compare-card__text--small">{career.dayInLife}</p>
                </div>

                {/* Pros */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Pros</h3>
                  <ul className="compare-list compare-list--pros">
                    {(career.pros || []).map((p) => (
                      <li key={p}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="compare-card__section">
                  <h3 className="compare-card__label">Cons</h3>
                  <ul className="compare-list compare-list--cons">
                    {(career.cons || []).map((c) => (
                      <li key={c}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>

          {/* ── Radar Chart ── */}
          <section className="compare-radar container animate-fade-in-up stagger-4">
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '8px' }}>
              Career <span className="gradient-text">Radar</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '32px' }}>
              Multi-dimensional comparison across key career factors
            </p>
            <div className="compare-radar__card glass-card">
              <RadarChart careers={comparisonData.careers} />
            </div>
          </section>

          {/* ── AI Recommendation ── */}
          {comparisonData.recommendation && (
            <section className="compare-ai container animate-fade-in-up stagger-5">
              <div className="compare-ai__card">
                <div className="compare-ai__icon">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="url(#aiGrad)" strokeWidth="2" />
                    <path d="M16 20a8 8 0 1116 0c0 4-3.5 6-5 8h-6c-1.5-2-5-4-5-8z" fill="url(#aiGrad)" opacity="0.8" />
                    <rect x="19" y="30" width="10" height="3" rx="1.5" fill="url(#aiGrad)" opacity="0.6" />
                    <rect x="20" y="34" width="8" height="2" rx="1" fill="url(#aiGrad)" opacity="0.4" />
                    <circle cx="21" cy="18" r="1.5" fill="#fff" />
                    <circle cx="27" cy="18" r="1.5" fill="#fff" />
                    <defs>
                      <linearGradient id="aiGrad" x1="0" y1="0" x2="48" y2="48">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="50%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="compare-ai__content">
                  <h3 className="compare-ai__title">DISHA AI Recommendation</h3>
                  <p className="compare-ai__text">{comparisonData.recommendation}</p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Empty State (before first compare) ── */}
      {!loading && !comparisonData && !error && (
        <section className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Select 2–3 careers above and click <strong style={{ color: 'var(--text-secondary)' }}>Compare Careers</strong> to get
            an AI-powered side-by-side analysis.
          </p>
        </section>
      )}

      <div className="compare-spacer" />
    </div>
  )
}
