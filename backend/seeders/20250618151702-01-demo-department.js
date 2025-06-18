'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('department', [
      {
        dept_id: 1,
        dept_name: '仓储管理部',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        dept_id: 2,
        dept_name: '运输配送部',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        dept_id: 3,
        dept_name: '客户服务部',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        dept_id: 4,
        dept_name: '采购管理部',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        dept_id: 5,
        dept_name: '系统管理部',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('department', null, {});
  }
};
