require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = Number(process.env.PORT || 4000);
const HOST = '0.0.0.0';

(async () => {
  try {
    console.log('[boot] NODE_ENV=%s PORT=%s', process.env.NODE_ENV || 'development', PORT);
    console.log('[boot] USE_SQLITE=%s DATABASE_URL=%s',
      process.env.USE_SQLITE || '0',
      (process.env.DATABASE_URL ? '(set)' : '(unset)')
    );

    if (process.env.USE_SQLITE === '1') {
      await sequelize.sync();
      console.log('[boot] sequelize.sync() done (sqlite)');
    } else {
      await sequelize.authenticate();
      console.log('[boot] sequelize.authenticate() ok');
    }

    app.listen(PORT, HOST, () => {
      console.log(`[boot] API listening on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('[boot] Startup failed:', err);
    process.exit(1);
  }
})();
