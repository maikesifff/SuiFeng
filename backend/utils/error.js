/**
 * 自定义错误类
 */

// 基础错误类
class AppError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 参数错误
class ValidationError extends AppError {
  constructor(message = '参数验证失败') {
    super(message, 400);
  }
}

// 认证错误
class AuthenticationError extends AppError {
  constructor(message = '认证失败') {
    super(message, 401);
  }
}

// 授权错误
class AuthorizationError extends AppError {
  constructor(message = '没有权限') {
    super(message, 403);
  }
}

// 资源不存在错误
class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(message, 404);
  }
}

// 业务逻辑错误
class BusinessError extends AppError {
  constructor(message = '业务处理失败') {
    super(message, 400);
  }
}

// 数据库错误
class DatabaseError extends AppError {
  constructor(message = '数据库操作失败') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  BusinessError,
  DatabaseError
}; 