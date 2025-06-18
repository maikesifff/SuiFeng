module.exports = (sequelize, DataTypes) => {
  const Shipper = sequelize.define('Shipper', {
    shipper_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shipper_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
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
    tableName: 'shipper',
    timestamps: false
  });

  Shipper.associate = function(models) {
    // 货主可以有多个订单
    Shipper.hasMany(models.Order, {
      foreignKey: 'shipper_id',
      as: 'Orders'
    });
  };

  return Shipper;
}; 