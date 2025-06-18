'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', [
      { role_id: 1, role_name: '系统管理员', created_at: new Date(), updated_at: new Date() },
      { role_id: 2, role_name: '仓库主管', created_at: new Date(), updated_at: new Date() },
      { role_id: 3, role_name: '订单处理员', created_at: new Date(), updated_at: new Date() },
      { role_id: 4, role_name: '配送管理员', created_at: new Date(), updated_at: new Date() },
      { role_id: 5, role_name: '普通员工', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
}; 