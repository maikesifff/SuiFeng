module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    delivery_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    plate_no: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    depart_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    eta: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actual_arrival: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '待发车'
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
    tableName: 'delivery',
    timestamps: false
  });
  return Delivery;
}; 