// Sequelize initialization
const { Sequelize } = require('sequelize');

// Use the DATABASE_URL from environment variables
// Global model settings: timestamps enabled, no underscored field names
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: false,
    timestamps: true,
  },
});

module.exports = { sequelize };
