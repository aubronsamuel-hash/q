// Entry point to start the HTTP server
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');
const { initModels, syncDb } = require('./models');

// Use PORT from environment or fall back to 4000
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    initModels();
    await syncDb();
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

start();
