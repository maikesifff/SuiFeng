'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('product', [
      {
        product_id: 1,
        product_name: 'iPhone 15 Pro',
        supplier_id: 1, // 电子产品供应商
        category: '电子产品',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 2,
        product_name: '华为Mate 60',
        supplier_id: 1, // 电子产品供应商
        category: '电子产品',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3,
        product_name: '小米智能手环',
        supplier_id: 1, // 电子产品供应商
        category: '电子产品',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 4,
        product_name: '联想笔记本电脑',
        supplier_id: 2, // 电子元器件供应商
        category: '电子产品',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 5,
        product_name: '耐克运动鞋',
        supplier_id: 3, // 服装鞋帽供应商
        category: '服装鞋帽',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 6,
        product_name: '阿迪达斯T恤',
        supplier_id: 3, // 服装鞋帽供应商
        category: '服装鞋帽',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 7,
        product_name: '茅台酒',
        supplier_id: 4, // 食品饮料供应商
        category: '食品饮料',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 8,
        product_name: '蒙牛纯牛奶',
        supplier_id: 4, // 食品饮料供应商
        category: '食品饮料',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 9,
        product_name: '三只松鼠坚果',
        supplier_id: 4, // 食品饮料供应商
        category: '食品饮料',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 10,
        product_name: '格力空调',
        supplier_id: 2, // 电子元器件供应商
        category: '家电',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product', null, {});
  }
};
