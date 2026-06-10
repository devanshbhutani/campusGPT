const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", available: true, copies: 3 },
  { id: 2, title: "Introduction to Algorithms", author: "Cormen et al.", available: true, copies: 2 },
  { id: 3, title: "The Pragmatic Programmer", author: "Hunt & Thomas", available: false, copies: 0 },
  { id: 4, title: "Deep Learning", author: "Goodfellow et al.", available: true, copies: 1 },
  { id: 5, title: "Sapiens", author: "Yuval Noah Harari", available: true, copies: 5 },
  { id: 6, title: "CS342 Databases Textbook", author: "Ramakrishnan", available: false, copies: 0 },
];

// Get all books
app.get('/api/mcp/library', (req, res) => {
  res.json({ source: "library", books });
});

// Search books by title or author
app.get('/api/mcp/library/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query)
  );
  res.json({ source: "library", query, results });
});

app.listen(3001, () => console.log('📚 Library MCP running on port 3001'));