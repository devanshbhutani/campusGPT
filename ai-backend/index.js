const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3005
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const MCP_URLS = {
  library: 'http://localhost:3001/api/mcp/library',
  library_search: 'http://localhost:3001/api/mcp/library/search',
  cafeteria: 'http://localhost:3002/api/mcp/cafeteria',
  cafeteria_day: 'http://localhost:3002/api/mcp/cafeteria',
  events: 'http://localhost:3003/api/mcp/events',
  events_category: 'http://localhost:3003/api/mcp/events/category',
  academics: 'http://localhost:3004/api/mcp/academics',
  academics_search: 'http://localhost:3004/api/mcp/academics/search',
}

const tools = [
  {
    name: 'library_search',
    description: 'Search for books in the campus library by title or author. Also checks book availability and copies.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'book title or author name to search',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'cafeteria_menu',
    description: 'Get the cafeteria menu for today or a specific day of the week.',
    input_schema: {
      type: 'object',
      properties: {
        day: {
          type: 'string',
          description: 'day of week e.g. Monday, Tuesday. Leave empty for today.',
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: 'events_search',
    description: 'Get upcoming campus events, workshops, fests, and club activities.',
    input_schema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'event category: fest, workshop, cultural, club, sports. Leave empty for all events.',
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: 'academics_search',
    description: 'Search class schedules, exam dates, faculty info, and room numbers.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'course name or subject to search',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
]

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'ai-backend' })
})

function getTextFromBlocks(blocks = []) {
  return blocks
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join(' ')
    .trim()
}

function todayDayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' })
}

function inferToolFromMessage(message = '') {
  const normalized = message.toLowerCase()

  if (normalized.includes('library') || normalized.includes('book') || normalized.includes('clean code')) {
    return { name: 'library_search', input: { query: message } }
  }

  if (normalized.includes('lunch') || normalized.includes('breakfast') || normalized.includes('dinner') || normalized.includes('cafeteria') || normalized.includes('food') || normalized.includes('meal')) {
    return { name: 'cafeteria_menu', input: { day: '' } }
  }

  if (normalized.includes('event') || normalized.includes('workshop') || normalized.includes('festival') || normalized.includes('fest') || normalized.includes('club')) {
    return { name: 'events_search', input: { category: '' } }
  }

  if (normalized.includes('class') || normalized.includes('schedule') || normalized.includes('exam') || normalized.includes('faculty') || normalized.includes('room') || normalized.includes('course')) {
    return { name: 'academics_search', input: { query: message } }
  }

  return { name: 'library_search', input: { query: message } }
}

function summarizeData(toolName, data) {
  switch (toolName) {
    case 'library_search': {
      const books = Array.isArray(data?.books) ? data.books : Array.isArray(data?.results) ? data.results : []
      if (!books.length) return 'I could not find any matching books in the library catalog.'

      const firstBook = books[0]
      const availability = firstBook.available ? `${firstBook.copies} copies available` : 'currently checked out'
      return `${firstBook.title} by ${firstBook.author} is ${availability}.`
    }
    case 'cafeteria_menu': {
      const day = data?.day || todayDayName()
      const menu = data?.menu || {}
      return `${day}'s cafeteria menu: breakfast is ${menu.breakfast}, lunch is ${menu.lunch}, and dinner is ${menu.dinner}.`
    }
    case 'events_search': {
      const events = Array.isArray(data?.events) ? data.events : Array.isArray(data?.results) ? data.results : []
      if (!events.length) return 'I could not find any matching campus events.'
      const firstEvent = events[0]
      return `${firstEvent.name} is scheduled for ${firstEvent.date} at ${firstEvent.time} in ${firstEvent.venue}.`
    }
    case 'academics_search': {
      const schedule = Array.isArray(data?.schedule) ? data.schedule : Array.isArray(data?.results) ? data.results : []
      if (!schedule.length) return 'I could not find any matching academic schedule entries.'
      const firstClass = schedule[0]
      return `${firstClass.course} meets in ${firstClass.room} with ${firstClass.faculty} on ${firstClass.days} at ${firstClass.time}.`
    }
    default:
      return 'I could not process that request.'
  }
}

async function fetchJson(url) {
  const response = await fetch(url)
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error || `Request failed for ${url}`
    throw new Error(message)
  }

  return payload
}

