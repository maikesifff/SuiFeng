const express = require('express');
const router = express.Router();
const { Supplier, Product } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// 获取供应商列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { supplier_name: { [Op.like]: `%${keyword}%` } },
        { contact_person: { [Op.like]: `%${keyword}%` } },
        { contact_phone: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Supplier.findAndCountAll({
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

// 获取供应商详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'Products'
        }
      ]
    });

    if (!supplier) {
      throw new ValidationError('供应商不存在');
    }

    success(res, supplier);
  } catch (err) {
    next(err);
  }
});

// 创建供应商
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const {
      supplier_name,
      contact_person,
      contact_phone,
      email,
      address,
      business_license,
      status = 'active',
      notes
    } = req.body;

    // 验证必填字段
    if (!supplier_name || !contact_person || !contact_phone) {
      throw new ValidationError('请填写供应商名称、联系人和联系电话');
    }

    // 检查供应商名称是否已存在
    const existingSupplier = await Supplier.findOne({
      where: { supplier_name }
    });

    if (existingSupplier) {
      throw new ValidationError('供应商名称已存在');
    }

    const supplier = await Supplier.create({
      supplier_name,
      contact_person,
      contact_phone,
      email,
      address,
      business_license,
      status,
      notes
    });

    success(res, supplier);
  } catch (err) {
    next(err);
  }
});

// 更新供应商
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const {
      supplier_name,
      contact_person,
      contact_phone,
      email,
      address,
      business_license,
      status,
      notes
    } = req.body;

    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      throw new ValidationError('供应商不存在');
    }

    // 如果更新供应商名称，检查是否与其他供应商重名
    if (supplier_name && supplier_name !== supplier.supplier_name) {
      const existingSupplier = await Supplier.findOne({
        where: { supplier_name }
      });

      if (existingSupplier) {
        throw new ValidationError('供应商名称已存在');
      }
    }

    await supplier.update({
      supplier_name,
      contact_person,
      contact_phone,
      email,
      address,
      business_license,
      status,
      notes
    });

    success(res, supplier);
  } catch (err) {
    next(err);
  }
});

// 删除供应商
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      throw new ValidationError('供应商不存在');
    }

    // 检查供应商是否有关联的产品
    const productCount = await Product.count({
      where: { supplier_id: req.params.id }
    });

    if (productCount > 0) {
      throw new ValidationError('该供应商存在关联产品，无法删除');
    }

    await supplier.destroy();
    success(res, null, '供应商删除成功');
  } catch (err) {
    next(err);
  }
});

// 获取供应商产品列表
router.get('/:id/products', authenticate, async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      throw new ValidationError('供应商不存在');
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { supplier_id: req.params.id },
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