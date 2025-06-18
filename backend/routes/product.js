const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product, Warehouse, Inventory, Supplier } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');

// 获取产品列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${keyword}%` } },
        { product_code: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['warehouse_id', 'warehouse_name']
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name']
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

// 获取产品详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Warehouse,
          as: 'Warehouse'
        },
        {
          model: Inventory,
          as: 'Inventory'
        }
      ]
    });

    if (!product) {
      throw new ValidationError('产品不存在');
    }

    success(res, product);
  } catch (err) {
    next(err);
  }
});

// 创建产品
router.post('/', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const {
      product_name,
      product_code,
      category,
      specification,
      unit,
      price,
      warehouse_id,
      supplier_id
    } = req.body;

    // 验证必填字段
    if (!product_name || !product_code || !category || !specification || !unit || !price) {
      throw new ValidationError('请填写所有必填字段');
    }

    // 检查产品编码是否已存在
    const existingProduct = await Product.findOne({
      where: { product_code }
    });

    if (existingProduct) {
      throw new ValidationError('产品编码已存在');
    }

    const product = await Product.create({
      product_name,
      product_code,
      category,
      specification,
      unit,
      price,
      warehouse_id,
      supplier_id
    });

    success(res, product);
  } catch (err) {
    next(err);
  }
});

// 更新产品
router.put('/:id', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const {
      product_name,
      category,
      specification,
      unit,
      price,
      warehouse_id,
      supplier_id
    } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new ValidationError('产品不存在');
    }

    await product.update({
      product_name,
      category,
      specification,
      unit,
      price,
      warehouse_id,
      supplier_id
    });

    success(res, product);
  } catch (err) {
    next(err);
  }
});

// 删除产品
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new ValidationError('产品不存在');
    }

    // 检查是否有库存
    const inventory = await Inventory.findOne({
      where: { product_id: req.params.id }
    });

    if (inventory && inventory.quantity > 0) {
      throw new ValidationError('该产品还有库存，无法删除');
    }

    await product.destroy();
    success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
});

module.exports = router; 