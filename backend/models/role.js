module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
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
    tableName: 'role',
    timestamps: false
  });

  Role.associate = (models) => {
    // 角色可以有多个员工
    Role.hasMany(models.EmployeeRole, {
      foreignKey: 'role_id',
      as: 'EmployeeRoles'
    });
  };

  return Role;
}; 