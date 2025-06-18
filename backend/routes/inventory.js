const express = require('express');
const router = express.Router();
const { Inventory, Product, Warehouse } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// 获取库存列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, warehouse_id, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (warehouse_id) {
      where.warehouse_id = warehouse_id;
    }
    if (keyword) {
      where['$Product.product_name$'] = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Inventory.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'Product'
        },
        {
          model: Warehouse,
          as: 'Warehouse'
        }
      ],
      offset,
      limit: parseInt(pageSize),
      order: [['created_at', 'DESC']]
    });

    success(res, {
      total: count,
      list: rows
    });
  } catch (err) {
    next(err);
  }
});

// 获取库存详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'Product'
        },
        {
          model: Warehouse,
          as: 'Warehouse'
        }
      ]
    });

    if (!inventory) {
      throw new ValidationError('库存记录不存在');
    }

    success(res, inventory);
  } catch (err) {
    next(err);
  }
});

// 更新库存
router.put('/:id', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { quantity, min_quantity, max_quantity } = req.body;
    const inventory = await Inventory.findByPk(req.params.id);

    if (!inventory) {
      throw new ValidationError('库存记录不存在');
    }

    // 验证库存数量
    if (quantity < 0) {
      throw new ValidationError('库存数量不能为负数');
    }

    if (min_quantity && max_quantity && min_quantity > max_quantity) {
      throw new ValidationError('最小库存不能大于最大库存');
    }

    await inventory.update({
      quantity,
      min_quantity,
      max_quantity
    });

    success(res, inventory);
  } catch (err) {
    next(err);
  }
});

// 库存预警列表
router.get('/alerts/low-stock', authenticate, async (req, res, next) => {
  try {
    const inventories = await Inventory.findAll({
      where: {
        quantity: {
          [Op.lte]: sequelize.col('min_quantity')
        }
      },
      include: [
        {
          model: Product,
          as: 'Product'
        },
        {
          model: Warehouse,
          as: 'Warehouse'
        }
      ]
    });

    success(res, inventories);
  } catch (err) {
    next(err);
  }
});

// 库存预警列表
router.get('/alerts/over-stock', authenticate, async (req, res, next) => {
  try {
    const inventories = await Inventory.findAll({
      where: {
        quantity: {
          [Op.gte]: sequelize.col('max_quantity')
        }
      },
      include: [
        {
          model: Product,
          as: 'Product'
        },
        {
          model: Warehouse,
          as: 'Warehouse'
        }
      ]
    });

    success(res, inventories);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 