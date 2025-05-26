// db.js
/*const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('authapp', 'authuser', 'tu_contraseña_segura', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;*/

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;

