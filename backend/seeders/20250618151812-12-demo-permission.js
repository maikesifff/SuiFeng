'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permission', [
      { perm_id: 1, perm_name: '系统管理', created_at: new Date(), updated_at: new Date() },
      { perm_id: 2, perm_name: '用户管理', created_at: new Date(), updated_at: new Date() },
      { perm_id: 3, perm_name: '仓库管理', created_at: new Date(), updated_at: new Date() },
      { perm_id: 4, perm_name: '库存查看', created_at: new Date(), updated_at: new Date() },
      { perm_id: 5, perm_name: '库存编辑', created_at: new Date(), updated_at: new Date() },
      { perm_id: 6, perm_name: '订单管理', created_at: new Date(), updated_at: new Date() },
      { perm_id: 7, perm_name: '配送管理', created_at: new Date(), updated_at: new Date() },
      { perm_id: 8, perm_name: '报表查看', created_at: new Date(), updated_at: new Date() },
      { perm_id: 9, perm_name: '数据导出', created_at: new Date(), updated_at: new Date() },
      { perm_id: 10, perm_name: '系统设置', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permission', null, {});
  }
}; 