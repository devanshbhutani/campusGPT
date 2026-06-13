import { useMemo, useState } from 'react'
import { BRANCH_OPTIONS, CLUB_OPTIONS, DISH_OPTIONS, YEAR_OPTIONS } from '../data/dashboardData'
import TagSelect from './TagSelect'

function getSemestersForYear(year) {
  switch (year) {
    case '1st Year':
      return ['1', '2']
    case '2nd Year':
      return ['3', '4']
    case '3rd Year':
      return ['5', '6']
    case '4th Year':
      return ['7', '8']
    default:
      return []
  }
}

function UserSetup({ mode = 'create', initialProfile, onSave, onCancel }) {
  const [step, setStep] = useState(mode === 'edit' ? 'profile' : 'login')
  const [email, setEmail] = useState(initialProfile?.email || '')
  const [username, setUsername] = useState(initialProfile?.username || '')
  const [branch, setBranch] = useState(initialProfile?.branch || '')
  const [year, setYear] = useState(initialProfile?.year || '')
  const [semester, setSemester] = useState(initialProfile?.semester || '')
  const [clubs, setClubs] = useState(initialProfile?.clubs || [])
  const [favDishes, setFavDishes] = useState(initialProfile?.favDishes || [])

  const availableSemesters = useMemo(() => getSemestersForYear(year), [year])

  function handleEmailSubmit(event) {
    event.preventDefault()
    if (!email.trim()) return
    setStep('profile')
  }

  function handleProfileSubmit(event) {
    event.preventDefault()
    if (!username.trim() || !branch || !year || !semester) return

    onSave({
      email: email.trim(),
      username: username.trim(),
      branch,
      year,
      semester,
      clubs,
      favDishes,
      isOnboarded: true,
    })
  }

  return (
    <div className="setup-screen">
      <div className="setup-shell">
        <div className="setup-intro">
          <div className="setup-kicker">CampusGPT setup</div>
          <h2>{mode === 'edit' ? 'Edit your profile' : step === 'login' ? 'Welcome back' : 'Complete your profile'}</h2>
          <p>
            {mode === 'edit'
              ? 'Update your branch, semester, clubs, and favourite dishes.'
              : step === 'login'
                ? 'Use your email to start the personalized campus flow.'
                : 'This profile powers your dashboard, search, and desk suggestions.'}
          </p>
        </div>

        <div className="setup-card">
          {step === 'login' ? (
            <form className="setup-form" onSubmit={handleEmailSubmit}>
              <label className="field-block">
                <span className="field-label">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="text-field"
                  required
                />
              </label>

              <button type="submit" className="primary-button">
                Continue
              </button>
            </form>
          ) : (
            <form className="setup-form" onSubmit={handleProfileSubmit}>
              <label className="field-block">
                <span className="field-label">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="text-field"
                  required
                />
              </label>

              <label className="field-block">
                <span className="field-label">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Choose a username"
                  className="text-field"
                  required
                />
              </label>

              <label className="field-block">
                <span className="field-label">Branch</span>
                <select value={branch} onChange={(event) => setBranch(event.target.value)} className="select-field" required>
                  <option value="">Select your branch</option>
                  {BRANCH_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="field-split">
                <label className="field-block">
                  <span className="field-label">Year</span>
                  <select
                    value={year}
                    onChange={(event) => {
                      const nextYear = event.target.value
                      setYear(nextYear)
                      setSemester('')
                    }}
                    className="select-field"
                    required
                  >
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-block">
                  <span className="field-label">Semester</span>
                  <select value={semester} onChange={(event) => setSemester(event.target.value)} className="select-field" required>
                    <option value="">{year ? 'Select semester' : 'Select year first'}</option>
                    {availableSemesters.map((option) => (
                      <option key={option} value={option}>
                        Semester {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <TagSelect label="Clubs" helperText="Tap to toggle" options={CLUB_OPTIONS} selected={clubs} onChange={setClubs} />
              <TagSelect label="Favourite dishes" helperText="Tap to toggle" options={DISH_OPTIONS} selected={favDishes} onChange={setFavDishes} />

              <div className="setup-actions">
                {mode === 'edit' ? (
                  <button type="button" className="secondary-button" onClick={onCancel}>
                    Cancel
                  </button>
                ) : null}
                {mode === 'edit' ? null : step === 'profile' ? (
                  <button type="button" className="secondary-button" onClick={() => setStep('login')}>
                    Back
                  </button>
                ) : null}
                <button type="submit" className="primary-button">
                  {mode === 'edit' ? 'Save profile' : 'Save and continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSetup