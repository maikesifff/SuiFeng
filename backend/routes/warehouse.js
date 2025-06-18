const express = require('express');
const router = express.Router();
const { Warehouse, Inventory, Product } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// 获取仓库列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { warehouse_name: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Warehouse.findAndCountAll({
      where,
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

// 获取仓库详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [
        {
          model: Inventory,
          as: 'Inventories',
          include: [
            {
              model: Product,
              as: 'Product'
            }
          ]
        }
      ]
    });

    if (!warehouse) {
      throw new ValidationError('仓库不存在');
    }

    success(res, warehouse);
  } catch (err) {
    next(err);
  }
});

// 创建仓库
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const {
      warehouse_name,
      location,
      contact_person,
      contact_phone,
      capacity,
      status = 'active',
      notes
    } = req.body;

    // 验证必填字段
    if (!warehouse_name || !location) {
      throw new ValidationError('请填写仓库名称和位置');
    }

    // 检查仓库名称是否已存在
    const existingWarehouse = await Warehouse.findOne({
      where: { warehouse_name }
    });

    if (existingWarehouse) {
      throw new ValidationError('仓库名称已存在');
    }

    const warehouse = await Warehouse.create({
      warehouse_name,
      location,
      contact_person,
      contact_phone,
      capacity,
      status,
      notes
    });

    success(res, warehouse);
  } catch (err) {
    next(err);
  }
});

// 更新仓库
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const {
      warehouse_name,
      location,
      contact_person,
      contact_phone,
      capacity,
      status,
      notes
    } = req.body;

    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse) {
      throw new ValidationError('仓库不存在');
    }

    // 如果更新仓库名称，检查是否与其他仓库重名
    if (warehouse_name && warehouse_name !== warehouse.warehouse_name) {
      const existingWarehouse = await Warehouse.findOne({
        where: { warehouse_name }
      });

      if (existingWarehouse) {
        throw new ValidationError('仓库名称已存在');
      }
    }

    await warehouse.update({
      warehouse_name,
      location,
      contact_person,
      contact_phone,
      capacity,
      status,
      notes
    });

    success(res, warehouse);
  } catch (err) {
    next(err);
  }
});

// 删除仓库
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse) {
      throw new ValidationError('仓库不存在');
    }

    // 检查仓库是否有关联的库存记录
    const inventoryCount = await Inventory.count({
      where: { warehouse_id: req.params.id }
    });

    if (inventoryCount > 0) {
      throw new ValidationError('该仓库存在库存记录，无法删除');
    }

    await warehouse.destroy();
    success(res, null, '仓库删除成功');
  } catch (err) {
    next(err);
  }
});

// 获取仓库库存统计
router.get('/:id/statistics', authenticate, async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse) {
      throw new ValidationError('仓库不存在');
    }

    const statistics = await Inventory.findAll({
      where: { warehouse_id: req.params.id },
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('COUNT', sequelize.col('product_id')), 'product_count']
      ],
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['product_name', 'unit']
        }
      ],
      group: ['product_id', 'Product.product_id']
    });

    success(res, statistics);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 