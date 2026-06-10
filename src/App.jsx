import { useEffect, useState } from 'react'
import ChatPanel from './components/ChatPanel'
import DashboardSection from './components/DashboardSection'
import Masthead from './components/Masthead'
import { INITIAL_MESSAGES, MCP_CARDS, MCP_ENDPOINTS, TOOL_ROUTES } from './data/dashboardData'
import './App.css'

function App() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  useEffect(() => {
    const updateDate = () => setCurrentDate(new Date())

    updateDate()
    const intervalId = window.setInterval(updateDate, 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(currentDate)

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
      <Masthead formattedDate={formattedDate} />

      <h1 className="brand-title">CampusGPT</h1>
      <div className="ticker-bar">
        Library extended hours · Low - Lost: Black Kindle near Café-2 · Medium - Convocation rehearsal · North Gate ↔ Metro Station next 08:15 · Main Campus Bulletin
      </div>

      <div className="page-grid">
        <DashboardSection cards={MCP_CARDS} endpoints={MCP_ENDPOINTS} />
        <ChatPanel
          messages={messages}
          question={question}
          onQuestionChange={setQuestion}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

export default App
