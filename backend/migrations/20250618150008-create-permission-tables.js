'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 创建权限表
    await queryInterface.createTable('permission', {
      perm_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      perm_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '权限名称'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 创建角色表
    await queryInterface.createTable('role', {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: '角色名称'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 创建用户角色关联表
    await queryInterface.createTable('employee_role', {
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'employee_id'
        }
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'role_id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 添加联合主键
    await queryInterface.addConstraint('employee_role', {
      fields: ['employee_id', 'role_id'],
      type: 'primary key',
      name: 'employee_role_pkey'
    });

    // 创建角色权限关联表
    await queryInterface.createTable('role_permission', {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'role_id'
        }
      },
      perm_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permission',
          key: 'perm_id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 添加联合主键
    await queryInterface.addConstraint('role_permission', {
      fields: ['role_id', 'perm_id'],
      type: 'primary key',
      name: 'role_permission_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    // 删除表的顺序要与创建顺序相反
    await queryInterface.dropTable('role_permission');
    await queryInterface.dropTable('employee_role');
    await queryInterface.dropTable('role');
    await queryInterface.dropTable('permission');
  }
};
