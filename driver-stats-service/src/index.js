const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const OPENF1_BASE = 'https://api.openf1.org/v1';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'driver-stats-service' });
});

// GET /drivers — liste des pilotes de la dernière session
app.get('/drivers', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/drivers`, {
      params: { session_key: 'latest' }
    });

    const drivers = response.data.map(d => ({
      driver_number: d.driver_number,
      full_name: d.full_name,
      name_acronym: d.name_acronym,
      team_name: d.team_name,
      country_code: d.country_code,
      headshot_url: d.headshot_url
    }));

    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// GET /drivers/:number — un pilote spécifique
app.get('/drivers/:number', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/drivers`, {
      params: {
        session_key: 'latest',
        driver_number: req.params.number
      }
    });

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const d = response.data[0];
    res.json({
      driver_number: d.driver_number,
      full_name: d.full_name,
      name_acronym: d.name_acronym,
      team_name: d.team_name,
      country_code: d.country_code,
      headshot_url: d.headshot_url
    });
  } catch (error) {
    console.error('Error fetching driver:', error.message);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

app.listen(PORT, () => {
  console.log(`driver-stats-service running on port ${PORT}`);
});
