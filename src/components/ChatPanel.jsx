function ChatPanel({ messages, question, onQuestionChange, onSend }) {
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
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Dispatch a question to the desk..."
          onKeyDown={(event) => event.key === 'Enter' && onSend()}
        />
        <button type="button" onClick={onSend} aria-label="Send question">➤</button>
      </div>
    </aside>
  )
}

export default ChatPanel