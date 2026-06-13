export const CHAT_API_URL = 'http://localhost:3005/api/chat'

export const ANNOUNCEMENTS = [
  { id: 1, text: 'Power maintenance in Block B on June 16', priority: 'high' },
  { id: 2, text: 'Library extended hours till June 25', priority: 'low' },
  { id: 3, text: 'Lost: Black Kindle near Café-2', priority: 'medium' },
  { id: 4, text: 'Convocation rehearsal at North Gate → Metro Station next 06:15', priority: 'low' },
]

export const SEARCH_EXAMPLES = [
  'What is in the library?',
  'My club events this week',
  'Which courses match my branch?',
  'What is for lunch today?',
]

const BRANCH_PREFIXES = [
  ['computer', 'CS'],
  ['cs', 'CS'],
  ['electrical', 'EC'],
  ['electronics', 'EC'],
  ['mechanical', 'ME'],
  ['civil', 'CE'],
  ['chemical', 'CH'],
  ['mathematics', 'MA'],
  ['math', 'MA'],
  ['physics', 'PH'],
]

function normalize(value = '') {
  return String(value).toLowerCase().trim()
}

function findBranchPrefix(branch = '') {
  const branchName = normalize(branch)
  const match = BRANCH_PREFIXES.find(([needle]) => branchName.includes(needle))
  return match ? match[1] : ''
}

export const DASHBOARD_PANELS = [
  {
    key: 'library',
    title: 'Stacks Desk',
    endpoint: 'http://localhost:3001/api/mcp/library',
    footer: 'By the Library MCP',
    loadingSubtitle: 'Loading library records...',
    emptyText: 'No books matched the current selection.',
    buildCard(payload = {}) {
      const books = Array.isArray(payload.books) ? payload.books : []

      return {
        title: 'Stacks Desk',
        subtitle: `${books.length} titles in the catalog`,
        items: books.map((book) => ({
          title: book.title,
          details: book.author,
          status: book.available ? `${book.copies} copies` : 'Checked out',
        })),
        footer: 'By the Library MCP',
        emptyText: 'No books matched the current selection.',
      }
    },
  },
  {
    key: 'cafeteria',
    title: 'Cafeteria Desk',
    endpoint: 'http://localhost:3002/api/mcp/cafeteria',
    footer: 'By the Cafeteria MCP',
    loadingSubtitle: 'Loading daily menu...',
    emptyText: 'No menu is available right now.',
    buildCard(payload = {}) {
      const menu = payload.menu ?? {}
      const orderedMeals = ['breakfast', 'lunch', 'dinner']

      return {
        title: 'Cafeteria Desk',
        subtitle: `${payload.day || 'Today'} · Weekly menu`,
        items: orderedMeals
          .filter((meal) => menu[meal])
          .map((meal) => ({
            title: meal.charAt(0).toUpperCase() + meal.slice(1),
            details: menu[meal],
            status: payload.day || 'Live',
          })),
        footer: 'By the Cafeteria MCP',
        emptyText: 'No menu is available right now.',
      }
    },
  },
  {
    key: 'events',
    title: 'Calendar Desk',
    endpoint: 'http://localhost:3003/api/mcp/events',
    footer: 'By the Events MCP',
    loadingSubtitle: 'Loading campus events...',
    emptyText: 'No events were returned.',
    buildCard(payload = {}, profile = {}) {
      const events = Array.isArray(payload.events) ? payload.events : []
      const clubs = Array.isArray(profile.clubs) ? profile.clubs : []
      const filteredEvents = clubs.length
        ? events.filter((event) => {
            const haystack = normalize(`${event.name} ${event.category} ${event.venue}`)
            return clubs.some((club) => haystack.includes(normalize(club))) || event.category === 'club'
          })
        : events

      const visibleEvents = filteredEvents.length > 0 ? filteredEvents : events

      return {
        title: 'Calendar Desk',
        subtitle: clubs.length ? `${visibleEvents.length} club-linked events` : `${events.length} upcoming events`,
        items: visibleEvents.map((event) => ({
          title: event.name,
          details: `${event.date} · ${event.time} · ${event.venue}`,
          status: event.category.toUpperCase(),
        })),
        footer: 'By the Events MCP',
        emptyText: 'No events were returned.',
      }
    },
  },
  {
    key: 'academics',
    title: 'Registrar',
    endpoint: 'http://localhost:3004/api/mcp/academics',
    footer: 'By the Academics MCP',
    loadingSubtitle: 'Loading class schedule...',
    emptyText: 'No classes were returned.',
    buildCard(payload = {}, profile = {}) {
      const schedule = Array.isArray(payload.schedule) ? payload.schedule : []
      const prefix = findBranchPrefix(profile.branch)
      const filteredSchedule = prefix
        ? schedule.filter((entry) => normalize(entry.course).startsWith(normalize(prefix)))
        : schedule

      const visibleSchedule = filteredSchedule.length > 0 ? filteredSchedule : schedule

      return {
        title: 'Registrar',
        subtitle: prefix ? `${visibleSchedule.length} classes for ${profile.branch}` : `${schedule.length} classes on file`,
        items: visibleSchedule.map((entry) => ({
          title: entry.course,
          details: `${entry.faculty} · ${entry.room} · ${entry.days}`,
          status: entry.time,
        })),
        footer: 'By the Academics MCP',
        emptyText: 'No classes were returned.',
      }
    },
  },
]

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'chat-welcome',
    role: 'assistant',
    text: 'Ask me about books, meals, events, or class schedules. I will route your request to the right MCP server.',
    detail: 'routing_ready',
  },
]

