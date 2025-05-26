// sync.js
const sequelize = require('./db');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente con PostgreSQL.');

    await sequelize.sync({ alter: true }); // o { force: true } para recrear tablas
    console.log('✅ Tablas sincronizadas correctamente.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
})();
