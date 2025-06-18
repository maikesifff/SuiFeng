module.exports = (sequelize, DataTypes) => {
  const EmployeeRole = sequelize.define('EmployeeRole', {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
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
    tableName: 'employee_role',
    timestamps: false
  });

  EmployeeRole.associate = (models) => {
    // 关联Employee
    EmployeeRole.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'Employee'
    });

    // 关联Role
    EmployeeRole.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'Role'
    });
  };

  return EmployeeRole;
}; 