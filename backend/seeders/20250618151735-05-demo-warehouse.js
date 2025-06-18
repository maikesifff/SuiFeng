'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('warehouse', [
      {
        warehouse_id: 1,
        warehouse_name: '上海中心仓',
        address: '上海市浦东新区物流园区1号',
        manager_id: 1, // 张伟
        phone: '021-12345678',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        warehouse_id: 2,
        warehouse_name: '北京分仓',
        address: '北京市大兴区物流基地A座',
        manager_id: 10, // 郑浩
        phone: '010-87654321',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        warehouse_id: 3,
        warehouse_name: '广州冷链仓',
        address: '广州市白云区冷链物流中心3号楼',
        manager_id: 2, // 李娜
        phone: '020-33445566',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warehouse', null, {});
  }
};