async function runTool(toolName, input = {}) {
  switch (toolName) {
    case 'library_search': {
      const query = input.query?.trim() || ''
      const url = query ? `${MCP_URLS.library_search}?q=${encodeURIComponent(query)}` : MCP_URLS.library
      const data = await fetchJson(url)
      return {
        source: 'library',
        tool: 'library_search',
        data,
        answer: summarizeData(toolName, data),
      }
    }
    case 'cafeteria_menu': {
      const day = input.day?.trim() || ''
      const url = day ? `${MCP_URLS.cafeteria_day}/${encodeURIComponent(day)}` : MCP_URLS.cafeteria
      const data = await fetchJson(url)
      return {
        source: 'cafeteria',
        tool: 'cafeteria_menu',
        data,
        answer: summarizeData(toolName, data),
      }
    }
    case 'events_search': {
      const category = input.category?.trim() || ''
      const url = category ? `${MCP_URLS.events_category}/${encodeURIComponent(category)}` : MCP_URLS.events
      const data = await fetchJson(url)
      return {
        source: 'events',
        tool: 'events_search',
        data,
        answer: summarizeData(toolName, data),
      }
    }
    case 'academics_search': {
      const query = input.query?.trim() || ''
      const url = query ? `${MCP_URLS.academics_search}?q=${encodeURIComponent(query)}` : MCP_URLS.academics
      const data = await fetchJson(url)
      return {
        source: 'academics',
        tool: 'academics_search',
        data,
        answer: summarizeData(toolName, data),
      }
    }
    default:
      throw new Error(`Unsupported tool: ${toolName}`)
  }
}

async function callClaudeWithTools(message) {
  const requestBody = {
    model: ANTHROPIC_MODEL,
    max_tokens: 512,
    tools,
    messages: [{ role: 'user', content: message }],
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMessage = payload?.error?.message || payload?.message || 'Anthropic request failed.'
    throw new Error(errorMessage)
  }

  const toolUses = Array.isArray(payload.content)
    ? payload.content.filter((block) => block.type === 'tool_use')
    : []

  if (!toolUses.length) {
    const fallbackTool = inferToolFromMessage(message)
    const fallbackResult = await runTool(fallbackTool.name, fallbackTool.input)

    return {
      answer: getTextFromBlocks(payload.content || []),
      source: fallbackResult.source,
      tool: fallbackResult.tool,
      data: fallbackResult.data,
    }
  }

  const resolvedTools = []
  const toolResults = []

  for (const toolUse of toolUses) {
    const toolResult = await runTool(toolUse.name, toolUse.input || {})
    resolvedTools.push(toolResult)
    toolResults.push({
      type: 'tool_result',
      tool_use_id: toolUse.id,
      content: [{ type: 'text', text: JSON.stringify(toolResult.data) }],
    })
  }

  const finalResponse = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 512,
      tools,
      messages: [
        { role: 'user', content: message },
        { role: 'assistant', content: payload.content },
        { role: 'user', content: toolResults },
      ],
    }),
  })

  const finalPayload = await finalResponse.json().catch(() => null)

  if (!finalResponse.ok) {
    const errorMessage = finalPayload?.error?.message || finalPayload?.message || 'Anthropic follow-up request failed.'
    throw new Error(errorMessage)
  }

  const primaryResult = resolvedTools[0]

  return {
    answer: getTextFromBlocks(finalPayload.content || []) || primaryResult.answer,
    source: primaryResult.source,
    tool: primaryResult.tool,
    data: primaryResult.data,
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const message = req.body?.message?.trim()

    if (!message) {
      return res.status(400).json({ error: 'message is required' })
    }

    if (!ANTHROPIC_API_KEY) {
      const fallbackTool = inferToolFromMessage(message)
      const fallbackResult = await runTool(fallbackTool.name, fallbackTool.input)

      return res.json({
        answer: fallbackResult.answer,
        source: fallbackResult.source,
        tool: fallbackResult.tool,
        data: fallbackResult.data,
      })
    }

    const result = await callClaudeWithTools(message)
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected server error' })
  }
})

app.listen(PORT, () => {
  console.log(`🤖 AI backend running on port ${PORT}`)
})