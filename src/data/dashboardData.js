export const MCP_CARDS = [
  {
    title: 'Stacks Desk',
    subtitle: '6 titles back on the shelves',
    items: [
      { title: 'Introduction to Algorithms', details: 'Cormen, Leiserson, Rivest, Stein', status: '2/4' },
      { title: 'The Pragmatic Programmer', details: 'Hunt & Thomas', status: '1/2' },
      { title: 'Deep Learning', details: 'Goodfellow, Bengio, Courville', status: '2/2' },
      { title: 'Sapiens', details: 'Yuval Noah Harari', status: '3/5' },
    ],
    footer: 'By the Library MCP',
  },
  {
    title: 'Calendar Desk',
    subtitle: '6 happenings on the bill',
    items: [
      { title: 'TechFest 2026 — Opening Ceremony', details: '2026-06-12 · 10:00 · Main Auditorium' },
      { title: 'AI Workshop: Build with LLMs', details: '2026-06-12 · 14:00 · CS Lab 3' },
      { title: 'Open Mic Night', details: '2026-06-13 · 19:30 · Amphitheatre' },
    ],
    footer: 'By the Events MCP',
  },
  {
    title: 'Registrar',
    subtitle: "3 classes on Monday's docket",
    items: [
      { title: 'CS301 Operating Systems', details: 'B-204', status: '09:00' },
      { title: 'MA204 Linear Algebra', details: 'A-101', status: '11:00' },
      { title: 'CS342 Databases Lab', details: 'Lab-2', status: '14:00' },
    ],
    footer: 'By the Academics MCP',
  },
  {
    title: 'Bulletin',
    subtitle: '4 bulletins on the wire',
    items: [
      { label: 'HIGH', title: 'Power maintenance in Block B', details: 'Power will be down in Block B from 14:00 to 16:30 on June 10.' },
      { label: 'MEDIUM', title: 'Library extended hours', details: 'From June 10–25 the central library stays open later each night.' },
      { label: 'LOW', title: 'Lost: Black Kindle near Café-2', details: 'If found please drop at the Student Affairs desk.' },
    ],
    footer: 'By the Announcements MCP',
  },
]

export const MCP_ENDPOINTS = [
  '/api/mcp/library',
  '/api/mcp/events',
  '/api/mcp/transport',
  '/api/mcp/cafeteria',
  '/api/mcp/academics',
  '/api/mcp/announcements',
]

export const TOOL_ROUTES = [
  { id: 'library_search', label: 'Library Search', keywords: ['library', 'book', 'clean code', 'catalog', 'shelves'] },
  { id: 'events', label: 'Events Desk', keywords: ['techfest', 'workshop', 'open mic', 'event', 'happening', 'calendar'] },
  { id: 'transport', label: 'Transit Desk', keywords: ['shuttle', 'metro', 'transport', 'route', 'bus', 'station'] },
  { id: 'academics', label: 'Registrar', keywords: ['class', 'course', 'exam', 'schedule', 'docket'] },
]

export const INITIAL_MESSAGES = [
  {
    role: 'user',
    text: "Is 'Clean Code' available in the library right now?",
    detail: 'Dispatch',
  },
  {
    role: 'assistant',
    text: 'I encountered a technical issue while searching the library database. Please try again in a moment, or visit the library circulation desk to check the status of "Clean Code".',
    detail: 'library_search',
  },
]