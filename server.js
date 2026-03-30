const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// endpoint test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BotKJS running' });
});

// dummy endpoint sesuai UI
app.post('/api/start', (req, res) => {
  res.json({ status: 'started' });
});

app.post('/api/stop', (req, res) => {
  res.json({ status: 'stopped' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'idle' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
