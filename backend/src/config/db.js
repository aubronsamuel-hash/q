const { Sequelize } = require('sequelize');
const path = require('path');

// Determine whether to use SQLite or Postgres
const useSqlite = process.env.USE_SQLITE === '1';
let sequelize;
let targetInfo = '';

if (useSqlite) {
  const storage = path.join(__dirname, '..', '..', 'data', 'dev.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: (msg) => console.log(msg),
    pool: { acquire: 20000, idle: 10000 },
  });
  targetInfo = `sqlite ${storage}`;
} else {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const useSsl = process.env.PGSSL === 'true';
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: (msg) => console.log(msg),
    dialectOptions: {
      ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
    },
    pool: { acquire: 20000, idle: 10000 },
  });
  try {
    const u = new URL(dbUrl);
    targetInfo = `${u.hostname}:${u.port}${u.pathname} (ssl=${useSsl})`;
  } catch (_err) {
    targetInfo = 'invalid';
  }
}

console.log(`DB target: ${targetInfo}`);
console.log(`Pool: acquire=${sequelize.options.pool.acquire} idle=${sequelize.options.pool.idle}`);

const dialectName = sequelize.getDialect();

module.exports = { sequelize, dialectName };
