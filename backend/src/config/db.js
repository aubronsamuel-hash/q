// Sequelize initialization
const { Sequelize } = require('sequelize');

// Use the DATABASE_URL from environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

module.exports = { sequelize };
