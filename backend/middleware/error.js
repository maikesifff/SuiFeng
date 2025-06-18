const { error: errorResponse } = require('../utils/response');
const { logger } = require('../utils/logger');
const { 
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  BusinessError,
  DatabaseError,
  AppError
} = require('../utils/error');

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // 根据错误类型返回不同的状态码
  if (err instanceof ValidationError) {
    return errorResponse(res, err.message, 400);
  }

  if (err instanceof AuthenticationError) {
    return errorResponse(res, err.message, 401);
  }

  if (err instanceof AuthorizationError) {
    return errorResponse(res, err.message, 403);
  }

  if (err instanceof NotFoundError) {
    return errorResponse(res, err.message, 404);
  }

  if (err instanceof BusinessError) {
    return errorResponse(res, err.message, 400);
  }

  if (err instanceof DatabaseError) {
    return errorResponse(res, '数据库操作失败', 500);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.code);
  }

  // 处理未知错误
  return errorResponse(res, '服务器内部错误', 500);
};

// 404处理中间件
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError('接口不存在'));
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 