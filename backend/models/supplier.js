module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    supplier_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    supplier_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    supplier_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    contact_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
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
    tableName: 'supplier',
    timestamps: false
  });

  Supplier.associate = function(models) {
    Supplier.hasMany(models.Product, {
      foreignKey: 'supplier_id',
      as: 'products'
    });
  };

  return Supplier;
}; 