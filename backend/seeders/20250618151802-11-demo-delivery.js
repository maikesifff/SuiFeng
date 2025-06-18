'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('delivery', [
      {
        delivery_id: 1,
        order_id: 1, // 已完成订单
        plate_no: '沪A12345', // 厢式货车
        driver_id: 3, // 王刚
        destination: '上海市徐汇区',
        depart_time: '2023-11-01 14:00:00',
        eta: '2023-11-01 15:30:00',
        actual_arrival: '2023-11-01 15:20:00',
        status: '已送达',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        delivery_id: 2,
        order_id: 3, // 已发货订单
        plate_no: '京B67890', // 冷藏车
        driver_id: 4, // 赵敏
        destination: '北京市朝阳区',
        depart_time: '2023-11-03 09:00:00',
        eta: '2023-11-04 18:00:00',
        actual_arrival: null,
        status: '运输中',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        delivery_id: 3,
        order_id: 6, // 处理中订单
        plate_no: '沪D44556', // 平板货车
        driver_id: 8, // 周涛
        destination: '上海市静安区',
        depart_time: '2023-11-06 14:30:00',
        eta: '2023-11-06 16:00:00',
        actual_arrival: '2023-11-06 15:45:00',
        status: '已送达',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        delivery_id: 4,
        order_id: 7, // 已发货订单
        plate_no: '粤C11223', // 厢式货车
        driver_id: 4, // 赵敏
        destination: '广州市天河区',
        depart_time: '2023-11-07 10:00:00',
        eta: '2023-11-08 12:00:00',
        actual_arrival: null,
        status: '运输中',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('delivery', null, {});
  }
};
