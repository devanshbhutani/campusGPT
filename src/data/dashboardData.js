export const CHAT_API_URL = 'http://localhost:3005/api/chat'

export const ANNOUNCEMENTS = [
  { id: 1, text: 'Power maintenance in Block B on June 16', priority: 'high' },
  { id: 2, text: 'Library extended hours till June 25', priority: 'low' },
  { id: 3, text: 'Lost: Black Kindle near Café-2', priority: 'medium' },
  { id: 4, text: 'Convocation rehearsal at North Gate → Metro Station next 06:15', priority: 'low' },
]

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
    buildCard(payload = {}) {
      const events = Array.isArray(payload.events) ? payload.events : []

      return {
        title: 'Calendar Desk',
        subtitle: `${events.length} upcoming events`,
        items: events.map((event) => ({
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
    buildCard(payload = {}) {
      const schedule = Array.isArray(payload.schedule) ? payload.schedule : []

      return {
        title: 'Registrar',
        subtitle: `${schedule.length} classes on file`,
        items: schedule.map((entry) => ({
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