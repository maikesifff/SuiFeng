module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    dept_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dept_name: {
      type: DataTypes.STRING(50),
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
    tableName: 'department',
    timestamps: false
  });

  Department.associate = (models) => {
    // 与 Employee 的关联
    Department.hasMany(models.Employee, {
      foreignKey: 'department_id',
      as: 'Employees'
    });
  };

  return Department;
}; 