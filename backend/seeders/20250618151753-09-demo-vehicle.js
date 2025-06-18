'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('vehicle', [
      {
        plate_no: '沪A12345',
        type: '厢式货车',
        status: '空闲',
        location: '上海中心仓',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        plate_no: '京B67890',
        type: '冷藏车',
        status: '运输中',
        location: '北京市区',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        plate_no: '粤C11223',
        type: '厢式货车',
        status: '维修中',
        location: '广州维修厂',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        plate_no: '沪D44556',
        type: '平板货车',
        status: '空闲',
        location: '上海中心仓',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        plate_no: '京E77889',
        type: '冷藏车',
        status: '空闲',
        location: '北京分仓',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicle', null, {});
  }
};
