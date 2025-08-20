const { Sequelize } = require('sequelize');
const path = require('path');
const useSqlite = process.env.USE_SQLITE === '1';

let sequelize;
if (useSqlite) {
  const file = path.resolve(process.cwd(), 'data', 'dev.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage: file, logging: false });
  console.log('[db] sqlite file:', file);
} else {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set (and USE_SQLITE!=1)');
  sequelize = new Sequelize(url, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: { ssl: false },
    pool: { acquire: 20000, idle: 10000 }
  });
  console.log('[db] postgres via DATABASE_URL');
}

module.exports = { sequelize };
