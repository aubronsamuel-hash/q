// Helper to define enums across dialects
const { DataTypes } = require('sequelize');

/**
 * Create a dialect-agnostic enum.
 * @param {string} dialect Sequelize dialect name
 * @param {string[]} values allowed values
 * @returns {object} field definition
 */
function defineEnum(dialect, values) {
  if (dialect === 'sqlite') {
    return { type: DataTypes.STRING, validate: { isIn: [values] } };
  }
  return { type: DataTypes.ENUM(...values) };
}

module.exports = defineEnum;
