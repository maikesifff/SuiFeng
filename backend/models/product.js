module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    specification: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    min_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 9999
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
    tableName: 'product',
    timestamps: false
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Warehouse, {
      foreignKey: 'warehouse_id',
      as: 'warehouse'
    });
    Product.belongsTo(models.Supplier, {
      foreignKey: 'supplier_id',
      as: 'supplier'
    });
    Product.hasMany(models.Inventory, {
      foreignKey: 'product_id',
      as: 'inventory'
    });
  };

  return Product;
}; 