const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 在这里导入模型
// db.User = require('./user')(sequelize, Sequelize);
// db.Product = require('./product')(sequelize, Sequelize);
// 等等...

module.exports = db; 