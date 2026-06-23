import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { analyzeSkillGap } from '../services/gemini'
import './SkillGap.css'

// SVG ring helpers
const RING_RADIUS = 82
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function getBarColor(current, required) {
  if (current >= required) return 'green'
  if (required - current <= 20) return 'yellow'
  return 'red'
}

// Map resource index to icon style variant (cycles 1-4)
function iconVariant(index) {
  return (index % 4) + 1
}

export default function SkillGap() {
  const { profile, careerPaths } = useUser()
  const [selectedCareer, setSelectedCareer] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const careers = careerPaths?.careers ?? []

  // Default to the first (highest-match) career on mount
  useEffect(() => {
    if (careers.length > 0 && !selectedCareer) {
      setSelectedCareer(careers[0].title)
    }
  }, [careers])

  // Fetch analysis whenever selectedCareer changes
  useEffect(() => {
    if (selectedCareer && profile?.skills) {
      fetchAnalysis(selectedCareer)
    }
  }, [selectedCareer])

  const fetchAnalysis = async (career) => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeSkillGap(career, profile.skills)
      setAnalysisData(result)
    } catch (err) {
      setError('Failed to generate analysis. Please try again.')
    }
    setLoading(false)
  }

  // ── No profile guard ──
  if (!profile) {
    return (
      <div className="skillgap-page">
        <div className="container">
          <header className="skillgap-header">
            <h1 className="skillgap-header__title gradient-text">
              Skill Gap Analysis
            </h1>
            <p className="skillgap-header__subtitle">
              Complete your onboarding profile first to unlock AI-powered skill gap analysis.
            </p>
          </header>
        </div>
      </div>
    )
  }

  const readiness = analysisData?.readiness ?? 0
  const dashOffset = RING_CIRCUMFERENCE - (readiness / 100) * RING_CIRCUMFERENCE

  // Build a merged skills list for side-by-side bars
  const allSkillNames = [
    ...new Set([
      ...(analysisData?.currentSkills?.map((s) => s.name) ?? []),
      ...(analysisData?.requiredSkills?.map((s) => s.name) ?? []),
    ]),
  ]

  const currentMap = Object.fromEntries(
    (analysisData?.currentSkills ?? []).map((s) => [s.name, s.level])
  )
  const requiredMap = Object.fromEntries(
    (analysisData?.requiredSkills ?? []).map((s) => [s.name, s.level])
  )

  return (
    <div className="skillgap-page">
      <div className="container">
        {/* ---------- HEADER ---------- */}
        <header className="skillgap-header">
          <h1 className="skillgap-header__title gradient-text">
            Skill Gap Analysis
          </h1>
          <p className="skillgap-header__subtitle">
            See where you stand and what you need to learn
          </p>
          <div className="skillgap-header__selector">
            <label htmlFor="career-select">Target Career:</label>
            <select
              id="career-select"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
            >
              {careers.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* ---------- LOADING STATE ---------- */}
        {loading && (
          <div className="readiness-section" style={{ textAlign: 'center', opacity: 1 }}>
            <div className="readiness-card glass-card" style={{ justifyContent: 'center', minHeight: 260 }}>
              <div className="readiness-ring-wrap">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    className="readiness-ring__bg"
                    cx="100"
                    cy="100"
                    r={RING_RADIUS}
                  />
                  <circle
                    className="readiness-ring__progress"
                    cx="100"
                    cy="100"
                    r={RING_RADIUS}
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * 0.75}
                    style={{ animation: 'spin 1.2s linear infinite', transformOrigin: 'center' }}
                  />
                </svg>
                <div className="readiness-ring__label">
                  <span className="readiness-ring__word" style={{ fontSize: '0.95rem' }}>
                    Analyzing your skills…
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- ERROR STATE ---------- */}
        {!loading && error && (
          <div className="readiness-section" style={{ textAlign: 'center', opacity: 1 }}>
            <div className="readiness-card glass-card" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <p style={{ color: 'var(--accent-red)', fontSize: '1rem' }}>{error}</p>
              <button
                className="resource-card__btn"
                style={{ width: 'auto', padding: '10px 28px' }}
                onClick={() => fetchAnalysis(selectedCareer)}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ---------- DATA LOADED ---------- */}
        {!loading && !error && analysisData && (
          <>
            {/* ---------- READINESS SCORE ---------- */}
            <section className="readiness-section">
              <div className="readiness-card glass-card">
                {/* Circular Ring */}
                <div className="readiness-ring-wrap">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient
                        id="ringGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="readiness-ring__bg"
                      cx="100"
                      cy="100"
                      r={RING_RADIUS}
                    />
                    <circle
                      className="readiness-ring__progress"
                      cx="100"
                      cy="100"
                      r={RING_RADIUS}
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="readiness-ring__label">
                    <span className="readiness-ring__percent">{readiness}%</span>
                    <span className="readiness-ring__word">Ready</span>
                  </div>
                </div>

                {/* Info */}
                <div className="readiness-info">
                  <h2 className="readiness-info__headline">
                    You&rsquo;re <span>{readiness}% ready</span> for{' '}
                    {selectedCareer}
                  </h2>

                  <div className="readiness-stats">
                    {/* Mastered */}
                    <div className="readiness-stat">
                      <div className="readiness-stat__icon readiness-stat__icon--mastered">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <div className="readiness-stat__num">{analysisData.skillsMastered}</div>
                        <div className="readiness-stat__text">Skills mastered</div>
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="readiness-stat">
                      <div className="readiness-stat__icon readiness-stat__icon--progress">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                      </div>
                      <div>
                        <div className="readiness-stat__num">{analysisData.skillsInProgress}</div>
                        <div className="readiness-stat__text">In progress</div>
                      </div>
                    </div>

                    {/* To Learn */}
                    <div className="readiness-stat">
                      <div className="readiness-stat__icon readiness-stat__icon--learn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </div>
                      <div>
                        <div className="readiness-stat__num">{analysisData.skillsToLearn}</div>
                        <div className="readiness-stat__text">Skills to learn</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- SKILLS BREAKDOWN ---------- */}
            <section className="skills-section">
              <h2 className="skills-section__title">
                Skills Breakdown
              </h2>

              <div className="skills-grid">
                {/* Current Skills */}
                <div className="skills-col glass-card">
                  <h3 className="skills-col__heading">
                    <span className="skills-col__heading-dot skills-col__heading-dot--current" />
                    Your Current Skills
                  </h3>
                  {allSkillNames.map((name) => {
                    const current = currentMap[name] ?? 0
                    const required = requiredMap[name] ?? 0
                    const color = getBarColor(current, required)
                    return (
                      <div className="skill-row" key={name + '-current'}>
                        <span className="skill-row__name">{name}</span>
                        <div className="skill-row__bar-track">
                          <div
                            className={`skill-row__bar-fill skill-row__bar-fill--${color}`}
                            style={{ width: `${current}%` }}
                          />
                        </div>
                        <span className={`skill-row__percent skill-row__percent--${color}`}>
                          {current}%
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Required Skills */}
                <div className="skills-col glass-card">
                  <h3 className="skills-col__heading">
                    <span className="skills-col__heading-dot skills-col__heading-dot--required" />
                    Required Skills
                  </h3>
                  {allSkillNames.map((name) => {
                    const required = requiredMap[name] ?? 0
                    return (
                      <div className="skill-row" key={name + '-required'}>
                        <span className="skill-row__name">{name}</span>
                        <div className="skill-row__bar-track">
                          <div
                            className="skill-row__bar-fill skill-row__bar-fill--required"
                            style={{ width: `${required}%` }}
                          />
                        </div>
                        <span className="skill-row__percent skill-row__percent--required">
                          {required}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="skills-legend">
                <div className="skills-legend__item">
                  <span className="skills-legend__swatch skills-legend__swatch--green" />
                  Current ≥ Required
                </div>
                <div className="skills-legend__item">
                  <span className="skills-legend__swatch skills-legend__swatch--yellow" />
                  Gap ≤ 20%
                </div>
                <div className="skills-legend__item">
                  <span className="skills-legend__swatch skills-legend__swatch--red" />
                  Gap &gt; 20%
                </div>
              </div>
            </section>

            {/* ---------- LEARNING ROADMAP ---------- */}
            <section className="roadmap-section">
              <h2 className="roadmap-section__title gradient-text">
                Learning Roadmap
              </h2>
              <p className="roadmap-section__subtitle">
                Your personalized path to becoming a {selectedCareer}
              </p>

              <div className="roadmap-timeline">
                {(analysisData.roadmap ?? []).map((phase) => {
                  // Clamp id to 1-3 for CSS variant classes
                  const variant = Math.min(phase.phase, 3)
                  return (
                    <div className="roadmap-phase" key={phase.phase}>
                      <div className="roadmap-phase__marker">
                        <div
                          className={`roadmap-phase__dot roadmap-phase__dot--${variant}`}
                        />
                      </div>
                      <div className="roadmap-phase__card glass-card">
                        <span
                          className={`roadmap-phase__badge roadmap-phase__badge--${variant}`}
                        >
                          Phase {phase.phase}
                        </span>
                        <h3 className="roadmap-phase__name">{phase.title}</h3>
                        <p className="roadmap-phase__timeframe">Months {phase.months}</p>
                        <div className="roadmap-phase__tasks">
                          {phase.tasks.map((task) => (
                            <div className="roadmap-task" key={task}>
                              <span className="roadmap-task__check">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ---------- RECOMMENDED RESOURCES ---------- */}
            <section className="resources-section">
              <h2 className="resources-section__title gradient-text">
                Recommended Resources
              </h2>
              <p className="resources-section__subtitle">
                Curated courses and certifications to close your skill gaps
              </p>

              <div className="resources-grid">
                {(analysisData.resources ?? []).map((r, idx) => {
                  const variant = iconVariant(idx)
                  return (
                    <div className="resource-card glass-card" key={r.name}>
                      <div className={`resource-card__icon resource-card__icon--${variant}`}>
                        {variant === 1 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        )}
                        {variant === 2 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        )}
                        {variant === 3 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
                          </svg>
                        )}
                        {variant === 4 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                          </svg>
                        )}
                      </div>

                      <h4 className="resource-card__name">{r.name}</h4>
                      <span className="resource-card__platform">{r.platform}</span>

                      <div className="resource-card__meta">
                        <div className="resource-card__meta-row">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{r.duration}</span>
                        </div>
                        <div className="resource-card__meta-row">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          <span
                            className={`resource-card__difficulty resource-card__difficulty--${r.difficulty.toLowerCase()}`}
                          >
                            {r.difficulty}
                          </span>
                        </div>
                      </div>

                      <a
                        className="resource-card__btn"
                        href={r.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Start Learning
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
