import { askDishaStream, initChat, resetChat, isApiKeyConfigured } from '../services/gemini'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Mentor.css'

const quickPrompts = [
  'What career fits me best?',
  'How do I become an AI engineer?',
  'Compare tech vs design careers',
  'What skills should I learn first?',
  'Help me plan my semester',
  'What are the top industry trends right now?',
]

const topics = [
  { label: 'Career Guidance', icon: '🧭' },
  { label: 'Skill Development', icon: '🛠' },
  { label: 'Education Planning', icon: '🎓' },
  { label: 'Industry Insights', icon: '📈' },
  { label: 'Interview Prep', icon: '🎤' },
]

const WELCOME_MESSAGE = `Hello! I'm your **DISHA AI Mentor** 🚀

I'm here to help you explore career paths, analyze your skills, and plan your future. Here's what I can help with:

• 🧭 **Career exploration** — discover paths that match your interests
• 📊 **Skill gap analysis** — see what you need to learn
• 🎓 **Education planning** — courses, certifications, degrees
• 💡 **Industry insights** — trends, salaries, and growth data

What would you like to explore today?`

function formatMessage(text) {
  const parts = []
  const lines = text.split('\n')

  lines.forEach((line, li) => {
    let processed = line
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>')

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

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}

export default function Mentor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: WELCOME_MESSAGE,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingId, setStreamingId] = useState(null)
  const [activeTopic, setActiveTopic] = useState('Career Guidance')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const nextId = useRef(2)
  const chatInitialized = useRef(false)

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  // Initialize chat session on mount (no API call — just prepares the session)
  useEffect(() => {
    if (chatInitialized.current) return
    chatInitialized.current = true

    if (isApiKeyConfigured()) {
      try {
        initChat()
      } catch (e) {
        console.error('Failed to init chat:', e)
      }
    }
  }, [])

  const getTimeString = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    if (!isApiKeyConfigured()) {
      setError('API key not configured. Add VITE_GEMINI_API_KEY to .env and restart.')
      return
    }

    setError(null)

    // Add user message
    const userMsg = {
      id: nextId.current++,
      role: 'user',
      text: trimmed,
      time: getTimeString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Create a placeholder AI message for streaming
    const aiMsgId = nextId.current++
    const aiMsg = {
      id: aiMsgId,
      role: 'ai',
      text: '',
      time: getTimeString(),
      isStreaming: true,
    }
    setMessages((prev) => [...prev, aiMsg])
    setStreamingId(aiMsgId)

    try {
      const finalText = await askDishaStream(trimmed, (partialText) => {
        // Update the AI message with each chunk — text appears in real time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: partialText } : msg
          )
        )
      })

      // Mark as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, text: finalText, isStreaming: false, time: getTimeString() }
            : msg
        )
      )
    } catch (err) {
      console.error('Gemini API error:', err)

      let errorText = "I'm sorry, I encountered an issue. Please try again."

      if (err.message === 'API_KEY_MISSING') {
        errorText = "⚠️ API key is not configured. Please add it to `.env` and restart."
      } else if (err.message === 'API_KEY_INVALID') {
        errorText = "⚠️ API key is invalid. Get a valid key from https://aistudio.google.com/apikey"
      } else if (err.message?.includes('429') || err.message?.includes('quota')) {
        errorText = "⏳ I'm being rate-limited right now. Please wait a few seconds and try again."
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, text: errorText, isStreaming: false }
            : msg
        )
      )
      setError('Request failed — please try again in a moment.')
    }

    setIsTyping(false)
    setStreamingId(null)
    inputRef.current?.focus()
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

  const handleNewChat = () => {
    resetChat()
    chatInitialized.current = false
    setMessages([
      {
        id: 1,
        role: 'ai',
        text: WELCOME_MESSAGE,
        time: getTimeString(),
      },
    ])
    setError(null)
    nextId.current = 2
    setStreamingId(null)
    setIsTyping(false)

    if (isApiKeyConfigured()) {
      try {
        initChat()
        chatInitialized.current = true
      } catch (e) {
        console.error('Failed to reinit chat:', e)
      }
    }
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

      {sidebarOpen && (
        <div className="mentor-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`mentor-sidebar${sidebarOpen ? ' open' : ''}`}>
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
            Your AI career mentor powered by Google Gemini. Ask anything about careers, skills, or education.
          </p>
        </div>

        <div className="mentor-section">
          <h4 className="mentor-section-title">Quick Prompts</h4>
          <div className="mentor-prompts">
            {quickPrompts.map((p) => (
              <button
                key={p}
                className="mentor-prompt-chip"
                onClick={() => handleQuickPrompt(p)}
                disabled={isTyping}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mentor-section">
          <h4 className="mentor-section-title">Topics</h4>
          <div className="mentor-topics">
            {topics.map((t) => (
              <button
                key={t.label}
                className={`mentor-topic-btn${activeTopic === t.label ? ' active' : ''}`}
                onClick={() => {
                  setActiveTopic(t.label)
                  handleQuickPrompt(`Tell me about ${t.label.toLowerCase()}`)
                }}
              >
                <span className="mentor-topic-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mentor-section">
          <button className="mentor-new-chat-btn" onClick={handleNewChat} disabled={isTyping}>
            <RefreshIcon />
            New Conversation
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="mentor-chat-area">
        <div className="mentor-chat-header">
          <div className="mentor-chat-header-left">
            <div className="mentor-avatar-sm">
              <BrainIcon />
            </div>
            <div>
              <h2 className="mentor-chat-title">DISHA Mentor</h2>
              <span className="mentor-chat-subtitle">
                Powered by Gemini AI · Always available
              </span>
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
            <div key={msg.id} className={`mentor-msg mentor-msg-${msg.role} animate-fade-in`}>
              {msg.role === 'ai' && (
                <div className="mentor-msg-avatar">
                  <BrainIcon />
                </div>
              )}
              <div className="mentor-msg-content">
                <div className={`mentor-msg-bubble mentor-msg-bubble-${msg.role} ${msg.isStreaming ? 'mentor-msg-streaming' : ''}`}>
                  {formatMessage(msg.text)}
                  {msg.isStreaming && <span className="mentor-cursor">▍</span>}
                </div>
                <span className="mentor-msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {error && (
            <div className="mentor-error-notice animate-fade-in">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>Dismiss</button>
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
              autoFocus
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
          <p className="mentor-input-hint">
            Powered by Google Gemini AI · Responses may not always be accurate
          </p>
        </form>
      </main>
    </div>
  )
}
