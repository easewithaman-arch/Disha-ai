import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Explorer' },
    { path: '/compare', label: 'Compare' },
    { path: '/skills', label: 'Skills' },
    { path: '/mentor', label: 'AI Mentor' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="url(#navGrad)" strokeWidth="4"/>
              <path d="M30 50 Q50 20 70 50 Q50 80 30 50Z" fill="url(#navGrad)" opacity="0.85"/>
              <circle cx="50" cy="35" r="5" fill="#fff"/>
              <circle cx="38" cy="55" r="3" fill="#fff" opacity="0.7"/>
              <circle cx="62" cy="55" r="3" fill="#fff" opacity="0.7"/>
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar__logo-text">
            DISHA<span className="navbar__logo-ai">AI</span>
          </span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/onboarding" className="btn-primary navbar__cta">
            Get Started
          </Link>
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
