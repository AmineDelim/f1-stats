const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// Connexion PostgreSQL via DNS Kubernetes
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  port: 5432,
  database: process.env.DB_NAME || 'f1db',
  user: process.env.DB_USER || 'f1user',
  password: process.env.DB_PASSWORD || 'f1password',
});

// Créer la table au démarrage
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        driver_number INTEGER NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        team_name VARCHAR(100),
        name_acronym VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('DB init error:', err.message);
    setTimeout(initDB, 3000);
  }
}

initDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'favorites-service' });
});

// GET /favorites — liste des favoris
app.get('/favorites', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /favorites — ajouter un favori
app.post('/favorites', async (req, res) => {
  const { driver_number, full_name, team_name, name_acronym } = req.body;
  try {
    // Vérifier si déjà en favori
    const exists = await pool.query(
      'SELECT id FROM favorites WHERE driver_number = $1',
      [driver_number]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Driver already in favorites' });
    }
    const result = await pool.query(
      'INSERT INTO favorites (driver_number, full_name, team_name, name_acronym) VALUES ($1, $2, $3, $4) RETURNING *',
      [driver_number, full_name, team_name, name_acronym]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /favorites/:id — supprimer un favori
app.delete('/favorites/:driver_number', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE driver_number = $1',
      [req.params.driver_number]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`favorites-service running on port ${PORT}`);
});
