const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Health with quick DB ping (no crash if DB down)
app.get('/health', async (req, res) => {
  try {
    const t0 = Date.now();
    await sequelize.query('SELECT 1');
    return res.json({ status: 'ok', db: 'up', ms: Date.now() - t0 });
  } catch {
    return res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

module.exports = app;
