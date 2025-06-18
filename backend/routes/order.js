const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, Customer, Employee } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// 获取订单列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (keyword) {
      where[Op.or] = [
        { order_number: { [Op.like]: `%${keyword}%` } },
        { '$Customer.name$': { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'Customer'
        },
        {
          model: Employee,
          as: 'Employee'
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

// 获取订单详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: 'Customer'
        },
        {
          model: Employee,
          as: 'Employee'
        },
        {
          model: OrderItem,
          as: 'OrderItems',
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
      throw new ValidationError('订单不存在');
    }

    success(res, order);
  } catch (err) {
    next(err);
  }
});

// 创建订单
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      customer_id,
      items,
      delivery_address,
      delivery_time,
      notes
    } = req.body;

    // 验证必填字段
    if (!customer_id || !items || !items.length) {
      throw new ValidationError('请填写所有必填字段');
    }

    // 生成订单号
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 创建订单
    const order = await Order.create({
      order_number: orderNumber,
      customer_id,
      employee_id: req.user.employee_id,
      delivery_address,
      delivery_time,
      notes,
      status: 'pending'
    });

    // 创建订单项
    const orderItems = await Promise.all(
      items.map(item => 
        OrderItem.create({
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })
      )
    );

    success(res, {
      ...order.toJSON(),
      items: orderItems
    });
  } catch (err) {
    next(err);
  }
});

// 更新订单状态
router.put('/:id/status', authenticate, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      throw new ValidationError('订单不存在');
    }

    // 验证状态转换是否合法
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['completed'],
      cancelled: [],
      completed: []
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new ValidationError('非法的状态转换');
    }

    await order.update({ status });
    success(res, order);
  } catch (err) {
    next(err);
  }
});

// 取消订单
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      throw new ValidationError('订单不存在');
    }

    if (order.status !== 'pending') {
      throw new ValidationError('只能取消待处理的订单');
    }

    await order.update({ status: 'cancelled' });
    success(res, order);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 