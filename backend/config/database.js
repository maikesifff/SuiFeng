require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config.json');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: (sql, timing) => {
    logger.database('SQL Query', 'Database', {
      sql: sql,
      timing: timing ? `${timing}ms` : undefined
    });
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = {
  sequelize,
  Sequelize
}; 