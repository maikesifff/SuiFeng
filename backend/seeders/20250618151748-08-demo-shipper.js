'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('shipper', [
      {
        shipper_id: 1,
        shipper_name: '京东商城',
        address: '北京市朝阳区京东总部',
        phone: '400-123-4567',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        shipper_id: 2,
        shipper_name: '天猫超市',
        address: '杭州市西湖区阿里巴巴总部',
        phone: '400-234-5678',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        shipper_id: 3,
        shipper_name: '苏宁易购',
        address: '南京市玄武区苏宁总部',
        phone: '400-345-6789',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        shipper_id: 4,
        shipper_name: '唯品会',
        address: '广州市天河区唯品会总部',
        phone: '400-456-7890',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shipper', null, {});
  }
};
