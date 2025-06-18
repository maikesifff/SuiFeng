const jwt = require('jsonwebtoken');
const { unauthorized } = require('../utils/response');
const { AuthenticationError } = require('../utils/error');
const { User } = require('../models');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id,
      username: user.username,
      employee_id: user.employee_id
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 验证JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('无效的token');
  }
};

// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('未提供token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // 查找用户
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AuthenticationError('用户不存在');
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    unauthorized(res, error.message);
  }
};

// 角色验证中间件
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('请先登录');
      }

      console.log('当前用户:', req.user.username, '员工ID:', req.user.employee_id);
      console.log('需要的角色:', roles);

      // 获取用户角色
      const userRoles = await req.user.getRoles();
      console.log('用户角色:', userRoles.map(role => role.role_name));
      
      const hasRole = userRoles.some(role => roles.includes(role.role_name));
      console.log('是否有权限:', hasRole);

      if (!hasRole) {
        throw new AuthenticationError('没有权限访问');
      }

      next();
    } catch (error) {
      console.error('权限验证错误:', error);
      unauthorized(res, error.message);
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize
}; 