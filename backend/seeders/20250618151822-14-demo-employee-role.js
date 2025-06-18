'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employee_role', [
      // 系统管理员
      { employee_id: 1, role_id: 1, created_at: new Date(), updated_at: new Date() }, // 张三

      // 仓库主管
      { employee_id: 2, role_id: 2, created_at: new Date(), updated_at: new Date() }, // 李四
      { employee_id: 6, role_id: 2, created_at: new Date(), updated_at: new Date() }, // 孙丽

      // 订单处理员
      { employee_id: 5, role_id: 3, created_at: new Date(), updated_at: new Date() }, // 刘芳
      { employee_id: 9, role_id: 3, created_at: new Date(), updated_at: new Date() }, // 吴婷

      // 配送管理员
      { employee_id: 3, role_id: 4, created_at: new Date(), updated_at: new Date() }, // 王刚
      { employee_id: 4, role_id: 4, created_at: new Date(), updated_at: new Date() }, // 赵敏
      { employee_id: 8, role_id: 4, created_at: new Date(), updated_at: new Date() }, // 周涛

      // 普通员工
      { employee_id: 7, role_id: 5, created_at: new Date(), updated_at: new Date() }, // 钱明
      { employee_id: 10, role_id: 5, created_at: new Date(), updated_at: new Date() } // 郑华
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_role', null, {});
  }
}; 