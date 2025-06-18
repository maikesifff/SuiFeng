module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    inventory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unit_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
    tableName: 'inventory',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['warehouse_id', 'location_name', 'product_id']
      }
    ]
  });
  return Inventory;
}; 