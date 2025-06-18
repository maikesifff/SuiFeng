module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '创建'
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'order',
    timestamps: false
  });

  Order.associate = function(models) {
    // 订单属于一个货主
    Order.belongsTo(models.Shipper, {
      foreignKey: 'shipper_id',
      as: 'Shipper'
    });

    // 订单属于一个员工
    Order.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'Employee'
    });

    // 订单关联一个库存项
    Order.belongsTo(models.Inventory, {
      foreignKey: 'inventory_id',
      as: 'Inventory'
    });

    // 订单有一个配送记录
    Order.hasOne(models.Delivery, {
      foreignKey: 'order_id',
      as: 'Delivery'
    });
  };

  return Order;
}; 