export function createInitialDashboardCards() {
  return DASHBOARD_PANELS.map((panel) => ({
    key: panel.key,
    title: panel.title,
    subtitle: panel.loadingSubtitle,
    items: [],
    footer: panel.footer,
    loading: true,
    error: '',
    emptyText: panel.emptyText,
  }))
}

export function buildAnnouncementTicker() {
  return ANNOUNCEMENTS.map((item) => `${item.priority.toUpperCase()} - ${item.text}`).join(' · ')
}

export function createDefaultProfile() {
  return {
    email: '',
    username: '',
    branch: '',
    year: '',
    semester: '',
    clubs: [],
    favDishes: [],
    isOnboarded: false,
  }
}

export function normalizeProfile(profile = {}) {
  return {
    ...createDefaultProfile(),
    ...profile,
    email: profile.email || '',
    username: profile.username || '',
    branch: profile.branch || '',
    year: profile.year || '',
    semester: profile.semester || '',
    clubs: Array.isArray(profile.clubs) ? profile.clubs : [],
    favDishes: Array.isArray(profile.favDishes) ? profile.favDishes : [],
    isOnboarded: Boolean(profile.isOnboarded),
  }
}

export function loadProfileFromStorage() {
  if (typeof window === 'undefined') {
    return createDefaultProfile()
  }

  try {
    const raw = window.localStorage.getItem('campus-dashboard.profile')
    if (!raw) return createDefaultProfile()

    return normalizeProfile(JSON.parse(raw))
  } catch {
    return createDefaultProfile()
  }
}

export function saveProfileToStorage(profile) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem('campus-dashboard.profile', JSON.stringify(normalizeProfile(profile)))
}

export function clearProfileStorage() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem('campus-dashboard.profile')
}

export function loadViewFromStorage() {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const savedView = window.localStorage.getItem('campus-dashboard.view')
  return savedView === 'search' || savedView === 'dashboard' ? savedView : 'dashboard'
}

export function saveViewToStorage(view) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem('campus-dashboard.view', view)
}

export const BRANCH_OPTIONS = [
  'Computer Science and Engineering',
  'Electrical Engineering',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Mathematics and Computing',
  'Physics',
]

export const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export const CLUB_OPTIONS = [
  'Coding Club',
  'Robotics Club',
  'Photography Club',
  'Music Club',
  'Drama Society',
  'Sports Club',
  'AI Club',
  'Finance Club',
]

export const DISH_OPTIONS = [
  'Poha',
  'Chai',
  'Dal Tadka',
  'Roti',
  'Rice',
  'Curd',
  'Paneer Butter Masala',
  'Naan',
  'Idli',
  'Sambar',
  'Rajma',
  'Salad',
  'Aloo Gobi',
  'Paratha',
  'Pickle',
  'Chole',
  'Bhature',
  'Raita',
  'Dal Makhani',
  'Upma',
  'Juice',
  'Mix Veg',
  'Shahi Paneer',
  'Bread Butter',
  'Eggs',
  'Kadhi Pakora',
  'Palak Paneer',
  'Puri',
  'Sabzi',
  'Special Biryani',
  'Pasta',
  'Garlic Bread',
  'Paneer Tikka',
]