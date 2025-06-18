'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('inventory', [
      {
        inventory_id: 1,
        warehouse_id: 1, // 上海中心仓
        location_name: 'A-01-01',
        location_status: '已满',
        product_id: 1, // iPhone 15 Pro
        quantity: 100,
        unit_price: 8999.00,
        entry_date: '2023-10-01',
        expiry_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 2,
        warehouse_id: 1, // 上海中心仓
        location_name: 'A-01-02',
        location_status: '未满',
        product_id: 2, // 华为Mate 60
        quantity: 150,
        unit_price: 6999.00,
        entry_date: '2023-10-05',
        expiry_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 3,
        warehouse_id: 1, // 上海中心仓
        location_name: 'B-02-01',
        location_status: '空闲',
        product_id: 3, // 小米智能手环
        quantity: 0,
        unit_price: 299.00,
        entry_date: '2023-10-10',
        expiry_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 4,
        warehouse_id: 1, // 上海中心仓
        location_name: 'C-03-01',
        location_status: '已满',
        product_id: 4, // 联想笔记本电脑
        quantity: 200,
        unit_price: 5999.00,
        entry_date: '2023-10-15',
        expiry_date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 5,
        warehouse_id: 2, // 北京分仓
        location_name: 'A-01-01',
        location_status: '未满',
        product_id: 5, // 耐克运动鞋
        quantity: 80,
        unit_price: 799.00,
        entry_date: '2023-10-20',
        expiry_date: '2024-10-20',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 6,
        warehouse_id: 2, // 北京分仓
        location_name: 'A-01-02',
        location_status: '已满',
        product_id: 6, // 阿迪达斯T恤
        quantity: 120,
        unit_price: 299.00,
        entry_date: '2023-10-25',
        expiry_date: '2024-10-25',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 7,
        warehouse_id: 3, // 广州冷链仓
        location_name: 'D-01-01',
        location_status: '未满',
        product_id: 7, // 茅台酒
        quantity: 50,
        unit_price: 1499.00,
        entry_date: '2023-11-01',
        expiry_date: '2025-11-01',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 8,
        warehouse_id: 3, // 广州冷链仓
        location_name: 'D-01-02',
        location_status: '未满',
        product_id: 8, // 蒙牛纯牛奶
        quantity: 200,
        unit_price: 59.00,
        entry_date: '2023-11-05',
        expiry_date: '2024-05-05',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 9,
        warehouse_id: 3, // 广州冷链仓
        location_name: 'D-01-03',
        location_status: '已满',
        product_id: 9, // 三只松鼠坚果
        quantity: 300,
        unit_price: 89.00,
        entry_date: '2023-11-10',
        expiry_date: '2024-06-10',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        inventory_id: 10,
        warehouse_id: 1, // 上海中心仓
        location_name: 'B-02-02',
        location_status: '未满',
        product_id: 10, // 格力空调
        quantity: 60,
        unit_price: 3999.00,
        entry_date: '2023-11-15',
        expiry_date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventory', null, {});
  }
};
