'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('supplier', [
      {
        supplier_id: 1,
        address: '浙江省杭州市余杭区科技园88号',
        products: '电子产品',
        manager: '马云',
        phone: '0571-88889999',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supplier_id: 2,
        address: '广东省深圳市南山区科技园',
        products: '电子元器件',
        manager: '马化腾',
        phone: '0755-66667777',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supplier_id: 3,
        address: '江苏省苏州市工业园区',
        products: '服装鞋帽',
        manager: '张瑞敏',
        phone: '0512-55556666',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supplier_id: 4,
        address: '四川省成都市高新区',
        products: '食品饮料',
        manager: '刘永好',
        phone: '028-22223333',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('supplier', null, {});
  }
};
