'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 创建仓库表
    await queryInterface.createTable('warehouse', {
      warehouse_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      warehouse_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      manager_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'employee_id'
        }
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false
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

    // 创建商品表
    await queryInterface.createTable('product', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier',
          key: 'supplier_id'
        }
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
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

    // 创建库存表
    await queryInterface.createTable('inventory', {
      inventory_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouse',
          key: 'warehouse_id'
        }
      },
      location_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '库位名称（如：A-01-02）'
      },
      location_status: {
        type: Sequelize.STRING(20),
        validate: {
          isIn: [['空闲', '未满', '已满']]
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product',
          key: 'product_id'
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: '商品单价'
      },
      entry_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: '入库日期'
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        comment: '过期时间（可为空）'
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

    // 添加联合唯一索引
    await queryInterface.addIndex('inventory', ['warehouse_id', 'location_name', 'product_id'], {
      unique: true,
      name: 'idx_warehouse_location_product'
    });
  },

  async down(queryInterface, Sequelize) {
    // 删除表的顺序要与创建顺序相反
    await queryInterface.dropTable('inventory');
    await queryInterface.dropTable('product');
    await queryInterface.dropTable('warehouse');
  }
};
