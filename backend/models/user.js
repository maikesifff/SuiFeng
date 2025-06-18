module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'user',
    timestamps: false
  });

  User.associate = (models) => {
    // 与 Employee 的关联
    User.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'Employee'
    });
  };

  // 添加密码验证方法
  User.prototype.validatePassword = async function(password) {
    return this.password === password; // 简单比较，实际应该使用加密
  };

  return User;
}; 