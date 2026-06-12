import { useEffect, useState } from 'react'
import DeskCard from './DeskCard'
import { DASHBOARD_PANELS, createInitialDashboardCards } from '../data/dashboardData'

function DashboardSection() {
  const [cards, setCards] = useState(() => createInitialDashboardCards())

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    async function loadPanel(panel) {
      const response = await fetch(panel.endpoint, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Failed to load ${panel.title.toLowerCase()}`)
      }

      const payload = await response.json()
      return panel.buildCard(payload)
    }

    Promise.allSettled(DASHBOARD_PANELS.map((panel) => loadPanel(panel))).then((results) => {
      if (!isActive) return

      const nextCards = DASHBOARD_PANELS.map((panel, index) => {
        const result = results[index]

        if (result.status === 'fulfilled') {
          return {
            key: panel.key,
            loading: false,
            error: '',
            ...result.value,
          }
        }

        return {
          key: panel.key,
          title: panel.title,
          subtitle: panel.loadingSubtitle,
          items: [],
          footer: panel.footer,
          loading: false,
          error: result.reason?.message || 'Unable to reach the MCP server.',
          emptyText: panel.emptyText,
        }
      })

      setCards(nextCards)
    })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  return (
    <main className="desk-grid">
      <div className="section-head">
        <h2>Today's Desks</h2>
        <span>Section A</span>
      </div>

      {cards.map((card) => (
        <DeskCard key={card.key} card={card} />
      ))}

      <footer className="colophon-card">
        <div className="colophon-header">Colophon · Live MCP Endpoints</div>
        <div className="colophon-body">
          {DASHBOARD_PANELS.map((panel) => (
            <span key={panel.endpoint} className="endpoint-item">
              GET {panel.endpoint}
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default DashboardSection