import { useState } from 'react'
import { CHAT_API_URL, INITIAL_CHAT_MESSAGES } from '../data/dashboardData'

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ChatPanel() {
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES)
  const [question, setQuestion] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    const trimmed = question.trim()
    if (!trimmed || isSending) return

    const userMessage = { id: createId(), role: 'user', text: trimmed, detail: 'Dispatch' }
    const pendingId = createId()

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: pendingId,
        role: 'assistant',
        text: 'Thinking with the MCP servers...',
        detail: 'routing',
        loading: true,
      },
    ])
    setQuestion('')
    setIsSending(true)
    setError('')

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'The AI backend is unavailable.')
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === pendingId
            ? {
                id: pendingId,
                role: 'assistant',
                text: payload.answer,
                detail: payload.tool || payload.source || 'mcp',
                loading: false,
              }
            : message,
        ),
      )
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : 'Something went wrong.'
      setError(errorMessage)
      setMessages((prev) =>
        prev.map((message) =>
          message.id === pendingId
            ? {
                id: pendingId,
                role: 'assistant',
                text: errorMessage,
                detail: 'error',
                loading: false,
              }
            : message,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }

  function clearChat() {
    setMessages(INITIAL_CHAT_MESSAGES)
    setQuestion('')
    setError('')
    setIsSending(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <aside className="chat-panel">
      <div className="chat-header">
        <div className="chat-title-block">
          <div className="chat-logo">CG</div>
          <div>
            <div className="chat-title">Ask the Desk</div>
            <div className="chat-subtitle">Live AI · Routes to MCP servers</div>
          </div>
        </div>
        <button type="button" className="clear-button" onClick={clearChat}>
          Clear
        </button>
      </div>

      <div className="chat-history">
        {messages.map((message, index) => (
          <div
            key={message.id || `${message.role}-${index}`}
            className={[
              'chat-bubble',
              message.role === 'user' ? 'user' : 'assistant',
              message.loading ? 'loading' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="chat-bubble-header">
              <span>{message.role === 'user' ? 'YOU · DISPATCH' : 'DESK REPLY'}</span>
              {message.role === 'assistant' ? <span className="badge">{message.detail.toUpperCase()}</span> : null}
            </div>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      {error ? <div className="chat-status chat-status-error">{error}</div> : null}

      <div className="chat-composer">
        <label htmlFor="query" className="sr-only">Dispatch a question to the desk</label>
        <input
          id="query"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Dispatch a question to the desk..."
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <button type="button" onClick={handleSend} aria-label="Send question" disabled={isSending}>
          {isSending ? '…' : '➤'}
        </button>
      </div>
    </aside>
  )
}

export default ChatPanel