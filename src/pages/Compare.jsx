import { useState } from 'react'
import './Compare.css'

const CAREER_DATA = {
  'ai-ml': {
    id: 'ai-ml',
    title: 'AI/ML Engineer',
    color: '#00d4ff',
    matchScore: 92,
    salary: { min: 120, max: 210, avg: 158 },
    jobGrowth: 34,
    education: "Bachelor's in CS/Math + Master's preferred",
    timeToProficiency: '2–4 years',
    workLifeBalance: 3.2,
    remoteFriendly: 'Yes',
    skills: ['Python', 'TensorFlow/PyTorch', 'Linear Algebra', 'NLP', 'MLOps'],
    dayInLife:
      'Your morning starts with reviewing model training metrics from overnight runs. Mid-day, you collaborate with data engineers to refine pipelines, experiment with architectures, and push models through A/B tests. Afternoons involve reading new papers, fine-tuning hyperparameters, and presenting findings in weekly research syncs.',
    pros: [
      'Top-tier compensation packages',
      'Cutting-edge, intellectually stimulating work',
      'High demand across every industry',
      'Strong remote work culture',
      'Impactful work shaping the future',
    ],
    cons: [
      'Steep and continuous learning curve',
      'Long debugging cycles on model issues',
      'Can feel isolating without a strong team',
      'Pressure to publish or show rapid results',
    ],
    radarScores: { Salary: 95, Growth: 92, Creativity: 70, 'Tech Depth': 98, 'Social Impact': 75, 'Work-Life': 55 },
  },
  'ux-designer': {
    id: 'ux-designer',
    title: 'UX Designer',
    color: '#ec4899',
    matchScore: 78,
    salary: { min: 75, max: 155, avg: 108 },
    jobGrowth: 16,
    education: "Bachelor's in Design/HCI/Psychology",
    timeToProficiency: '1–3 years',
    workLifeBalance: 4.2,
    remoteFriendly: 'Yes',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    dayInLife:
      'You kick off with a usability test session, watching real users interact with your prototype. After synthesizing insights, you update wireframes in Figma and iterate on the design system. Afternoons are spent in cross-functional critiques with engineers and PMs, refining micro-interactions and visual hierarchy.',
    pros: [
      'Highly creative and people-centered',
      'Excellent work-life balance',
      'Growing demand for design thinking',
      'Diverse industry opportunities',
      'Tangible, visible impact on products',
    ],
    cons: [
      'Subjective feedback can be frustrating',
      'Often undervalued in engineering-heavy cultures',
      'Lower salary ceiling than engineering roles',
      'Stakeholder alignment can be challenging',
    ],
    radarScores: { Salary: 60, Growth: 65, Creativity: 95, 'Tech Depth': 40, 'Social Impact': 80, 'Work-Life': 88 },
  },
  'data-scientist': {
    id: 'data-scientist',
    title: 'Data Scientist',
    color: '#7c3aed',
    matchScore: 85,
    salary: { min: 100, max: 185, avg: 135 },
    jobGrowth: 28,
    education: "Bachelor's/Master's in Stats, CS, or Math",
    timeToProficiency: '2–3 years',
    workLifeBalance: 3.6,
    remoteFriendly: 'Yes',
    skills: ['Python/R', 'SQL', 'Statistical Modeling', 'Data Viz', 'A/B Testing'],
    dayInLife:
      'Mornings involve pulling datasets, cleaning messy data, and running exploratory analyses. You build statistical models to answer business questions and create dashboards for stakeholders. Afternoons are spent presenting insights to non-technical teams and designing experiments to validate hypotheses.',
    pros: [
      'Strong blend of math and business impact',
      'Versatile across industries',
      'Excellent career growth trajectory',
      'Data-driven decision making is valued',
      'Good remote opportunities',
    ],
    cons: [
      '70% of work can be data cleaning',
      'Business stakeholders may ignore insights',
      'Title inflation creates role ambiguity',
      'Requires constant upskilling',
    ],
    radarScores: { Salary: 80, Growth: 82, Creativity: 60, 'Tech Depth': 85, 'Social Impact': 70, 'Work-Life': 65 },
  },
  'product-manager': {
    id: 'product-manager',
    title: 'Product Manager',
    color: '#f59e0b',
    matchScore: 71,
    salary: { min: 95, max: 190, avg: 142 },
    jobGrowth: 12,
    education: "Bachelor's in Business/CS + MBA preferred",
    timeToProficiency: '3–5 years',
    workLifeBalance: 3.0,
    remoteFriendly: 'Partial',
    skills: ['Product Strategy', 'Analytics', 'Stakeholder Mgmt', 'Roadmapping', 'Agile/Scrum'],
    dayInLife:
      'You start with stand-up meetings, triaging bugs, and reviewing sprint progress. Mid-morning involves deep work on product strategy docs and competitive analysis. Afternoons are back-to-back — customer calls, design reviews, metrics deep-dives, and aligning engineering on priorities for the next quarter.',
    pros: [
      'High influence on product direction',
      'Diverse skill set development',
      'Strong path to leadership roles',
      'Intellectually stimulating and varied',
      'Cross-functional collaboration',
    ],
    cons: [
      'Responsibility without direct authority',
      'Meetings-heavy calendar',
      'High stress and competing priorities',
      'Ambiguous career entry path',
    ],
    radarScores: { Salary: 82, Growth: 58, Creativity: 72, 'Tech Depth': 45, 'Social Impact': 65, 'Work-Life': 48 },
  },
  'biotech-researcher': {
    id: 'biotech-researcher',
    title: 'Biotech Researcher',
    color: '#10b981',
    matchScore: 64,
    salary: { min: 70, max: 145, avg: 98 },
    jobGrowth: 20,
    education: "Master's/PhD in Biology, Biochemistry, or Bioengineering",
    timeToProficiency: '4–7 years',
    workLifeBalance: 3.4,
    remoteFriendly: 'No',
    skills: ['Lab Techniques', 'Bioinformatics', 'Scientific Writing', 'CRISPR/Gene Editing', 'Data Analysis'],
    dayInLife:
      'Your day starts early in the lab, running experiments — PCR, cell cultures, or protein assays. You log meticulous notes and analyze preliminary results over lunch. Afternoons are for reading literature, drafting publications, attending journal clubs, and planning the next round of experiments.',
    pros: [
      'Directly improving human health',
      'Intellectually deep and meaningful work',
      'Growing industry with major funding',
      'Collaboration with brilliant scientists',
      'Job stability in pharma/biotech',
    ],
    cons: [
      'Long education pathway (PhD often required)',
      'Lower starting salaries vs tech',
      'Slow results — experiments take months',
      'Must work on-site in labs',
    ],
    radarScores: { Salary: 50, Growth: 68, Creativity: 65, 'Tech Depth': 90, 'Social Impact': 95, 'Work-Life': 58 },
  },
  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    color: '#ef4444',
    matchScore: 74,
    salary: { min: 85, max: 170, avg: 120 },
    jobGrowth: 32,
    education: "Bachelor's in CS/IT + Certifications (CISSP, CEH)",
    timeToProficiency: '2–4 years',
    workLifeBalance: 3.0,
    remoteFriendly: 'Partial',
    skills: ['Network Security', 'Penetration Testing', 'SIEM Tools', 'Incident Response', 'Cloud Security'],
    dayInLife:
      'Mornings begin with reviewing overnight security alerts and triaging potential incidents. You run vulnerability scans, analyze threat intelligence feeds, and update firewall rules. Afternoons involve penetration testing, writing incident reports, conducting security awareness training, and patching critical vulnerabilities.',
    pros: [
      'Extremely high and growing demand',
      'Thrilling, detective-like problem solving',
      'Strong job security',
      'Good salaries with rapid progression',
      'Critical societal importance',
    ],
    cons: [
      'On-call rotations and high stress',
      'Constantly evolving threat landscape',
      'Can be repetitive (alert fatigue)',
      'Certifications are expensive and time-consuming',
    ],
    radarScores: { Salary: 72, Growth: 90, Creativity: 55, 'Tech Depth': 88, 'Social Impact': 85, 'Work-Life': 42 },
  },
  'fullstack-dev': {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    color: '#06b6d4',
    matchScore: 88,
    salary: { min: 90, max: 180, avg: 130 },
    jobGrowth: 22,
    education: "Bachelor's in CS or Bootcamp + Portfolio",
    timeToProficiency: '1–3 years',
    workLifeBalance: 3.5,
    remoteFriendly: 'Yes',
    skills: ['React/Vue', 'Node.js', 'Databases', 'REST/GraphQL APIs', 'DevOps Basics'],
    dayInLife: 'Your morning starts with a code review and stand-up. You spend focused blocks building features, crafting React components, wiring up API endpoints, and writing database queries. Afternoons involve debugging, deploying to staging, pair programming with teammates, and planning the next sprint\'s technical approach.',

    pros: [
      'Most versatile developer role',
      'Abundant job opportunities globally',
      'Strong remote work culture',
      'Tangible output — you build real products',
      'Accessible entry path (bootcamps accepted)',
    ],
    cons: [
      'Jack of all trades, master of none risk',
      'Technology stack changes rapidly',
      'Can feel stretched thin across frontend/backend',
      'Debugging full-stack issues is complex',
    ],
    radarScores: { Salary: 76, Growth: 74, Creativity: 72, 'Tech Depth': 78, 'Social Impact': 55, 'Work-Life': 62 },
  },
  'digital-marketer': {
    id: 'digital-marketer',
    title: 'Digital Marketer',
    color: '#a855f7',
    matchScore: 58,
    salary: { min: 50, max: 130, avg: 82 },
    jobGrowth: 10,
    education: "Bachelor's in Marketing/Communications",
    timeToProficiency: '1–2 years',
    workLifeBalance: 3.8,
    remoteFriendly: 'Yes',
    skills: ['SEO/SEM', 'Google Analytics', 'Content Strategy', 'Social Media', 'Email Marketing'],
    dayInLife:
      'You start by checking campaign dashboards — ad performance, email open rates, and social engagement. Mid-morning is for creating content, writing ad copy, and planning A/B tests. Afternoons involve analyzing conversion funnels, coordinating with designers on creatives, and strategizing the next campaign launch.',
    pros: [
      'Creative and analytical blend',
      'Low barrier to entry',
      'Freelance and entrepreneurial opportunities',
      'Results are immediately measurable',
      'Great work-life balance options',
    ],
    cons: [
      'Lower salary ceiling than technical roles',
      'Algorithms and platforms change constantly',
      'Can feel repetitive and metrics-driven',
      'High competition for senior roles',
    ],
    radarScores: { Salary: 42, Growth: 45, Creativity: 88, 'Tech Depth': 30, 'Social Impact': 60, 'Work-Life': 78 },
  },
}

