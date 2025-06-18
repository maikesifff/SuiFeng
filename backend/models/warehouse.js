module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define('Warehouse', {
    warehouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    warehouse_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    warehouse_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    manager_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    capacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '仓库容量（平方米）'
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '1:正常 0:停用'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'warehouse',
    timestamps: false
  });

  Warehouse.associate = function(models) {
    Warehouse.hasMany(models.Product, {
      foreignKey: 'warehouse_id',
      as: 'products'
    });
    Warehouse.hasMany(models.Inventory, {
      foreignKey: 'warehouse_id',
      as: 'inventory'
    });
    Warehouse.belongsTo(models.Employee, {
      foreignKey: 'manager_id',
      as: 'manager'
    });
  };

  return Warehouse;
}; 