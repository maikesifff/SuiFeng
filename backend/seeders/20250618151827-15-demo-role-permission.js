'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role_permission', [
      // 系统管理员 - 拥有所有权限
      { role_id: 1, perm_id: 1, created_at: new Date(), updated_at: new Date() }, // 系统管理
      { role_id: 1, perm_id: 2, created_at: new Date(), updated_at: new Date() }, // 用户管理
      { role_id: 1, perm_id: 3, created_at: new Date(), updated_at: new Date() }, // 仓库管理
      { role_id: 1, perm_id: 4, created_at: new Date(), updated_at: new Date() }, // 库存查看
      { role_id: 1, perm_id: 5, created_at: new Date(), updated_at: new Date() }, // 库存编辑
      { role_id: 1, perm_id: 6, created_at: new Date(), updated_at: new Date() }, // 订单管理
      { role_id: 1, perm_id: 7, created_at: new Date(), updated_at: new Date() }, // 配送管理
      { role_id: 1, perm_id: 8, created_at: new Date(), updated_at: new Date() }, // 报表查看
      { role_id: 1, perm_id: 9, created_at: new Date(), updated_at: new Date() }, // 数据导出
      { role_id: 1, perm_id: 10, created_at: new Date(), updated_at: new Date() }, // 系统设置

      // 仓库主管 - 仓库和库存相关权限
      { role_id: 2, perm_id: 3, created_at: new Date(), updated_at: new Date() }, // 仓库管理
      { role_id: 2, perm_id: 4, created_at: new Date(), updated_at: new Date() }, // 库存查看
      { role_id: 2, perm_id: 5, created_at: new Date(), updated_at: new Date() }, // 库存编辑
      { role_id: 2, perm_id: 8, created_at: new Date(), updated_at: new Date() }, // 报表查看

      // 订单处理员 - 订单和库存查看权限
      { role_id: 3, perm_id: 4, created_at: new Date(), updated_at: new Date() }, // 库存查看
      { role_id: 3, perm_id: 6, created_at: new Date(), updated_at: new Date() }, // 订单管理
      { role_id: 3, perm_id: 8, created_at: new Date(), updated_at: new Date() }, // 报表查看

      // 配送管理员 - 配送和库存查看权限
      { role_id: 4, perm_id: 4, created_at: new Date(), updated_at: new Date() }, // 库存查看
      { role_id: 4, perm_id: 7, created_at: new Date(), updated_at: new Date() }, // 配送管理
      { role_id: 4, perm_id: 8, created_at: new Date(), updated_at: new Date() }, // 报表查看

      // 普通员工 - 基础查看权限
      { role_id: 5, perm_id: 4, created_at: new Date(), updated_at: new Date() }, // 库存查看
      { role_id: 5, perm_id: 8, created_at: new Date(), updated_at: new Date() }  // 报表查看
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permission', null, {});
  }
};
