#!/usr/bin/env node
// Promote a user to admin role using their email.
// Usage: npm run promote:admin -- user@example.com
require('dotenv').config();
const { sequelize, User, initModels } = require('../src/models');

(async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Please provide an email.');
      console.error('Usage: npm run promote:admin -- user@example.com');
      process.exit(1);
    }

    // Initialize model associations
    initModels();
    await sequelize.authenticate();

    const [updated] = await User.update({ role: 'admin' }, { where: { email } });
    if (updated === 0) {
      console.log(`No user found with email ${email}`);
    } else {
      console.log(`User ${email} promoted to admin.`);
    }
  } catch (err) {
    console.error('Promotion failed:', err);
  } finally {
    await sequelize.close();
  }
})();
