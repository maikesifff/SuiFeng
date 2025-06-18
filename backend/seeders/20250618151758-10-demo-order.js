'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('order', [
      {
        order_id: 1,
        status: '已完成',
        employee_id: 5, // 刘芳
        shipper_id: 1, // 京东商城
        inventory_id: 1, // iPhone 15 Pro
        quantity: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 2,
        status: '处理中',
        employee_id: 5, // 刘芳
        shipper_id: 2, // 天猫超市
        inventory_id: 2, // 华为Mate 60
        quantity: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 3,
        status: '已发货',
        employee_id: 9, // 吴婷
        shipper_id: 1, // 京东商城
        inventory_id: 4, // 联想笔记本电脑
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 4,
        status: '创建',
        employee_id: 5, // 刘芳
        shipper_id: 3, // 苏宁易购
        inventory_id: 5, // 耐克运动鞋
        quantity: 20,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 5,
        status: '退货中',
        employee_id: 9, // 吴婷
        shipper_id: 4, // 唯品会
        inventory_id: 7, // 茅台酒
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 6,
        status: '处理中',
        employee_id: 5, // 刘芳
        shipper_id: 1, // 京东商城
        inventory_id: 10, // 格力空调
        quantity: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 7,
        status: '已发货',
        employee_id: 9, // 吴婷
        shipper_id: 2, // 天猫超市
        inventory_id: 8, // 蒙牛纯牛奶
        quantity: 50,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order', null, {});
  }
};
