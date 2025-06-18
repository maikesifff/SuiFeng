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
  return Order;
}; 