const CAREER_OPTIONS = [
  { value: 'ai-ml', label: 'AI/ML Engineer' },
  { value: 'ux-designer', label: 'UX Designer' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'biotech-researcher', label: 'Biotech Researcher' },
  { value: 'cybersecurity', label: 'Cybersecurity Analyst' },
  { value: 'fullstack-dev', label: 'Full Stack Developer' },
  { value: 'digital-marketer', label: 'Digital Marketer' },
]

const RADAR_DIMENSIONS = ['Salary', 'Growth', 'Creativity', 'Tech Depth', 'Social Impact', 'Work-Life']

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

function StarRating({ value, color }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0
    stars.push(
      <span key={i} className="compare-star" style={{ '--star-color': color }}>
        {fill === 1 ? (
          <svg viewBox="0 0 20 20" fill={color} width="18" height="18">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78z" />
          </svg>
        ) : fill === 0.5 ? (
          <svg viewBox="0 0 20 20" width="18" height="18">
            <defs>
              <linearGradient id={`half-${color.replace('#', '')}-${i}`}>
                <stop offset="50%" stopColor={color} />
                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              </linearGradient>
            </defs>
            <path
              d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78z"
              fill={`url(#half-${color.replace('#', '')}-${i})`}
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="rgba(255,255,255,0.15)" width="18" height="18">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.62l5.34-.78z" />
          </svg>
        )}
      </span>
    )
  }
  return (
    <div className="compare-stars">
      {stars}
      <span className="compare-stars__val">{value.toFixed(1)}</span>
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
      {icons[value]}
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

  // returns [x,y] for a dimension index & value (0-100)
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
      <text key={dim} x={x} y={y} className="radar-label" textAnchor="middle" dominantBaseline="central">
        {dim}
      </text>
    )
  })

  // career polygons
  const polygons = careers.map((career) => {
    const points = RADAR_DIMENSIONS.map((dim, i) => {
      const val = career.radarScores[dim] || 0
      return getPoint(i, val).join(',')
    }).join(' ')
    return (
      <polygon
        key={career.id}
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
      const [x, y] = getPoint(i, career.radarScores[dim] || 0)
      return <circle key={`${career.id}-${dim}`} cx={x} cy={y} r="4" fill={career.color} className="radar-dot" />
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
          <span key={c.id} className="radar-legend__item">
            <span className="radar-legend__dot" style={{ background: c.color }} />
            {c.title}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───── Main Page ───── */

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState(['ai-ml', 'ux-designer', 'data-scientist'])

  const selectedCareers = selectedIds.map((id) => CAREER_DATA[id])
  const maxSalary = Math.max(...Object.values(CAREER_DATA).map((c) => c.salary.max))

  const handleChange = (index, value) => {
    setSelectedIds((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const addPath = () => {
    if (selectedIds.length >= 3) return
    const unused = CAREER_OPTIONS.find((o) => !selectedIds.includes(o.value))
    if (unused) setSelectedIds((prev) => [...prev, unused.value])
  }

  const removePath = (index) => {
    if (selectedIds.length <= 2) return
    setSelectedIds((prev) => prev.filter((_, i) => i !== index))
  }

  // find best-match career among selected
  const bestMatch = [...selectedCareers].sort((a, b) => b.matchScore - a.matchScore)[0]
  const bestWLB = [...selectedCareers].sort((a, b) => b.workLifeBalance - a.workLifeBalance)[0]

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
          {selectedIds.map((id, idx) => (
            <div key={idx} className="compare-selector glass-card" style={{ '--card-accent': CAREER_DATA[id].color }}>
              <span className="compare-selector__num" style={{ background: CAREER_DATA[id].color }}>
                {idx + 1}
              </span>
              <select
                className="compare-selector__select"
                value={id}
                onChange={(e) => handleChange(idx, e.target.value)}
              >
                {CAREER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={selectedIds.includes(opt.value) && opt.value !== id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {selectedIds.length > 2 && (
                <button className="compare-selector__remove" onClick={() => removePath(idx)} aria-label="Remove">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {selectedIds.length < 3 && (
            <button className="compare-selector compare-selector--add glass-card" onClick={addPath}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Path</span>
            </button>
          )}
        </div>
      </section>

      {/* ── Comparison Cards ── */}
      <section className="compare-grid container animate-fade-in-up stagger-3" style={{ '--cols': selectedCareers.length }}>
        {selectedCareers.map((career, idx) => (
          <article key={career.id} className="compare-card glass-card" style={{ '--card-accent': career.color, animationDelay: `${0.15 * idx}s` }}>
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
                  +{career.jobGrowth}%
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
              <StarRating value={career.workLifeBalance} color={career.color} />
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
                {career.skills.map((s) => (
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
                {career.pros.map((p) => (
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
                {career.cons.map((c) => (
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
          <RadarChart careers={selectedCareers} />
        </div>
      </section>

      {/* ── AI Recommendation ── */}
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
            <p className="compare-ai__text">
              Based on your profile, <strong style={{ color: bestMatch.color }}>{bestMatch.title}</strong> offers
              the best alignment with your skills and goals with a{' '}
              <strong style={{ color: bestMatch.color }}>{bestMatch.matchScore}% match score</strong>.
              {bestMatch.id !== bestWLB.id && (
                <>
                  {' '}However, if work-life balance is your priority, consider{' '}
                  <strong style={{ color: bestWLB.color }}>{bestWLB.title}</strong> for a more balanced
                  lifestyle with a {bestWLB.workLifeBalance.toFixed(1)}/5 work-life rating.
                </>
              )}
              {' '}Explore each path's skills section to start building your roadmap today.
            </p>
          </div>
        </div>
      </section>

      <div className="compare-spacer" />
    </div>
  )
}
