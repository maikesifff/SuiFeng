'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employee', [
      {
        employee_id: 1,
        name: '张伟',
        gender: '男',
        age: 35,
        phone: '13800138001',
        department_id: 1, // 仓储管理部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 2,
        name: '李娜',
        gender: '女',
        age: 28,
        phone: '13800138002',
        department_id: 1, // 仓储管理部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 3,
        name: '王刚',
        gender: '男',
        age: 42,
        phone: '13800138003',
        department_id: 2, // 运输配送部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 4,
        name: '赵敏',
        gender: '女',
        age: 31,
        phone: '13800138004',
        department_id: 2, // 运输配送部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 5,
        name: '刘芳',
        gender: '女',
        age: 26,
        phone: '13800138005',
        department_id: 3, // 客户服务部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 6,
        name: '陈强',
        gender: '男',
        age: 38,
        phone: '13800138006',
        department_id: 4, // 采购管理部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 7,
        name: '杨雪',
        gender: '女',
        age: 29,
        phone: '13800138007',
        department_id: 5, // 系统管理部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 8,
        name: '周涛',
        gender: '男',
        age: 45,
        phone: '13800138008',
        department_id: 2, // 运输配送部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 9,
        name: '吴婷',
        gender: '女',
        age: 33,
        phone: '13800138009',
        department_id: 3, // 客户服务部
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 10,
        name: '郑浩',
        gender: '男',
        age: 40,
        phone: '13800138010',
        department_id: 1, // 仓储管理部
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee', null, {});
  }
};
