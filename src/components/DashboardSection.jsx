import DeskCard from './DeskCard'

function DashboardSection({ cards, endpoints }) {
  return (
    <main className="desk-grid">
      <div className="section-head">
        <h2>Today's Desks</h2>
        <span>Section A</span>
      </div>

      {cards.map((card) => (
        <DeskCard key={card.title} card={card} />
      ))}

      <footer className="colophon-card">
        <div className="colophon-header">Colophon · Live MCP Endpoints</div>
        <div className="colophon-body">
          {endpoints.map((endpoint) => (
            <span key={endpoint} className="endpoint-item">
              GET {endpoint}
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default DashboardSection