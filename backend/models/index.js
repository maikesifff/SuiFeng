const { Sequelize, DataTypes } = require('sequelize');
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

db.Department = require('./department')(sequelize, DataTypes);
db.Employee = require('./employee')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Warehouse = require('./warehouse')(sequelize, DataTypes);
db.Supplier = require('./supplier')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.Inventory = require('./inventory')(sequelize, DataTypes);
db.Shipper = require('./shipper')(sequelize, DataTypes);
db.Vehicle = require('./vehicle')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.Delivery = require('./delivery')(sequelize, DataTypes);
db.Permission = require('./permission')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.EmployeeRole = require('./employee_role')(sequelize, DataTypes);
db.RolePermission = require('./role_permission')(sequelize, DataTypes);

// 初始化模型关联
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db; 