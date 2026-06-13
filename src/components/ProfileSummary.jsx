function ProfileSummary({ profile, onEdit }) {
  const initials = profile?.username ? profile.username.slice(0, 2).toUpperCase() : 'CG'

  return (
    <section className="profile-summary">
      <div className="profile-summary-top">
        <div className="profile-avatar">{initials}</div>
        <div>
          <div className="profile-label">Personal desk</div>
          <h2>{profile?.username || 'Campus user'}</h2>
          <p>{profile?.email || 'No email saved yet'}</p>
        </div>
        <button type="button" className="secondary-button profile-edit-button" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      <div className="profile-badges">
        {profile?.branch ? <span className="profile-badge">{profile.branch}</span> : null}
        {profile?.year ? <span className="profile-badge">{profile.year}</span> : null}
        {profile?.semester ? <span className="profile-badge">Semester {profile.semester}</span> : null}
      </div>

      <div className="profile-columns">
        <div>
          <div className="profile-subhead">Clubs</div>
          <div className="profile-tags">
            {profile?.clubs?.length ? profile.clubs.map((club) => <span key={club} className="profile-tag">{club}</span>) : <span className="profile-muted">No clubs added yet</span>}
          </div>
        </div>

        <div>
          <div className="profile-subhead">Favourite dishes</div>
          <div className="profile-tags">
            {profile?.favDishes?.length ? profile.favDishes.map((dish) => <span key={dish} className="profile-tag">{dish}</span>) : <span className="profile-muted">No favourites added yet</span>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileSummary