// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('authapp', 'authuser', 'tu_contraseña_segura', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
