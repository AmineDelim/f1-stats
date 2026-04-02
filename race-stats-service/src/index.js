const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const OPENF1_BASE = 'https://api.openf1.org/v1';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'race-stats-service' });
});

// GET /races — sessions de la saison 2024
app.get('/races', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/sessions`, {
      params: { year: 2024, session_type: 'Race' },
      timeout: 5000
    });
    const races = response.data.map(r => ({
      session_key: r.session_key,
      session_name: r.session_name,
      date_start: r.date_start,
      circuit_short_name: r.circuit_short_name,
      country_name: r.country_name,
      year: r.year
    }));
    res.json(races);
  } catch (error) {
    console.error('OpenF1 unavailable:', error.message);
    res.status(500).json({ error: 'Failed to fetch races' });
  }
});

// GET /races/:session_key — une course spécifique
app.get('/races/:session_key', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/sessions`, {
      params: { session_key: req.params.session_key },
      timeout: 5000
    });
    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Race not found' });
    }
    const r = response.data[0];
    res.json({
      session_key: r.session_key,
      session_name: r.session_name,
      date_start: r.date_start,
      circuit_short_name: r.circuit_short_name,
      country_name: r.country_name,
      year: r.year
    });
  } catch (error) {
    console.error('OpenF1 unavailable:', error.message);
    res.status(500).json({ error: 'Failed to fetch race' });
  }
});

app.listen(PORT, () => {
  console.log(`race-stats-service running on port ${PORT}`);
});
