require('dotenv').config();
// Entry point for starting the HTTP server
const fs = require('fs');
const path = require('path');

// Ensure SQLite data folder exists when using SQLite
if (process.env.USE_SQLITE === '1') {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const app = require('./app');
const models = require('./models');
const { initModels } = models;
const waitForDb = require('./utils/waitForDb');

// Use PORT from environment or fall back to 4000
const PORT = process.env.PORT || 4000;

// Log essential environment information for troubleshooting
function logStartupInfo() {
  if (process.env.USE_SQLITE === '1') {
    console.log('DATABASE: sqlite ./data/dev.sqlite');
  } else if (process.env.DATABASE_URL) {
    try {
      const u = new URL(process.env.DATABASE_URL);
      console.log(`DATABASE_URL: ${u.hostname}:${u.port}${u.pathname}`);
    } catch (_err) {
      console.log('DATABASE_URL: invalid');
    }
  } else {
    console.log('DATABASE_URL: not set');
  }
  console.log(`PORT: ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
}

async function start() {
  try {
    logStartupInfo();

    // Initialize model associations
    initModels();

    await waitForDb();

    // await models.sequelize.sync(); // Uncomment if you are not using migrations

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

start();
