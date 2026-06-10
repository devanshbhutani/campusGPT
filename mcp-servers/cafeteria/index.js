const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const menu = {
  Monday:    { breakfast: "Poha, Chai", lunch: "Dal Tadka, Roti, Rice, Curd", dinner: "Paneer Butter Masala, Naan" },
  Tuesday:   { breakfast: "Idli, Sambar", lunch: "Rajma, Rice, Salad", dinner: "Aloo Gobi, Roti" },
  Wednesday: { breakfast: "Paratha, Pickle", lunch: "Chole, Bhature, Raita", dinner: "Dal Makhani, Rice" },
  Thursday:  { breakfast: "Upma, Juice", lunch: "Mix Veg, Roti, Rice", dinner: "Shahi Paneer, Naan" },
  Friday:    { breakfast: "Bread Butter, Eggs", lunch: "Kadhi Pakora, Rice", dinner: "Palak Paneer, Roti" },
  Saturday:  { breakfast: "Puri, Sabzi", lunch: "Special Biryani, Raita", dinner: "Pasta, Garlic Bread" },
  Sunday:    { breakfast: "Chole Bhature", lunch: "Dal Makhani, Jeera Rice", dinner: "Paneer Tikka, Naan" },
};

// Get today's menu
app.get('/api/mcp/cafeteria', (req, res) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  res.json({ source: "cafeteria", day: today, menu: menu[today] });
});

// Get menu for a specific day
app.get('/api/mcp/cafeteria/:day', (req, res) => {
  const day = req.params.day;
  const dayMenu = menu[day];
  if (!dayMenu) return res.status(404).json({ error: "Day not found" });
  res.json({ source: "cafeteria", day, menu: dayMenu });
});

app.listen(3002, () => console.log('🍽️ Cafeteria MCP running on port 3002'));