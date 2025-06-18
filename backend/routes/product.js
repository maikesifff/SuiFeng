const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product, Warehouse, Inventory, Supplier } = require('../models');
const { success, error } = require('../utils/response');
const { ValidationError } = require('../utils/error');
const { authenticate, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

// 获取产品列表
router.get('/', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const { page = 1, pageSize = 10, keyword, warehouse_id, supplier_id } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${keyword}%` } },
        { product_code: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    if (warehouse_id) {
      where.warehouse_id = warehouse_id;
    }
    
    if (supplier_id) {
      where.supplier_id = supplier_id;
    }

    logger.info('Product list query', {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      keyword: keyword || null,
      warehouse_id: warehouse_id || null,
      supplier_id: supplier_id || null,
      hasFilter: !!(keyword || warehouse_id || supplier_id)
    });

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

    const responseData = {
      total: count,
      list: rows
    };

    logger.success('Product list retrieved', {
      total: count,
      returned: rows.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      filters: {
        keyword: keyword || null,
        warehouse_id: warehouse_id || null,
        supplier_id: supplier_id || null
      }
    });

    success(res, responseData);
  } catch (err) {
    logger.error('Product list retrieval failed', {
      error: err.message,
      query: req.query
    });
    next(err);
  }
});

// 获取产品详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    logger.request(req);
    const productId = req.params.id;

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['warehouse_id', 'warehouse_name', 'location']
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name', 'contact_name', 'contact_phone']
        }
      ]
    });

    if (!product) {
      logger.warn('Product not found', { productId });
      throw new ValidationError('产品不存在');
    }

    logger.success('Product detail retrieved', {
      productId,
      productName: product.product_name,
      hasWarehouse: !!product.warehouse,
      hasSupplier: !!product.supplier
    });

    success(res, product);
  } catch (err) {
    logger.error('Product detail retrieval failed', {
      productId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

// 创建产品
router.post('/', authenticate, authorize('系统管理员', '仓库管理员'), async (req, res, next) => {
  try {
    logger.request(req);
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
    if (!product_name || !product_code || !category || !unit || price === undefined || price === null) {
      logger.warn('Product creation validation failed', {
        missingFields: {
          product_name: !product_name,
          product_code: !product_code,
          category: !category,
          unit: !unit,
          price: price === undefined || price === null
        }
      });
      throw new ValidationError('请填写所有必填字段');
    }

    // 检查产品编码是否已存在
    const existingProduct = await Product.findOne({
      where: { product_code }
    });

    if (existingProduct) {
      logger.warn('Product code already exists', { 
        product_code,
        existingProductId: existingProduct.product_id 
      });
      throw new ValidationError('产品编码已存在');
    }

    const product = await Product.create({
      product_name,
      product_code,
      category,
      specification: specification || null,
      unit,
      price: parseFloat(price),
      warehouse_id: warehouse_id ? parseInt(warehouse_id) : null,
      supplier_id: supplier_id ? parseInt(supplier_id) : null,
      min_quantity: req.body.min_quantity ? parseInt(req.body.min_quantity) : 0,
      max_quantity: req.body.max_quantity ? parseInt(req.body.max_quantity) : 9999,
      status: req.body.status !== undefined ? parseInt(req.body.status) : 1
    });

    logger.success('Product created successfully', {
      productId: product.product_id,
      productName: product.product_name,
      productCode: product.product_code,
      category: product.category,
      warehouseId: warehouse_id,
      supplierId: supplier_id
    });

    success(res, product);
  } catch (err) {
    logger.error('Product creation failed', {
      productData: req.body,
      error: err.message
    });
    next(err);
  }
});

// 更新产品
router.put('/:id', authenticate, authorize('系统管理员', '仓库管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const productId = req.params.id;
    const {
      product_name,
      category,
      specification,
      unit,
      price,
      min_quantity,
      max_quantity,
      status,
      warehouse_id,
      supplier_id
    } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      logger.warn('Product not found for update', { productId });
      throw new ValidationError('产品不存在');
    }

    const oldData = {
      product_name: product.product_name,
      category: product.category,
      specification: product.specification,
      unit: product.unit,
      price: product.price,
      min_quantity: product.min_quantity,
      max_quantity: product.max_quantity,
      status: product.status,
      warehouse_id: product.warehouse_id,
      supplier_id: product.supplier_id
    };

    const updateData = {
      product_name,
      category,
      specification,
      unit,
      price: price !== undefined ? parseFloat(price) : product.price,
      min_quantity: min_quantity !== undefined ? parseInt(min_quantity) : product.min_quantity,
      max_quantity: max_quantity !== undefined ? parseInt(max_quantity) : product.max_quantity,
      status: status !== undefined ? parseInt(status) : product.status,
      warehouse_id: warehouse_id !== undefined ? (warehouse_id ? parseInt(warehouse_id) : null) : product.warehouse_id,
      supplier_id: supplier_id !== undefined ? (supplier_id ? parseInt(supplier_id) : null) : product.supplier_id
    };

    await product.update(updateData);

    logger.success('Product updated successfully', {
      productId,
      productName: product.product_name,
      changes: {
        old: oldData,
        new: updateData
      }
    });

    success(res, product);
  } catch (err) {
    logger.error('Product update failed', {
      productId: req.params.id,
      updateData: req.body,
      error: err.message
    });
    next(err);
  }
});

// 删除产品
router.delete('/:id', authenticate, authorize('系统管理员'), async (req, res, next) => {
  try {
    logger.request(req);
    const productId = req.params.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      logger.warn('Product not found for deletion', { productId });
      throw new ValidationError('产品不存在');
    }

    // 检查是否有库存
    const inventory = await Inventory.findOne({
      where: { product_id: productId }
    });

    if (inventory && inventory.quantity > 0) {
      logger.warn('Product deletion blocked due to inventory', {
        productId,
        productName: product.product_name,
        inventoryQuantity: inventory.quantity
      });
      throw new ValidationError('该产品还有库存，无法删除');
    }

    const productInfo = {
      productId: product.product_id,
      productName: product.product_name,
      productCode: product.product_code
    };

    await product.destroy();

    logger.success('Product deleted successfully', productInfo);

    success(res, null, '删除成功');
  } catch (err) {
    logger.error('Product deletion failed', {
      productId: req.params.id,
      error: err.message
    });
    next(err);
  }
});

module.exports = router; 