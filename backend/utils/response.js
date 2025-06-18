/**
 * 统一响应格式工具
 */

// 成功响应
const success = (res, data = null, message = '操作成功') => {
  return res.json({
    code: 200,
    message,
    data
  });
};

// 错误响应
const error = (res, message = '操作失败', code = 500) => {
  return res.status(code).json({
    code,
    message,
    data: null
  });
};

// 参数错误响应
const badRequest = (res, message = '参数错误') => {
  return error(res, message, 400);
};

// 未授权响应
const unauthorized = (res, message = '未授权') => {
  return error(res, message, 401);
};

// 禁止访问响应
const forbidden = (res, message = '禁止访问') => {
  return error(res, message, 403);
};

// 资源不存在响应
const notFound = (res, message = '资源不存在') => {
  return error(res, message, 404);
};

module.exports = {
  success,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound
}; 