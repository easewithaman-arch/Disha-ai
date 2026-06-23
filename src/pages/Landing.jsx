import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './Landing.css'

/* ─── Animated Counter Hook ─── */
function useCounter(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, shouldStart])

  return count
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.unobserve(node)
  }, [threshold])

  return [ref, isVisible]
}

/* ─── Data ─── */
const STATS = [
  { value: 10000, suffix: '+', label: 'Students Guided' },
  { value: 150, suffix: '+', label: 'Career Paths' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 50, suffix: '+', label: 'AI Models' },
]

const STEPS = [
  {
    num: 1,
    title: 'Share Your Story',
    desc: 'Tell us about your interests, skills, and dreams',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4C10.268 4 4 10.268 4 18s6.268 14 14 14 14-6.268 14-14S25.732 4 18 4z" stroke="url(#s1)" strokeWidth="2"/>
        <path d="M12 18l4 4 8-8" stroke="url(#s1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs><linearGradient id="s1" x1="4" y1="4" x2="32" y2="32"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#7c3aed"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    num: 2,
    title: 'AI Explores Futures',
    desc: 'Our AI maps 100+ potential career paths',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="6" stroke="url(#s2)" strokeWidth="2"/>
        <path d="M18 4v6M18 26v6M4 18h6M26 18h6M8.1 8.1l4.24 4.24M23.66 23.66l4.24 4.24M8.1 27.9l4.24-4.24M23.66 12.34l4.24-4.24" stroke="url(#s2)" strokeWidth="2" strokeLinecap="round"/>
        <defs><linearGradient id="s2" x1="4" y1="4" x2="32" y2="32"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Compare & Analyze',
    desc: 'Side-by-side comparison of paths with skill gap analysis',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="5" y="8" width="10" height="20" rx="2" stroke="url(#s3)" strokeWidth="2"/>
        <rect x="21" y="12" width="10" height="16" rx="2" stroke="url(#s3)" strokeWidth="2"/>
        <path d="M15 18h6" stroke="url(#s3)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
        <defs><linearGradient id="s3" x1="5" y1="8" x2="31" y2="28"><stop stopColor="#10b981"/><stop offset="1" stopColor="#00d4ff"/></linearGradient></defs>
      </svg>
    ),
  },
  {
    num: 4,
    title: 'Get AI Mentorship',
    desc: 'Personalized guidance from your AI career mentor',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M6 26V10a2 2 0 012-2h20a2 2 0 012 2v12a2 2 0 01-2 2H12l-6 4v-2z" stroke="url(#s4)" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="14" cy="16" r="1.5" fill="url(#s4)"/>
        <circle cx="18" cy="16" r="1.5" fill="url(#s4)"/>
        <circle cx="22" cy="16" r="1.5" fill="url(#s4)"/>
        <defs><linearGradient id="s4" x1="6" y1="8" x2="30" y2="28"><stop stopColor="#ec4899"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs>
      </svg>
    ),
  },
]

const FEATURES = [
  {
    title: 'Future Explorer Dashboard',
    desc: 'Visualize every possible career trajectory on an interactive map tailored to your unique profile.',
    gradient: 'var(--gradient-cyan-purple)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 11h26M11 11v18" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 16l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Career Path Comparison',
    desc: 'Compare up to 4 career paths side-by-side with salary, growth, and lifestyle metrics.',
    gradient: 'var(--gradient-purple-pink)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26V14M12 26V8M18 26V18M24 26V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Skill Gap Analysis',
    desc: 'Identify exactly which skills you need to build and get step-by-step learning plans.',
    gradient: 'var(--gradient-emerald-cyan)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8v8l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'AI Mentor Chat',
    desc: 'Chat 24/7 with your AI career mentor that knows your strengths, goals, and progress.',
    gradient: 'var(--gradient-warm)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 24V8a2 2 0 012-2h20a2 2 0 012 2v12a2 2 0 01-2 2H10l-6 4v-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M11 13h10M11 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Industry Insights',
    desc: 'Real-time data on industry trends, hiring demand, and salary projections across fields.',
    gradient: 'linear-gradient(135deg, #00d4ff, #10b981)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 28l7-10 5 4 8-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="27" cy="6" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: 'Personalized Roadmaps',
    desc: 'Get a tailored timeline with milestones, courses, and projects to reach your dream career.',
    gradient: 'linear-gradient(135deg, #f59e0b, #7c3aed)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="24" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M19 8h7M6 16h7M19 24h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const TESTIMONIALS = [
  {
    name: 'Aarav Sharma',
    role: 'Engineering Student, IIT Delhi',
    initials: 'AS',
    color: '#00d4ff',
    text: 'DISHA AI completely changed how I think about my career. I was stuck between data science and product management — the comparison tool showed me I could combine both. Now I have a clear 3-year roadmap.',
  },
  {
    name: 'Priya Nair',
    role: 'Arts Graduate, St. Xavier\'s Mumbai',
    initials: 'PN',
    color: '#ec4899',
    text: 'As an arts student, I felt lost about career options. DISHA showed me 12 career paths I never knew existed. The AI mentor helped me discover UX Research — and I just landed my first internship!',
  },
  {
    name: 'Karthik Reddy',
    role: 'Commerce Student, Loyola Chennai',
    initials: 'KR',
    color: '#10b981',
    text: 'The skill gap analysis was eye-opening. It identified exactly what I needed to learn for fintech, gave me a personalized learning path, and now I\'m 60% through it. Incredible platform.',
  },
]

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'AI Models', 'Roadmap'],
  Resources: ['Blog', 'Career Guides', 'API Docs', 'Help Center'],
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

