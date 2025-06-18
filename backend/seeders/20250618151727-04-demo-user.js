'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        user_id: 1,
        username: 'zhangwei',
        email: 'zhangwei@example.com',
        password: 'P@ss123',
        phone: '13800138001',
        employee_id: 1, // 张伟
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        username: 'lina',
        email: 'lina@example.com',
        password: 'P@ss123',
        phone: '13800138002',
        employee_id: 2, // 李娜
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        username: 'wanggang',
        email: 'wanggang@example.com',
        password: 'P@ss123',
        phone: '13800138003',
        employee_id: 3, // 王刚
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        username: 'zhaomin',
        email: 'zhaomin@example.com',
        password: 'P@ss123',
        phone: '13800138004',
        employee_id: 4, // 赵敏
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 5,
        username: 'liufang',
        email: 'liufang@example.com',
        password: 'P@ss123',
        phone: '13800138005',
        employee_id: 5, // 刘芳
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
