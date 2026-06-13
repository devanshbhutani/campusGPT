function Masthead({ formattedDate, activeView, onNavigate, profile, onEditProfile, onResetProfile }) {
  return (
    <header className="masthead">
      <div className="masthead-meta">VOL. I · NO. 001 · {formattedDate.toUpperCase()}</div>
      <div className="masthead-actions">
        <button
          type="button"
          className={['masthead-nav', activeView === 'dashboard' ? 'masthead-nav-active' : ''].filter(Boolean).join(' ')}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={['masthead-nav', activeView === 'search' ? 'masthead-nav-active' : ''].filter(Boolean).join(' ')}
          onClick={() => onNavigate('search')}
        >
          Search
        </button>
        <span className="pill pill-live">6 MCP DESKS LIVE</span>
        {profile?.username ? (
          <button type="button" className="pill pill-brand" onClick={onEditProfile}>
            {profile.username}
          </button>
        ) : null}
        {onResetProfile ? (
          <button type="button" className="masthead-link" onClick={onResetProfile}>
            Reset
          </button>
        ) : null}
      </div>
    </header>
  )
}

export default Masthead