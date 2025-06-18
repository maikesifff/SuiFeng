const { badRequest } = require('../utils/response');
const { ValidationError } = require('../utils/error');

// 通用验证中间件
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }
      next();
    } catch (error) {
      badRequest(res, error.message);
    }
  };
};

// 分页参数验证
const validatePagination = (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      throw new ValidationError('页码必须是大于0的整数');
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('每页数量必须是1-100之间的整数');
    }

    req.query.page = pageNum;
    req.query.limit = limitNum;
    next();
  } catch (error) {
    badRequest(res, error.message);
  }
};

// ID参数验证
const validateId = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      throw new ValidationError('无效的ID参数');
    }
    req.params.id = id;
    next();
  } catch (error) {
    badRequest(res, error.message);
  }
};

module.exports = {
  validate,
  validatePagination,
  validateId
}; 