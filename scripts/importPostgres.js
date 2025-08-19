#!/usr/bin/env node
// Import JSON data into Postgres database
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node scripts/importPostgres.js <path-to-export.json>');
  process.exit(1);
}

const modelsPath = path.join(__dirname, '..', 'backend', 'src', 'models');
const { sequelize, User, Project, Milestone, Task, TimeLog } = require(modelsPath);
let ProjectMember;
try {
  ProjectMember = require(path.join(modelsPath, 'ProjectMember'))(sequelize);
} catch (err) {
  console.warn('ProjectMember model not found, skipping');
}

(async () => {
  try {
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const order = ['Users', 'Projects', 'Milestones', 'Tasks', 'TimeLogs', 'ProjectMembers'];
    const models = {
      Users: User,
      Projects: Project,
      Milestones: Milestone,
      Tasks: Task,
      TimeLogs: TimeLog,
      ProjectMembers: ProjectMember,
    };

    for (const name of order) {
      const model = models[name];
      if (!model || !data[name]) continue;
      await model.bulkCreate(data[name], { ignoreDuplicates: true });
      console.log(`${name}: inserted ${data[name].length}`);
    }

    await sequelize.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
