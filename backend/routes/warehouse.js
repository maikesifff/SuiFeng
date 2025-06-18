const express = require('express');
const router = express.Router();
const { Warehouse, Inventory, Product, Employee, Department, EmployeeRole, Role } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const logger = require('../utils/logger');

// 获取可用的管理员列表 - 必须放在 /:id 之前
router.get('/managers/available', authenticate, async (req, res, next) => {
  try {
    logger.request(req);

    const managers = await Employee.findAll({
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['dept_name'],
          required: false
        },
        {
          model: EmployeeRole,
          as: 'EmployeeRoles',
          include: [
            {
              model: Role,
              as: 'Role',
              where: {
                role_name: {
                  [Op.in]: ['系统管理员', '仓库管理员']
                }
              },
              attributes: ['role_name']
            }
          ]
        }
      ],
      attributes: ['employee_id', 'name', 'phone']
    });

    // 格式化数据，添加department_name到顶级
    const formattedManagers = managers.map(manager => ({
      employee_id: manager.employee_id,
      name: manager.name,
      phone: manager.phone,
      department_name: manager.Department ? manager.Department.dept_name : '未分配'
    }));

    logger.success('Available managers retrieved', {
      count: formattedManagers.length
    });

    success(res, formattedManagers);
  } catch (err) {
    logger.error('Available managers retrieval failed', {
      error: err.message
    });
    next(err);
  }
});

// 获取仓库列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const { page = 1, pageSize = 10, keyword, status } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { warehouse_name: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } },
        { manager_name: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    logger.info('Warehouse list query', {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      keyword: keyword || null,
      status: status || null,
      hasFilter: !!(keyword || status)
    });

    const { count, rows } = await Warehouse.findAndCountAll({
      where,
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['employee_id', 'name', 'phone'],
          required: false
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

    logger.success('Warehouse list retrieved', {
      total: count,
      returned: rows.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      statusFilter: status || 'all'
    });

    success(res, responseData);
  } catch (err) {
    logger.error('Warehouse list retrieval failed', {
      error: err.message,
      query: req.query
    });
    next(err);
  }
});

// 获取仓库详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const warehouseId = req.params.id;

    const warehouse = await Warehouse.findByPk(warehouseId, {
      include: [
        {
          model: Employee,
          as: 'manager',
          required: false
        }
      ]
    });

    if (!warehouse) {
      logger.warn('Warehouse not found', { warehouseId });
      throw new ValidationError('仓库不存在');
    }

    logger.success('Warehouse detail retrieved', {
      warehouseId,
      warehouseName: warehouse.warehouse_name,
      status: warehouse.status,
      hasManager: !!warehouse.manager
    });

    success(res, warehouse);
  } catch (err) {
    logger.error('Warehouse detail retrieval failed', {
      warehouseId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

// 创建仓库
router.post('/', authenticate, authorize('系统管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const {
      warehouse_name,
      warehouse_code,
      location,
      manager_id,
      manager_name,
      contact_phone,
      capacity,
      status
    } = req.body;

    // 验证必填字段
    if (!warehouse_name || !warehouse_code || !location || !manager_id || !manager_name || !contact_phone) {
      logger.warn('Warehouse creation validation failed', {
        missingFields: {
          warehouse_name: !warehouse_name,
          warehouse_code: !warehouse_code,
          location: !location,
          manager_id: !manager_id,
          manager_name: !manager_name,
          contact_phone: !contact_phone
        }
      });
      throw new ValidationError('请填写所有必填字段');
    }

    // 检查仓库名称是否已存在
    const existingWarehouse = await Warehouse.findOne({
      where: { 
        [Op.or]: [
          { warehouse_name },
          { warehouse_code }
        ]
      }
    });

    if (existingWarehouse) {
      logger.warn('Warehouse name or code already exists', { 
        warehouse_name,
        warehouse_code,
        existingWarehouseId: existingWarehouse.warehouse_id 
      });
      throw new ValidationError('仓库名称或编码已存在');
    }

    const warehouse = await Warehouse.create({
      warehouse_name,
      warehouse_code,
      location,
      manager_id,
      manager_name,
      contact_phone,
      capacity: capacity || 0,
      status: status !== undefined ? parseInt(status) : 1
    });

    logger.success('Warehouse created successfully', {
      warehouseId: warehouse.warehouse_id,
      warehouseName: warehouse.warehouse_name,
      warehouseCode: warehouse.warehouse_code,
      location: warehouse.location,
      managerId: manager_id,
      status: warehouse.status
    });

    success(res, warehouse);
  } catch (err) {
    logger.error('Warehouse creation failed', {
      warehouseData: req.body,
      error: err.message
    });
    next(err);
  }
});

// 更新仓库
router.put('/:id', authenticate, authorize('系统管理员', '仓库管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const warehouseId = req.params.id;
    const {
      warehouse_name,
      warehouse_code,
      location,
      manager_id,
      manager_name,
      contact_phone,
      capacity,
      status
    } = req.body;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) {
      logger.warn('Warehouse not found for update', { warehouseId });
      throw new ValidationError('仓库不存在');
    }

    const oldData = {
      warehouse_name: warehouse.warehouse_name,
      warehouse_code: warehouse.warehouse_code,
      location: warehouse.location,
      manager_id: warehouse.manager_id,
      manager_name: warehouse.manager_name,
      contact_phone: warehouse.contact_phone,
      capacity: warehouse.capacity,
      status: warehouse.status
    };

    await warehouse.update({
      warehouse_name,
      warehouse_code,
      location,
      manager_id,
      manager_name,
      contact_phone,
      capacity,
      status
    });

    logger.success('Warehouse updated successfully', {
      warehouseId,
      warehouseName: warehouse.warehouse_name,
      changes: {
        old: oldData,
        new: req.body
      }
    });

    success(res, warehouse);
  } catch (err) {
    logger.error('Warehouse update failed', {
      warehouseId: req.params.id,
      updateData: req.body,
      error: err.message
    });
    next(err);
  }
});

// 删除仓库
router.delete('/:id', authenticate, authorize('系统管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const warehouseId = req.params.id;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) {
      logger.warn('Warehouse not found for deletion', { warehouseId });
      throw new ValidationError('仓库不存在');
    }

    const warehouseInfo = {
      warehouseId: warehouse.warehouse_id,
      warehouseName: warehouse.warehouse_name,
      location: warehouse.location
    };

    await warehouse.destroy();

    logger.success('Warehouse deleted successfully', warehouseInfo);

    success(res, null, '删除成功');
  } catch (err) {
    logger.error('Warehouse deletion failed', {
      warehouseId: req.params.id,
      error: err.message
    });
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