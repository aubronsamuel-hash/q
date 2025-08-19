const { Model, DataTypes } = require('sequelize');

/**
 * Milestone model represents checkpoints inside a project.
 */
module.exports = (sequelize) => {
  class Milestone extends Model {}

  Milestone.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Milestone',
      tableName: 'milestones',
    }
  );

  return Milestone;
};