/* ─── Stat Counter Component ─── */
function StatItem({ value, suffix, label, shouldStart }) {
  const count = useCounter(value, 2000, shouldStart)
  return (
    <div className="landing-stats__item">
      <span className="landing-stats__number">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="landing-stats__label">{label}</span>
    </div>
  )
}

/* ─── Landing Page ─── */
export default function Landing() {
  const [heroRef, heroVisible] = useScrollReveal(0.1)
  const [statsRef, statsVisible] = useScrollReveal(0.3)
  const [stepsRef, stepsVisible] = useScrollReveal(0.1)
  const [featRef, featVisible] = useScrollReveal(0.1)
  const [testRef, testVisible] = useScrollReveal(0.1)
  const [ctaRef, ctaVisible] = useScrollReveal(0.2)

  /* Floating Orbs */
  const orbs = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 120 + Math.random() * 260,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * -20,
      color:
        i % 3 === 0
          ? 'rgba(0,212,255,0.12)'
          : i % 3 === 1
          ? 'rgba(124,58,237,0.12)'
          : 'rgba(236,72,153,0.10)',
    }))
  ).current

  const handleScrollDown = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="landing-hero" ref={heroRef}>
        {/* Floating orbs */}
        <div className="landing-hero__orbs" aria-hidden="true">
          {orbs.map((o) => (
            <div
              key={o.id}
              className="landing-hero__orb"
              style={{
                width: o.size,
                height: o.size,
                left: `${o.x}%`,
                top: `${o.y}%`,
                background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
                animationDuration: `${o.duration}s`,
                animationDelay: `${o.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Grid lines (decorative) */}
        <div className="landing-hero__grid" aria-hidden="true" />

        <div className={`landing-hero__content container ${heroVisible ? 'is-visible' : ''}`}>
          <span className="landing-hero__badge">
            <span className="landing-hero__badge-dot" />
            One Student. Many Futures.
          </span>

          <h1 className="landing-hero__title">
            Discover Your Future<br />
            <span className="gradient-text">with AI</span>
          </h1>

          <p className="landing-hero__subtitle">
            DISHA AI uses advanced artificial intelligence to map every possible career path
            for you — analyzing your skills, interests, and market trends to help you
            make the most informed decisions about your future.
          </p>

          <div className="landing-hero__actions">
            <Link to="/onboarding" className="btn-primary landing-hero__cta">
              Start Exploring
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button onClick={handleScrollDown} className="btn-secondary landing-hero__cta">
              See How It Works
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3.75v10.5M4.5 9.75L9 14.25l4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Scroll hint */}
          <div className="landing-hero__scroll-hint" onClick={handleScrollDown}>
            <div className="landing-hero__mouse">
              <div className="landing-hero__mouse-dot" />
            </div>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="landing-stats" ref={statsRef}>
        <div className={`landing-stats__inner container ${statsVisible ? 'is-visible' : ''}`}>
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} shouldStart={statsVisible} />
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="landing-steps" id="how-it-works" ref={stepsRef}>
        <div className="container">
          <div className={`landing-steps__header ${stepsVisible ? 'is-visible' : ''}`}>
            <span className="landing-section-tag">How It Works</span>
            <h2 className="section-title">
              Four Steps to Your <span className="gradient-text">Dream Career</span>
            </h2>
            <p className="section-subtitle">
              Our AI-driven process turns uncertainty into a clear, actionable plan — in minutes, not months.
            </p>
          </div>

          <div className="landing-steps__grid">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`landing-steps__card glass-card ${stepsVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="landing-steps__num">{String(step.num).padStart(2, '0')}</div>
                <div className="landing-steps__icon">{step.icon}</div>
                <h3 className="landing-steps__title">{step.title}</h3>
                <p className="landing-steps__desc">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="landing-steps__connector" aria-hidden="true">
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                      <path d="M0 12h32M26 6l6 6-6 6" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="landing-features" ref={featRef}>
        <div className="container">
          <div className={`landing-features__header ${featVisible ? 'is-visible' : ''}`}>
            <span className="landing-section-tag">Features</span>
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Navigate Your Future</span>
            </h2>
            <p className="section-subtitle">
              Powerful AI tools designed specifically for students who refuse to settle for one option.
            </p>
          </div>

          <div className="landing-features__grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`landing-features__card glass-card ${featVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="landing-features__card-icon" style={{ background: f.gradient }}>
                  {f.icon}
                </div>
                <h3 className="landing-features__card-title">{f.title}</h3>
                <p className="landing-features__card-desc">{f.desc}</p>
                <div className="landing-features__card-shine" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="landing-testimonials" ref={testRef}>
        <div className="container">
          <div className={`landing-testimonials__header ${testVisible ? 'is-visible' : ''}`}>
            <span className="landing-section-tag">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">Students Everywhere</span>
            </h2>
            <p className="section-subtitle">
              Hear from students whose lives changed after discovering their true career paths.
            </p>
          </div>

          <div className="landing-testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`landing-testimonials__card glass-card ${testVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="landing-testimonials__stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} width="18" height="18" viewBox="0 0 18 18" fill="#f59e0b">
                      <path d="M9 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L9 13.89l-4.94 2.81.94-5.49-4-3.9 5.53-.8z"/>
                    </svg>
                  ))}
                </div>
                <p className="landing-testimonials__text">"{t.text}"</p>
                <div className="landing-testimonials__author">
                  <div
                    className="landing-testimonials__avatar"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="landing-testimonials__name">{t.name}</div>
                    <div className="landing-testimonials__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="landing-cta" ref={ctaRef}>
        <div className={`landing-cta__inner container ${ctaVisible ? 'is-visible' : ''}`}>
          <div className="landing-cta__glow" aria-hidden="true" />
          <h2 className="landing-cta__title">
            Ready to Discover<br />
            <span className="gradient-text">Your Future?</span>
          </h2>
          <p className="landing-cta__text">
            Join 10,000+ students already exploring their many possible futures with DISHA AI.
            It's free, fast, and might just change your life.
          </p>
          <Link to="/onboarding" className="btn-primary landing-cta__btn">
            Get Started Free
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="landing-footer">
        <div className="container">
          <div className="landing-footer__top">
            {/* Brand */}
            <div className="landing-footer__brand">
              <Link to="/" className="landing-footer__logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="url(#fl)" strokeWidth="2"/>
                  <path d="M10 16.5C10 12 13 9 16.5 9s6 3.5 6 7-3 7-6.5 7" stroke="url(#fl)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="2.5" fill="url(#fl)"/>
                  <defs><linearGradient id="fl" x1="2" y1="2" x2="30" y2="30"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#7c3aed"/></linearGradient></defs>
                </svg>
                <span>DISHA <span className="landing-footer__logo-ai">AI</span></span>
              </Link>
              <p className="landing-footer__tagline">
                One Student. Many Futures.<br />
                AI-powered career exploration for the next generation.
              </p>
              <p className="landing-footer__tagline" style={{ marginTop: '8px', fontSize: '0.82rem', opacity: 0.7 }}>
                Founded by <strong style={{ color: '#c4b5fd' }}>Aman Shukla</strong>
              </p>
              {/* Social */}
              <div className="landing-footer__social">
                {/* Twitter / X */}
                <a href="#" className="landing-footer__social-link" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="landing-footer__social-link" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.47 2H3.53A1.45 1.45 0 002.06 3.43v17.14A1.45 1.45 0 003.53 22h16.94A1.45 1.45 0 0021.94 20.57V3.43A1.45 1.45 0 0020.47 2zM8.09 18.74h-3v-9h3zM6.59 8.48a1.56 1.56 0 110-3.12 1.56 1.56 0 010 3.12zM18.91 18.74h-3v-4.38c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.41v4.46h-3v-9h2.88v1.24h.04a3.16 3.16 0 012.84-1.56c3.04 0 3.6 2 3.6 4.6v4.72z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="landing-footer__social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="landing-footer__social-link" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Link Groups */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} className="landing-footer__group">
                <h4 className="landing-footer__group-title">{group}</h4>
                <ul>
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="landing-footer__link">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="landing-footer__bottom">
            <p>© {new Date().getFullYear()} DISHA AI · Founded by Aman Shukla. All rights reserved.</p>
            <p className="landing-footer__built">
              Built with
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#ec4899" style={{ margin: '0 4px', verticalAlign: 'middle' }}>
                <path d="M7 12.5s-5.5-3.5-5.5-7A3 3 0 017 3.83 3 3 0 0112.5 5.5c0 3.5-5.5 7-5.5 7z"/>
              </svg>
              for students everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
