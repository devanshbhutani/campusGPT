function DeskCard({ card }) {
  return (
    <article className="desk-card">
      <div className="desk-card-header">
        <span>{card.title}</span>
        <span className="desk-icon">✧</span>
      </div>
      <h3>{card.subtitle}</h3>

      {card.loading ? (
        <div className="desk-state desk-state-loading">Loading live data from the MCP server...</div>
      ) : card.error ? (
        <div className="desk-state desk-state-error">{card.error}</div>
      ) : card.items.length > 0 ? (
        <div className="desk-card-body">
          {card.items.map((item, index) => (
            <div key={`${card.title}-${index}`} className="desk-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.details}</p>
              </div>
              <div className="desk-item-meta">
                {item.label ? <span className="item-label">{item.label}</span> : null}
                {item.status ? <span className="item-status">{item.status}</span> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="desk-state desk-state-empty">{card.emptyText || 'No records found.'}</div>
      )}

      <div className="desk-card-footer">
        <span>{card.footer}</span>
        <button type="button">Ask ↗</button>
      </div>
    </article>
  )
}

export default DeskCard