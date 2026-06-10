const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const schedule = [
  { course: "CS301 Operating Systems", faculty: "Dr. Mehta", room: "B-204", days: "Mon/Wed/Fri", time: "09:00" },
  { course: "MA204 Linear Algebra", faculty: "Dr. Sharma", room: "A-101", days: "Tue/Thu", time: "11:00" },
  { course: "CS342 Databases Lab", faculty: "Prof. Rao", room: "Lab-2", days: "Wed", time: "14:00" },
  { course: "EC201 Electronics", faculty: "Dr. Verma", room: "C-305", days: "Mon/Thu", time: "10:00" },
];

const exams = [
  { course: "CS301 Operating Systems", date: "2026-07-02", time: "10:00", room: "Exam Hall A" },
  { course: "MA204 Linear Algebra", date: "2026-07-04", time: "10:00", room: "Exam Hall B" },
  { course: "CS342 Databases Lab", date: "2026-07-06", time: "14:00", room: "Lab-2" },
];

const holidays = [
  { name: "Eid al-Adha", date: "2026-06-17" },
  { name: "End Semester Break", date: "2026-07-10" },
];

// Get full schedule
app.get('/api/mcp/academics', (req, res) => {
  res.json({ source: "academics", schedule, exams, holidays });
});

// Search by course name
app.get('/api/mcp/academics/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = schedule.filter(s => s.course.toLowerCase().includes(query));
  res.json({ source: "academics", query, results });
});

app.listen(3004, () => console.log('🎓 Academics MCP running on port 3004'));