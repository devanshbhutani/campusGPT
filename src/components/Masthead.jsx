function Masthead({ formattedDate }) {
  return (
    <header className="masthead">
      <div className="masthead-meta">VOL. I · NO. 001 · {formattedDate.toUpperCase()}</div>
      <div className="masthead-actions">
        <span className="pill pill-live">6 MCP DESKS LIVE</span>
      </div>
    </header>
  )
}

export default Masthead