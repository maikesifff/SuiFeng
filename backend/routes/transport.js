const express = require('express');
const router = express.Router();
const { Transport, Shipper, Vehicle, Order } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// 获取运输任务列表
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
        { transport_number: { [Op.like]: `%${keyword}%` } },
        { '$Order.order_number$': { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Transport.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: 'Order'
        },
        {
          model: Shipper,
          as: 'Shipper'
        },
        {
          model: Vehicle,
          as: 'Vehicle'
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

// 获取运输任务详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const transport = await Transport.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: 'Order'
        },
        {
          model: Shipper,
          as: 'Shipper'
        },
        {
          model: Vehicle,
          as: 'Vehicle'
        }
      ]
    });

    if (!transport) {
      throw new ValidationError('运输任务不存在');
    }

    success(res, transport);
  } catch (err) {
    next(err);
  }
});

// 创建运输任务
router.post('/', authenticate, authorize('系统管理员', '运输调度员'), async (req, res, next) => {
  try {
    const {
      order_id,
      shipper_id,
      vehicle_id,
      planned_departure_time,
      planned_arrival_time,
      notes
    } = req.body;

    // 验证必填字段
    if (!order_id || !shipper_id || !vehicle_id || !planned_departure_time || !planned_arrival_time) {
      throw new ValidationError('请填写所有必填字段');
    }

    // 检查订单是否存在且状态正确
    const order = await Order.findByPk(order_id);
    if (!order) {
      throw new ValidationError('订单不存在');
    }
    if (order.status !== 'processing') {
      throw new ValidationError('订单状态不正确，无法创建运输任务');
    }

    // 检查司机是否可用
    const shipper = await Shipper.findByPk(shipper_id);
    if (!shipper || shipper.status !== 'available') {
      throw new ValidationError('司机不可用');
    }

    // 检查车辆是否可用
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle || vehicle.status !== 'available') {
      throw new ValidationError('车辆不可用');
    }

    // 生成运输单号
    const transportNumber = `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const transport = await Transport.create({
      transport_number: transportNumber,
      order_id,
      shipper_id,
      vehicle_id,
      planned_departure_time,
      planned_arrival_time,
      status: 'pending',
      notes
    });

    // 更新订单状态
    await order.update({ status: 'shipping' });

    success(res, transport);
  } catch (err) {
    next(err);
  }
});

// 更新运输任务状态
router.put('/:id/status', authenticate, authorize('系统管理员', '运输调度员'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const transport = await Transport.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: 'Order'
        }
      ]
    });

    if (!transport) {
      throw new ValidationError('运输任务不存在');
    }

    // 验证状态转换是否合法
    const validTransitions = {
      pending: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[transport.status].includes(status)) {
      throw new ValidationError('非法的状态转换');
    }

    await transport.update({ status });

    // 如果运输完成，更新订单状态
    if (status === 'completed') {
      await transport.Order.update({ status: 'delivered' });
    }

    success(res, transport);
  } catch (err) {
    next(err);
  }
});

// 取消运输任务
router.post('/:id/cancel', authenticate, authorize('系统管理员', '运输调度员'), async (req, res, next) => {
  try {
    const transport = await Transport.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: 'Order'
        }
      ]
    });

    if (!transport) {
      throw new ValidationError('运输任务不存在');
    }

    if (transport.status !== 'pending') {
      throw new ValidationError('只能取消待处理的运输任务');
    }

    await transport.update({ status: 'cancelled' });
    await transport.Order.update({ status: 'processing' });

    success(res, transport);
  } catch (err) {
    next(err);
  }
});

// 获取司机列表
router.get('/shippers', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Shipper.findAndCountAll({
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

// 获取车辆列表
router.get('/vehicles', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Vehicle.findAndCountAll({
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

module.exports = router; 