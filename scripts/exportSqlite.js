#!/usr/bin/env node
// Export data from SQLite database to JSON file
const fs = require('fs');
const path = require('path');

process.env.USE_SQLITE = '1';

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
    const tables = {
      Users: User,
      Projects: Project,
      Milestones: Milestone,
      Tasks: Task,
      TimeLogs: TimeLog,
    };
    if (ProjectMember) tables.ProjectMembers = ProjectMember;

    const data = {};
    for (const [name, model] of Object.entries(tables)) {
      data[name] = await model.findAll({ raw: true });
    }

    const outDir = path.join(__dirname, '..', 'data');
    await fs.promises.mkdir(outDir, { recursive: true });
    const file = path.join(
      outDir,
      `export-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`
    );
    await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
    console.log(`Exported to ${file}`);
    await sequelize.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
