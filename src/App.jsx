import { useEffect, useState } from 'react'
import ChatPanel from './components/ChatPanel'
import DashboardSection from './components/DashboardSection'
import Masthead from './components/Masthead'
import { buildAnnouncementTicker } from './data/dashboardData'
import './App.css'

function App() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

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

  return (
    <div className="app-shell">
      <Masthead formattedDate={formattedDate} />

      <h1 className="brand-title">CampusGPT</h1>
      <div className="ticker-bar">{buildAnnouncementTicker()}</div>

      <div className="page-grid">
        <DashboardSection />
        <ChatPanel />
      </div>
    </div>
  )
}

export default App
