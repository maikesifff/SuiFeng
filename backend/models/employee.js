module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    department_id: {
      type: DataTypes.INTEGER,
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
    tableName: 'employee',
    timestamps: false
  });

  Employee.associate = (models) => {
    // 与 Department 的关联
    Employee.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'Department'
    });
  };

  return Employee;
}; 