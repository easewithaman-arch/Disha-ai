import { useState } from 'react'
import './SkillGap.css'

const CAREERS = [
  'AI/ML Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Product Manager',
  'UX Designer',
]

const SKILLS_DATA = [
  { name: 'Python',          current: 85, required: 95 },
  { name: 'Mathematics',     current: 78, required: 90 },
  { name: 'Data Analysis',   current: 72, required: 85 },
  { name: 'Problem Solving', current: 90, required: 85 },
  { name: 'Communication',   current: 65, required: 70 },
  { name: 'Machine Learning', current: 45, required: 95 },
  { name: 'Deep Learning',   current: 30, required: 90 },
  { name: 'Cloud Computing', current: 40, required: 75 },
  { name: 'Research',        current: 70, required: 80 },
  { name: 'Statistics',      current: 75, required: 88 },
]

const PHASES = [
  {
    id: 1,
    name: 'Foundation',
    timeframe: 'Months 1–3',
    tasks: [
      'Complete ML Fundamentals course',
      'Learn TensorFlow/PyTorch basics',
      'Practice on Kaggle competitions',
    ],
  },
  {
    id: 2,
    name: 'Intermediate',
    timeframe: 'Months 4–6',
    tasks: [
      'Deep Learning specialization',
      'Cloud computing certification',
      'Build 3 portfolio projects',
    ],
  },
  {
    id: 3,
    name: 'Advanced',
    timeframe: 'Months 7–12',
    tasks: [
      'Contribute to open-source AI',
      'Research paper reading group',
      'Industry internship',
    ],
  },
]

const RESOURCES = [
  {
    name: 'Machine Learning Specialization',
    platform: 'Coursera',
    duration: '3 months',
    difficulty: 'Intermediate',
    icon: 1,
  },
  {
    name: 'Deep Learning with PyTorch',
    platform: 'Udemy',
    duration: '42 hours',
    difficulty: 'Intermediate',
    icon: 2,
  },
  {
    name: 'AWS Cloud Practitioner',
    platform: 'AWS Training',
    duration: '6 weeks',
    difficulty: 'Beginner',
    icon: 3,
  },
  {
    name: 'Advanced Statistics for ML',
    platform: 'edX',
    duration: '8 weeks',
    difficulty: 'Advanced',
    icon: 4,
  },
]

function getBarColor(current, required) {
  if (current >= required) return 'green'
  if (required - current <= 20) return 'yellow'
  return 'red'
}

// SVG ring helpers
const RING_RADIUS = 82
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export default function SkillGap() {
  const [career, setCareer] = useState('AI/ML Engineer')
  const readiness = 72
  const mastered = 6
  const inProgress = 4
  const toLearn = 3

  const dashOffset = RING_CIRCUMFERENCE - (readiness / 100) * RING_CIRCUMFERENCE

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
              value={career}
              onChange={(e) => setCareer(e.target.value)}
            >
              {CAREERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </header>

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
                {career.replace('AI/ML', 'AI/ML')} Engineering
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
                    <div className="readiness-stat__num">{mastered}</div>
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
                    <div className="readiness-stat__num">{inProgress}</div>
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
                    <div className="readiness-stat__num">{toLearn}</div>
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
              {SKILLS_DATA.map((s) => {
                const color = getBarColor(s.current, s.required)
                return (
                  <div className="skill-row" key={s.name + '-current'}>
                    <span className="skill-row__name">{s.name}</span>
                    <div className="skill-row__bar-track">
                      <div
                        className={`skill-row__bar-fill skill-row__bar-fill--${color}`}
                        style={{ width: `${s.current}%` }}
                      />
                    </div>
                    <span className={`skill-row__percent skill-row__percent--${color}`}>
                      {s.current}%
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
              {SKILLS_DATA.map((s) => (
                <div className="skill-row" key={s.name + '-required'}>
                  <span className="skill-row__name">{s.name}</span>
                  <div className="skill-row__bar-track">
                    <div
                      className="skill-row__bar-fill skill-row__bar-fill--required"
                      style={{ width: `${s.required}%` }}
                    />
                  </div>
                  <span className="skill-row__percent skill-row__percent--required">
                    {s.required}%
                  </span>
                </div>
              ))}
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
            Your personalized path to becoming an {career}
          </p>

          <div className="roadmap-timeline">
            {PHASES.map((phase) => (
              <div className="roadmap-phase" key={phase.id}>
                <div className="roadmap-phase__marker">
                  <div
                    className={`roadmap-phase__dot roadmap-phase__dot--${phase.id}`}
                  />
                </div>
                <div className="roadmap-phase__card glass-card">
                  <span
                    className={`roadmap-phase__badge roadmap-phase__badge--${phase.id}`}
                  >
                    Phase {phase.id}
                  </span>
                  <h3 className="roadmap-phase__name">{phase.name}</h3>
                  <p className="roadmap-phase__timeframe">{phase.timeframe}</p>
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
            ))}
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
            {RESOURCES.map((r) => (
              <div className="resource-card glass-card" key={r.name}>
                <div className={`resource-card__icon resource-card__icon--${r.icon}`}>
                  {r.icon === 1 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  )}
                  {r.icon === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  )}
                  {r.icon === 3 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
                    </svg>
                  )}
                  {r.icon === 4 && (
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

                <button className="resource-card__btn">
                  Start Learning
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
