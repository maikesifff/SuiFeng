'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 创建货主表
    await queryInterface.createTable('shipper', {
      shipper_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      shipper_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(200),
        allowNull: false
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

    // 创建车辆表
    await queryInterface.createTable('vehicle', {
      plate_no: {
        type: Sequelize.STRING(20),
        primaryKey: true
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '如：厢式货车、冷藏车'
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: '空闲',
        validate: {
          isIn: [['空闲', '运输中', '维修中']]
        }
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '车辆当前位置'
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

    // 创建订单表
    await queryInterface.createTable('order', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: '创建',
        validate: {
          isIn: [['创建', '处理中', '已发货', '已完成', '已取消', '退货中']]
        }
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'employee_id'
        }
      },
      shipper_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'shipper',
          key: 'shipper_id'
        }
      },
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inventory',
          key: 'inventory_id'
        },
        comment: '具体出库的库存批次'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1
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

    // 创建配送表
    await queryInterface.createTable('delivery', {
      delivery_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'order',
          key: 'order_id'
        }
      },
      plate_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'vehicle',
          key: 'plate_no'
        }
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'employee_id'
        }
      },
      destination: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      depart_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      eta: {
        type: Sequelize.DATE,
        allowNull: false
      },
      actual_arrival: {
        type: Sequelize.DATE,
        comment: '实际到达时间'
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: '待发车',
        validate: {
          isIn: [['待发车', '运输中', '已送达', '延迟', '取消']]
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
  },

  async down(queryInterface, Sequelize) {
    // 删除表的顺序要与创建顺序相反
    await queryInterface.dropTable('delivery');
    await queryInterface.dropTable('order');
    await queryInterface.dropTable('vehicle');
    await queryInterface.dropTable('shipper');
  }
}; 