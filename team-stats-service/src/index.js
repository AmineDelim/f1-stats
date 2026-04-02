const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// DNS Kubernetes interne — nom du service Kubernetes
const DRIVER_SERVICE_URL = process.env.DRIVER_SERVICE_URL || 'http://driver-stats-service';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'team-stats-service' });
});

// GET /teams — appelle driver-stats-service en interne
app.get('/teams', async (req, res) => {
  try {
    // Appel inter-service via DNS Kubernetes
    const response = await axios.get(`${DRIVER_SERVICE_URL}/drivers`, {
      timeout: 5000
    });

    const drivers = response.data;

    // Grouper les pilotes par équipe
    const teamsMap = {};
    drivers.forEach(d => {
      if (!teamsMap[d.team_name]) {
        teamsMap[d.team_name] = {
          team_name: d.team_name,
          team_colour: d.team_colour || '888888',
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
    console.error('Error calling driver-stats-service:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams from driver service' });
  }
});

// GET /teams/:name
app.get('/teams/:name', async (req, res) => {
  try {
    const response = await axios.get(`${DRIVER_SERVICE_URL}/drivers`, {
      timeout: 5000
    });

    const drivers = response.data.filter(
      d => d.team_name === req.params.name
    );

    if (drivers.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      team_name: drivers[0].team_name,
      team_colour: drivers[0].team_colour || '888888',
      drivers: drivers.map(d => ({
        driver_number: d.driver_number,
        full_name: d.full_name,
        name_acronym: d.name_acronym
      }))
    });
  } catch (error) {
    console.error('Error calling driver-stats-service:', error.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.listen(PORT, () => {
  console.log(`team-stats-service running on port ${PORT}`);
  console.log(`Calling driver-stats-service at: ${DRIVER_SERVICE_URL}`);
});
