import { useEffect, useState } from 'react'
import ChatPanel from './components/ChatPanel'
import DashboardSection from './components/DashboardSection'
import ProfileSummary from './components/ProfileSummary'
import Masthead from './components/Masthead'
import SearchView from './components/SearchView'
import UserSetup from './components/UserSetup'
import {
  buildAnnouncementTicker,
  clearProfileStorage,
  createDefaultProfile,
  loadProfileFromStorage,
  loadViewFromStorage,
  normalizeProfile,
  saveProfileToStorage,
  saveViewToStorage,
} from './data/dashboardData'
import './App.css'

function App() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [profile, setProfile] = useState(() => loadProfileFromStorage())
  const [activeView, setActiveView] = useState(() => loadViewFromStorage())
  const [profileMode, setProfileMode] = useState(() => (loadProfileFromStorage().isOnboarded ? '' : 'create'))
  const [searchSeed, setSearchSeed] = useState('')

  useEffect(() => {
    const updateDate = () => setCurrentDate(new Date())

    updateDate()
    const intervalId = window.setInterval(updateDate, 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    saveViewToStorage(activeView)
  }, [activeView])

  useEffect(() => {
    if (profile?.isOnboarded) {
      saveProfileToStorage(profile)
    }
  }, [profile])

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(currentDate)

  function handleSaveProfile(nextProfile) {
    const normalizedProfile = normalizeProfile(nextProfile)
    setProfile(normalizedProfile)
    saveProfileToStorage(normalizedProfile)
    setProfileMode('')
    setActiveView('dashboard')
  }

  function handleResetProfile() {
    clearProfileStorage()
    setProfile(createDefaultProfile())
    setProfileMode('create')
    setSearchSeed('')
    setActiveView('dashboard')
  }

  function handleAskDesk(seed) {
    setSearchSeed(seed || '')
    setActiveView('search')
  }

  const needsProfileSetup = profileMode === 'create' || profileMode === 'edit' || !profile.isOnboarded

  return (
    <div className="app-shell">
      <Masthead
        formattedDate={formattedDate}
        activeView={activeView}
        onNavigate={setActiveView}
        profile={profile}
        onEditProfile={() => setProfileMode('edit')}
        onResetProfile={profile.isOnboarded ? handleResetProfile : undefined}
      />

      {needsProfileSetup ? (
        <UserSetup
          mode={profileMode || 'create'}
          initialProfile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setProfileMode('')}
        />
      ) : (
        <>
          <h1 className="brand-title">CampusGPT</h1>

          {activeView === 'search' ? (
            <SearchView
              key={`${searchSeed}-${profile.email}-${activeView}`}
              profile={profile}
              initialQuery={searchSeed}
              onBack={() => setActiveView('dashboard')}
            />
          ) : (
            <>
              <ProfileSummary profile={profile} onEdit={() => setProfileMode('edit')} />
              <div className="ticker-bar">{buildAnnouncementTicker()}</div>

              <div className="page-grid">
                <DashboardSection profile={profile} onAskDesk={handleAskDesk} />
                <ChatPanel />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default App
