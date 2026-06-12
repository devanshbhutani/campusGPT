const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3003;
app.use(cors());
app.use(express.json());

const events = [
  { id: 1, name: "TechFest 2026 — Opening Ceremony", date: "2026-06-12", time: "10:00", venue: "Main Auditorium", category: "fest" },
  { id: 2, name: "AI Workshop: Build with LLMs", date: "2026-06-12", time: "14:00", venue: "CS Lab 3", category: "workshop" },
  { id: 3, name: "Open Mic Night", date: "2026-06-13", time: "19:30", venue: "Amphitheatre", category: "cultural" },
  { id: 4, name: "Hackathon Kickoff", date: "2026-06-14", time: "09:00", venue: "Innovation Hub", category: "fest" },
  { id: 5, name: "Photography Club Exhibition", date: "2026-06-15", time: "11:00", venue: "Gallery Hall", category: "club" },
  { id: 6, name: "End Semester Sports Meet", date: "2026-06-20", time: "08:00", venue: "Sports Ground", category: "sports" },
];

app.get('/health', (req, res) => {
  res.json({ ok: true, source: 'events' });
});

// Get all events
app.get('/api/mcp/events', (req, res) => {
  res.json({ source: "events", events });
});

// Get events by category
app.get('/api/mcp/events/category/:cat', (req, res) => {
  const category = req.params.cat.toLowerCase();
  const results = events.filter(e => e.category === category);
  res.json({ source: "events", category, results });
});

app.listen(PORT, () => console.log(`📅 Events MCP running on port ${PORT}`));