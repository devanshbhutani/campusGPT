import { useEffect, useMemo, useState } from 'react'
import DeskCard from './DeskCard'
import { SEARCH_EXAMPLES } from '../data/dashboardData'

const SEARCH_ENDPOINTS = {
  library: 'http://localhost:3001/api/mcp/library',
  academics: 'http://localhost:3004/api/mcp/academics',
  events: 'http://localhost:3003/api/mcp/events',
  cafeteria: 'http://localhost:3002/api/mcp/cafeteria',
}

function normalize(value = '') {
  return String(value).toLowerCase().trim()
}

function flattenMenu(day, menu = {}) {
  return Object.entries(menu).map(([meal, items]) => ({
    title: meal.charAt(0).toUpperCase() + meal.slice(1),
    details: items,
    status: day || 'Live',
  }))
}

function SearchView({ profile, initialQuery = '', onBack }) {
  const [query, setQuery] = useState(initialQuery)
  const [recentQueries, setRecentQueries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ library: [], schedule: [], events: [], cafeteria: [] })

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const [libraryRes, academicsRes, eventsRes, cafeteriaRes] = await Promise.all([
          fetch(SEARCH_ENDPOINTS.library, { signal: controller.signal }),
          fetch(SEARCH_ENDPOINTS.academics, { signal: controller.signal }),
          fetch(SEARCH_ENDPOINTS.events, { signal: controller.signal }),
          fetch(SEARCH_ENDPOINTS.cafeteria, { signal: controller.signal }),
        ])

        const [libraryJson, academicsJson, eventsJson, cafeteriaJson] = await Promise.all([
          libraryRes.json(),
          academicsRes.json(),
          eventsRes.json(),
          cafeteriaRes.json(),
        ])

        setData({
          library: Array.isArray(libraryJson.books) ? libraryJson.books : [],
          schedule: Array.isArray(academicsJson.schedule) ? academicsJson.schedule : [],
          events: Array.isArray(eventsJson.events) ? eventsJson.events : [],
          cafeteria: flattenMenu(cafeteriaJson.day, cafeteriaJson.menu || {}),
        })
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Search data could not be loaded right now.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    return () => controller.abort()
  }, [])

  const cards = useMemo(() => {
    const q = normalize(query)
    const branchName = normalize(profile?.branch || '')
    const branchCode = branchName.includes('computer') || branchName.includes('cs')
      ? 'CS'
      : branchName.includes('electrical') || branchName.includes('electronics')
        ? 'EC'
        : branchName.includes('mechanical')
          ? 'ME'
          : branchName.includes('civil')
            ? 'CE'
            : branchName.includes('chemical')
              ? 'CH'
              : branchName.includes('mathematics') || branchName.includes('math')
                ? 'MA'
                : branchName.includes('physics')
                  ? 'PH'
                  : ''

    const libraryItems = data.library
      .filter((book) => !q || [book.title, book.author].some((field) => normalize(field).includes(q)))
      .map((book) => ({
        title: book.title,
        details: book.author,
        status: book.available ? `${book.copies} copies` : 'Checked out',
      }))

    const scheduleItems = data.schedule
      .filter((entry) => {
        const haystack = normalize(`${entry.course} ${entry.faculty} ${entry.room} ${entry.days}`)
        return !q || haystack.includes(q) || (branchCode ? normalize(entry.course).startsWith(branchCode.toLowerCase()) : false)
      })
      .map((entry) => ({
        title: entry.course,
        details: `${entry.faculty} · ${entry.room} · ${entry.days}`,
        status: entry.time,
      }))

    const eventItems = data.events
      .filter((event) => {
        const haystack = normalize(`${event.name} ${event.venue} ${event.category}`)
        return !q || haystack.includes(q) || profile?.clubs?.some((club) => haystack.includes(normalize(club)))
      })
      .map((event) => ({
        title: event.name,
        details: `${event.date} · ${event.time} · ${event.venue}`,
        status: event.category.toUpperCase(),
      }))

    const cafeteriaItems = data.cafeteria
      .filter((meal) => {
        const haystack = normalize(`${meal.title} ${meal.details}`)
        return !q || haystack.includes(q) || profile?.favDishes?.some((dish) => haystack.includes(normalize(dish)))
      })
      .map((meal) => ({
        title: meal.title,
        details: meal.details,
        status: meal.status,
      }))

    return [
      {
        key: 'library-search',
        title: 'Stacks Desk',
        subtitle: q ? `${libraryItems.length} matching books` : `${data.library.length} books loaded`,
        items: libraryItems,
        footer: 'Library MCP',
        emptyText: 'No books matched this search.',
      },
      {
        key: 'academics-search',
        title: 'Registrar',
        subtitle: q ? `${scheduleItems.length} matching classes` : `${data.schedule.length} classes on file`,
        items: scheduleItems,
        footer: 'Academics MCP',
        emptyText: 'No classes matched this search.',
      },
      {
        key: 'events-search',
        title: 'Calendar Desk',
        subtitle: q ? `${eventItems.length} matching events` : `${data.events.length} upcoming events`,
        items: eventItems,
        footer: 'Events MCP',
        emptyText: 'No events matched this search.',
      },
      {
        key: 'cafeteria-search',
        title: 'Cafeteria Desk',
        subtitle: data.cafeteria.length ? 'Today at the mess' : 'Menu unavailable',
        items: cafeteriaItems,
        footer: 'Cafeteria MCP',
        emptyText: 'No menu items were returned.',
      },
    ]
  }, [data, profile, query])

  function handleSearch(nextQuery) {
    const trimmed = String(nextQuery ?? query).trim()
    if (!trimmed) return

    setQuery(trimmed)
    setRecentQueries((previous) => [trimmed, ...previous.filter((item) => item !== trimmed)].slice(0, 4))
  }

  return (
    <section className="search-view">
      <div className="search-hero">
        <div>
          <div className="search-kicker">Campus search</div>
          <h2>What would you like to know?</h2>
          <p>Search across books, classes, events, and today&apos;s menu.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to dashboard
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch(query)
            }
          }}
          placeholder="e.g. Clean Code, club events, or lunch today"
          className="text-field search-input"
        />
        <button type="button" className="primary-button search-button" onClick={() => handleSearch(query)}>
          Search
        </button>
      </div>

      <div className="search-pills">
        {SEARCH_EXAMPLES.map((example) => (
          <button key={example} type="button" className="tag-chip search-example" onClick={() => handleSearch(example)}>
            {example}
          </button>
        ))}
      </div>

      {recentQueries.length > 0 ? (
        <div className="recent-searches">
          <span>Recent:</span>
          {recentQueries.map((item) => (
            <button key={item} type="button" className="recent-chip" onClick={() => handleSearch(item)}>
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? <div className="search-status">Loading campus data...</div> : null}
      {error ? <div className="search-status search-status-error">{error}</div> : null}

      {!isLoading && !error ? (
        <div className="search-results">
          {cards.map((card) => (
            <DeskCard key={card.key} card={card} />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && query.trim() === '' ? (
        <div className="search-hint">Tip: try one of the suggested searches above.</div>
      ) : null}
    </section>
  )
}

export default SearchView