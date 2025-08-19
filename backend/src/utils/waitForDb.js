// Retry Sequelize authentication until the database is ready
const { sequelize } = require('../config/db');

/**
 * Attempt to connect to the database with exponential backoff.
 * @returns {Promise<void>} resolves when authentication succeeds
 */
async function waitForDb() {
  const maxAttempts = 10;
  let delay = 500; // start at 500ms
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Sequelize authenticated');
      return;
    } catch (err) {
      console.log(`DB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 8000); // exponential backoff up to 8s
    }
  }
}

module.exports = waitForDb;
