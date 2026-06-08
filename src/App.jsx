import { useMemo, useState } from 'react'
import './App.css'

const MCP_CARDS = [
  {
    title: 'Stacks Desk',
    subtitle: '6 titles back on the shelves',
    items: [
      { title: 'Introduction to Algorithms', details: 'Cormen, Leiserson, Rivest, Stein', status: '2/4' },
      { title: 'The Pragmatic Programmer', details: 'Hunt & Thomas', status: '1/2' },
      { title: 'Deep Learning', details: 'Goodfellow, Bengio, Courville', status: '2/2' },
      { title: 'Sapiens', details: 'Yuval Noah Harari', status: '3/5' },
    ],
    footer: 'By the Library MCP',
  },
  {
    title: 'Calendar Desk',
    subtitle: '6 happenings on the bill',
    items: [
      { title: 'TechFest 2026 — Opening Ceremony', details: '2026-06-12 · 10:00 · Main Auditorium' },
      { title: 'AI Workshop: Build with LLMs', details: '2026-06-12 · 14:00 · CS Lab 3' },
      { title: 'Open Mic Night', details: '2026-06-13 · 19:30 · Amphitheatre' },
    ],
    footer: 'By the Events MCP',
  },
  {
    title: 'Registrar',
    subtitle: "3 classes on Monday's docket",
    items: [
      { title: 'CS301 Operating Systems', details: 'B-204', status: '09:00' },
      { title: 'MA204 Linear Algebra', details: 'A-101', status: '11:00' },
      { title: 'CS342 Databases Lab', details: 'Lab-2', status: '14:00' },
    ],
    footer: 'By the Academics MCP',
  },
  {
    title: 'Bulletin',
    subtitle: '4 bulletins on the wire',
    items: [
      { label: 'HIGH', title: 'Power maintenance in Block B', details: 'Power will be down in Block B from 14:00 to 16:30 on June 10.' },
      { label: 'MEDIUM', title: 'Library extended hours', details: 'From June 10–25 the central library stays open later each night.' },
      { label: 'LOW', title: 'Lost: Black Kindle near Café-2', details: 'If found please drop at the Student Affairs desk.' },
    ],
    footer: 'By the Announcements MCP',
  },
]

const MCP_ENDPOINTS = [
  '/api/mcp/library',
  '/api/mcp/events',
  '/api/mcp/transport',
  '/api/mcp/cafeteria',
  '/api/mcp/academics',
  '/api/mcp/announcements',
]

const TOOL_ROUTES = [
  { id: 'library_search', label: 'Library Search', keywords: ['library', 'book', 'clean code', 'catalog', 'shelves'] },
  { id: 'events', label: 'Events Desk', keywords: ['techfest', 'workshop', 'open mic', 'event', 'happening', 'calendar'] },
  { id: 'transport', label: 'Transit Desk', keywords: ['shuttle', 'metro', 'transport', 'route', 'bus', 'station'] },
  { id: 'academics', label: 'Registrar', keywords: ['class', 'course', 'exam', 'schedule', 'docket'] },
]

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'user',
      text: "Is 'Clean Code' available in the library right now?",
      detail: 'Dispatch',
    },
    {
      role: 'assistant',
      text: 'I encountered a technical issue while searching the library database. Please try again in a moment, or visit the library circulation desk to check the status of "Clean Code".',
      detail: 'library_search',
    },
  ])

  const route = useMemo(() => {
    const lastAssistant = messages.find((msg) => msg.role === 'assistant')?.detail
    return lastAssistant || 'library_search'
  }, [messages])

  function findServerRoute(message) {
    const normalized = message.toLowerCase()
    const route = TOOL_ROUTES.find((tool) => tool.keywords.some((term) => normalized.includes(term)))
    return route || TOOL_ROUTES[0]
  }

  function handleSend() {
    const trimmed = question.trim()
    if (!trimmed) return

    const routeMatch = findServerRoute(trimmed)
    const userMsg = { role: 'user', text: trimmed, detail: 'Dispatch' }
    const assistantMsg = {
      role: 'assistant',
      text: `Routing your request to ${routeMatch.label}. Ask the desk anything about ${routeMatch.label.toLowerCase()}.`,
      detail: routeMatch.id,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setQuestion('')
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-meta">VOL. I · NO. 001 · MONDAY, JUNE 8, 2026</div>
        <div className="masthead-actions">
          <span className="pill pill-live">6 MCP DESKS LIVE</span>
        </div>
      </header>

      <h1 className="brand-title">CampusGPT</h1>
      <div className="ticker-bar">
        Library extended hours · Low - Lost: Black Kindle near Café-2 · Medium - Convocation rehearsal · North Gate ↔ Metro Station next 08:15 · Main Campus Bulletin
      </div>

      <div className="page-grid">
        <main className="desk-grid">
          <div className="section-head">
            <h2>Today's Desks</h2>
            <span>Section A</span>
          </div>

          {MCP_CARDS.map((card) => (
            <article key={card.title} className="desk-card">
              <div className="desk-card-header">
                <span>{card.title}</span>
                <span className="desk-icon">✧</span>
              </div>
              <h3>{card.subtitle}</h3>
              <div className="desk-card-body">
                {card.items.map((item, index) => (
                  <div key={`${card.title}-${index}`} className="desk-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.details}</p>
                    </div>
                    {item.status ? <span className="item-status">{item.status}</span> : null}
                  </div>
                ))}
              </div>
              <div className="desk-card-footer">
                <span>{card.footer}</span>
                <button type="button">Ask ↗</button>
              </div>
            </article>
          ))}

          <footer className="colophon-card">
            <div className="colophon-header">Colophon · Live MCP Endpoints</div>
            <div className="colophon-body">
              {MCP_ENDPOINTS.map((endpoint) => (
                <span key={endpoint} className="endpoint-item">GET {endpoint}</span>
              ))}
            </div>
          </footer>
        </main>

        <aside className="chat-panel">
          <div className="chat-header">
            <div className="chat-title-block">
              <div className="chat-logo">CG</div>
              <div>
                <div className="chat-title">Ask the Desk</div>
                <div className="chat-subtitle">Live AI · Routes to MCP servers</div>
              </div>
            </div>
            <button type="button" className="clear-button">Clear</button>
          </div>

          <div className="chat-history">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'chat-bubble user' : 'chat-bubble assistant'}>
                <div className="chat-bubble-header">
                  <span>{message.role === 'user' ? 'YOU · DISPATCH' : 'DESK REPLY'}</span>
                  {message.role === 'assistant' ? <span className="badge">{message.detail.toUpperCase()}</span> : null}
                </div>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <div className="chat-composer">
            <label htmlFor="query" className="sr-only">Dispatch a question to the desk</label>
            <input
              id="query"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Dispatch a question to the desk..."
              onKeyDown={(event) => event.key === 'Enter' && handleSend()}
            />
            <button type="button" onClick={handleSend} aria-label="Send question">➤</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
