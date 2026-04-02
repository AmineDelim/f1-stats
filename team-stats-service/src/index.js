const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const OPENF1_BASE = 'https://api.openf1.org/v1';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'team-stats-service' });
});

// GET /teams — équipes depuis les pilotes de la dernière session
app.get('/teams', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/drivers`, {
      params: { session_key: 'latest' },
      timeout: 5000
    });

    // Dédupliquer par équipe
    const teamsMap = {};
    response.data.forEach(d => {
      if (!teamsMap[d.team_name]) {
        teamsMap[d.team_name] = {
          team_name: d.team_name,
          team_colour: d.team_colour,
          drivers: []
        };
      }
      teamsMap[d.team_name].drivers.push({
        driver_number: d.driver_number,
        full_name: d.full_name,
        name_acronym: d.name_acronym
      });
    });

    res.json(Object.values(teamsMap));
  } catch (error) {
    console.error('OpenF1 unavailable:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET /teams/:name — une équipe spécifique
app.get('/teams/:name', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_BASE}/drivers`, {
      params: { session_key: 'latest', team_name: req.params.name },
      timeout: 5000
    });
    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({
      team_name: response.data[0].team_name,
      team_colour: response.data[0].team_colour,
      drivers: response.data.map(d => ({
        driver_number: d.driver_number,
        full_name: d.full_name,
        name_acronym: d.name_acronym
      }))
    });
  } catch (error) {
    console.error('OpenF1 unavailable:', error.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.listen(PORT, () => {
  console.log(`team-stats-service running on port ${PORT}`);
});
