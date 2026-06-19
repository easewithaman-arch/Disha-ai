import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Mentor.css'

const quickPrompts = [
  'What career fits me best?',
  'How do I become an AI engineer?',
  'Compare tech vs design careers',
  'What skills should I learn first?',
  'Help me plan my semester',
  'Industry trends in 2025',
]

const topics = [
  { label: 'Career Guidance', icon: '🧭' },
  { label: 'Skill Development', icon: '🛠' },
  { label: 'Education Planning', icon: '🎓' },
  { label: 'Industry Insights', icon: '📈' },
  { label: 'Interview Prep', icon: '🎤' },
]

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: 'Hello! I\'m your DISHA AI Mentor. I\'ve analyzed your profile and I\'m ready to guide you through your career exploration journey. What would you like to discuss today? 🚀',
    time: '10:00 AM',
  },
  {
    id: 2,
    role: 'user',
    text: 'What career path would you recommend for someone who loves both coding and design?',
    time: '10:02 AM',
  },
  {
    id: 3,
    role: 'ai',
    text: `Great question! Based on your profile showing strong analytical skills (90%) and creative interests, I'd recommend exploring these hybrid paths:

**1. UX Engineering** — Combines coding with user experience design. You'd build interactive interfaces while applying design thinking.

**2. Creative Technology** — Work at the intersection of art and technology, building interactive installations, generative art, or AR/VR experiences.

**3. Product Design** — A more strategic role where you design and prototype digital products, requiring both technical understanding and design sensibility.

Would you like me to dive deeper into any of these paths?`,
    time: '10:02 AM',
  },
  {
    id: 4,
    role: 'user',
    text: 'Tell me more about UX Engineering',
    time: '10:05 AM',
  },
  {
    id: 5,
    role: 'ai',
    text: `UX Engineering is an exciting and rapidly growing field! Here's a detailed breakdown:

**📊 Market Overview:**
• Average Salary: $110K – $165K
• Job Growth: 25% (Much faster than average)
• Remote-friendly: Yes, highly

**🛠 Key Skills Needed:**
• Frontend Development (React, Vue, Angular)
• Design Systems & Component Libraries
• Prototyping Tools (Figma, Framer)
• Accessibility & Performance
• User Research & Testing

**🎓 Recommended Path:**
1. Master HTML/CSS/JavaScript
2. Learn a frontend framework
3. Study UX design principles
4. Build a portfolio of interactive projects
5. Contribute to design systems

Based on your current skills, you're about 68% ready for this career. Should I create a personalized learning roadmap?`,
    time: '10:06 AM',
  },
]

const simulatedResponse =
  "That's an excellent question! Let me analyze this based on your profile data and current industry trends. I'll have a detailed response for you shortly. In the meantime, you can explore the Career Dashboard for related insights."

function formatMessage(text) {
  const parts = []
  const lines = text.split('\n')

  lines.forEach((line, li) => {
    let processed = line

    // bold
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    if (li > 0) parts.push(<br key={`br-${li}`} />)

    parts.push(
      <span key={`line-${li}`} dangerouslySetInnerHTML={{ __html: processed }} />
    )
  })

  return parts
}

function BrainIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#mentorGrad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="mentorGrad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 5.5V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.5c1.5-1 3-3 3-5.5a7 7 0 0 0-7-7z" />
      <path d="M9 21h6" />
      <path d="M12 2v5" />
      <path d="M8 8h3" />
      <path d="M13 8h3" />
      <path d="M9 12h2" />
      <path d="M13 12h2" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  )
}

export default function Mentor() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTopic, setActiveTopic] = useState('Career Guidance')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const nextId = useRef(initialMessages.length + 1)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getTimeString = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg = {
      id: nextId.current++,
      role: 'user',
      text: trimmed,
      time: getTimeString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg = {
        id: nextId.current++,
        role: 'ai',
        text: simulatedResponse,
        time: getTimeString(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt)
    if (window.innerWidth < 900) setSidebarOpen(false)
  }

  return (
    <div className="mentor-page">
      {/* Mobile toggle */}
      <button
        className="mentor-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen ? (
            <>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </>
          ) : (
            <>
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="mentor-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`mentor-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Profile Card */}
        <div className="mentor-profile-card">
          <div className="mentor-avatar">
            <BrainIcon />
          </div>
          <h3 className="mentor-name">DISHA Mentor</h3>
          <span className="mentor-status">
            <span className="mentor-status-dot" />
            Online
          </span>
          <p className="mentor-bio">
            I&rsquo;m your AI career mentor. Ask me anything about career paths, skills, industry trends, or education planning.
          </p>
        </div>

        {/* Quick Prompts */}
        <div className="mentor-section">
          <h4 className="mentor-section-title">Quick Prompts</h4>
          <div className="mentor-prompts">
            {quickPrompts.map((p) => (
              <button
                key={p}
                className="mentor-prompt-chip"
                onClick={() => handleQuickPrompt(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mentor-section">
          <h4 className="mentor-section-title">Topics</h4>
          <div className="mentor-topics">
            {topics.map((t) => (
              <button
                key={t.label}
                className={`mentor-topic-btn${activeTopic === t.label ? ' active' : ''}`}
                onClick={() => setActiveTopic(t.label)}
              >
                <span className="mentor-topic-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="mentor-chat-area">
        {/* Header */}
        <div className="mentor-chat-header">
          <div className="mentor-chat-header-left">
            <div className="mentor-avatar-sm">
              <BrainIcon />
            </div>
            <div>
              <h2 className="mentor-chat-title">DISHA Mentor</h2>
              <span className="mentor-chat-subtitle">AI Career Advisor · Always available</span>
            </div>
          </div>
          <Link to="/dashboard" className="mentor-dashboard-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Messages */}
        <div className="mentor-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`mentor-msg mentor-msg-${msg.role}`}>
              {msg.role === 'ai' && (
                <div className="mentor-msg-avatar">
                  <BrainIcon />
                </div>
              )}
              <div className="mentor-msg-content">
                <div className={`mentor-msg-bubble mentor-msg-bubble-${msg.role}`}>
                  {formatMessage(msg.text)}
                </div>
                <span className="mentor-msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="mentor-msg mentor-msg-ai">
              <div className="mentor-msg-avatar">
                <BrainIcon />
              </div>
              <div className="mentor-msg-content">
                <div className="mentor-msg-bubble mentor-msg-bubble-ai mentor-typing-bubble">
                  <div className="mentor-typing-dots">
                    <span className="mentor-dot" />
                    <span className="mentor-dot" />
                    <span className="mentor-dot" />
                  </div>
                  <span className="mentor-typing-label">AI is typing</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form className="mentor-input-bar" onSubmit={handleSubmit}>
          <div className="mentor-input-container">
            <input
              ref={inputRef}
              type="text"
              className="mentor-input"
              placeholder="Ask your AI mentor anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="mentor-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
