const express = require('express');
const router = express.Router();
const { Order, Product, Shipper, Employee, Inventory } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// 获取订单列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const { page = 1, pageSize = 10, status, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (keyword) {
      where[Op.or] = [
        { order_id: { [Op.like]: `%${keyword}%` } },
        { '$Shipper.shipper_name$': { [Op.like]: `%${keyword}%` } },
        { '$Inventory.Product.product_name$': { [Op.like]: `%${keyword}%` } }
      ];
    }

    logger.info('Order list query', {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      status: status || null,
      keyword: keyword || null,
      hasFilter: !!(status || keyword)
    });

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Shipper,
          as: 'Shipper'
        },
        {
          model: Employee,
          as: 'Employee'
        },
        {
          model: Inventory,
          as: 'Inventory',
          include: [
            {
              model: Product,
              as: 'Product'
            }
          ]
        }
      ],
      offset,
      limit: parseInt(pageSize),
      order: [['created_at', 'DESC']]
    });

    const responseData = {
      total: count,
      list: rows
    };

    logger.success('Order list retrieved', {
      total: count,
      returned: rows.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      statusFilter: status || 'all'
    });

    success(res, responseData);
  } catch (err) {
    logger.error('Order list retrieval failed', {
      error: err.message,
      query: req.query
    });
    next(err);
  }
});

// 获取订单详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Shipper,
          as: 'Shipper'
        },
        {
          model: Employee,
          as: 'Employee'
        },
        {
          model: Inventory,
          as: 'Inventory',
          include: [
            {
              model: Product,
              as: 'Product'
            }
          ]
        }
      ]
    });

    if (!order) {
      logger.warn('Order not found', { orderId });
      throw new ValidationError('订单不存在');
    }

    logger.success('Order detail retrieved', {
      orderId,
      status: order.status,
      shipperName: order.Shipper?.shipper_name,
      productName: order.Inventory?.Product?.product_name,
      quantity: order.quantity
    });

    success(res, order);
  } catch (err) {
    logger.error('Order detail retrieval failed', {
      orderId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

// 创建订单
router.post('/', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const {
      shipper_id,
      inventory_id,
      quantity
    } = req.body;

    // 验证必填字段
    if (!shipper_id || !inventory_id || !quantity) {
      logger.warn('Order creation validation failed', {
        missingFields: {
          shipper_id: !shipper_id,
          inventory_id: !inventory_id,
          quantity: !quantity
        }
      });
      throw new ValidationError('请填写所有必填字段');
    }

    // 验证库存是否存在且数量充足
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      throw new ValidationError('库存不存在');
    }
    if (inventory.quantity < quantity) {
      throw new ValidationError('库存数量不足');
    }

    logger.info('Creating new order', {
      shipperId: shipper_id,
      employeeId: req.user.employee_id,
      inventoryId: inventory_id,
      quantity
    });

    // 创建订单
    const order = await Order.create({
      shipper_id,
      employee_id: req.user.employee_id,
      inventory_id,
      quantity,
      status: '已创建'
    });

    // 更新库存数量
    await inventory.update({
      quantity: inventory.quantity - quantity
    });

    logger.success('Order created successfully', {
      orderId: order.order_id,
      shipperId: shipper_id,
      inventoryId: inventory_id,
      quantity: quantity
    });

    success(res, order);
  } catch (err) {
    logger.error('Order creation failed', {
      orderData: req.body,
      error: err.message
    });
    next(err);
  }
});

// 更新订单状态
router.put('/:id/status', authenticate, authorize('系统管理员', '仓库管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      logger.warn('Order not found for status update', { orderId });
      throw new ValidationError('订单不存在');
    }

    const oldStatus = order.status;

    // 验证状态转换是否合法
    const validTransitions = {
      '已创建': ['处理中', '已取消'],
      '处理中': ['已发货', '已取消'],
      '已发货': ['已完成'],
      '已完成': [],
      '已取消': [],
      '退货中': ['已取消', '已完成']
    };

    if (!validTransitions[oldStatus] || !validTransitions[oldStatus].includes(status)) {
      logger.warn('Invalid status transition attempted', {
        orderId,
        fromStatus: oldStatus,
        toStatus: status,
        validTransitions: validTransitions[oldStatus] || []
      });
      throw new ValidationError('非法的状态转换');
    }

    await order.update({ status });

    logger.success('Order status updated successfully', {
      orderId,
      statusChange: {
        from: oldStatus,
        to: status
      }
    });

    success(res, order);
  } catch (err) {
    logger.error('Order status update failed', {
      orderId: req.params.id,
      newStatus: req.body.status,
      error: err.message
    });
    next(err);
  }
});

// 取消订单
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Inventory,
          as: 'Inventory'
        }
      ]
    });

    if (!order) {
      logger.warn('Order not found for cancellation', { orderId });
      throw new ValidationError('订单不存在');
    }

    if (!['已创建', '处理中'].includes(order.status)) {
      logger.warn('Order cancellation blocked - invalid status', {
        orderId,
        currentStatus: order.status,
        allowedStatuses: ['已创建', '处理中']
      });
      throw new ValidationError('只能取消已创建或处理中的订单');
    }

    // 恢复库存数量
    if (order.Inventory) {
      await order.Inventory.update({
        quantity: order.Inventory.quantity + order.quantity
      });
    }

    await order.update({ status: '已取消' });

    logger.success('Order cancelled successfully', {
      orderId,
      previousStatus: order.status,
      restoredQuantity: order.quantity
    });

    success(res, order);
  } catch (err) {
    logger.error('Order cancellation failed', {
      orderId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

// 删除订单
router.delete('/:id', authenticate, authorize('系统管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Inventory,
          as: 'Inventory'
        }
      ]
    });

    if (!order) {
      logger.warn('Order not found for deletion', { orderId });
      throw new ValidationError('订单不存在');
    }

    // 只允许删除已取消或已完成的订单
    if (!['已取消', '已完成'].includes(order.status)) {
      logger.warn('Order deletion blocked - invalid status', {
        orderId,
        currentStatus: order.status,
        allowedStatuses: ['已取消', '已完成']
      });
      throw new ValidationError('只能删除已取消或已完成的订单');
    }

    const orderInfo = {
      orderId: order.order_id,
      status: order.status,
      shipperId: order.shipper_id,
      inventoryId: order.inventory_id,
      quantity: order.quantity
    };

    await order.destroy();

    logger.success('Order deleted successfully', orderInfo);

    success(res, null, '订单删除成功');
  } catch (err) {
    logger.error('Order deletion failed', {
      orderId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

module.exports = router; 