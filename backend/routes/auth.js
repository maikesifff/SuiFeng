const express = require('express');
const router = express.Router();
const { User, Employee, Department } = require('../models');
const { generateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { ValidationError, AuthenticationError } = require('../utils/error');
const logger = require('../utils/logger');

// 用户登录
router.post('/login', async (req, res, next) => {
  try {
    logger.request(req);
    const { username, password } = req.body;

    // 参数验证
    if (!username || !password) {
      throw new ValidationError('用户名和密码不能为空');
    }

    // 查找用户
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Employee,
          as: 'Employee',
          include: [
            {
              model: Department,
              as: 'Department'
            }
          ]
        }
      ]
    });

    logger.info('User lookup result', {
      found: !!user,
      username: username,
      hasEmployee: user ? !!user.Employee : false,
      hasDepartment: user?.Employee ? !!user.Employee.Department : false
    });

    // 验证用户是否存在
    if (!user) {
      throw new AuthenticationError('用户名或密码错误');
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    logger.info('Password validation', { 
      username: username,
      valid: isValidPassword 
    });

    if (!isValidPassword) {
      throw new AuthenticationError('用户名或密码错误');
    }

    // 生成 token
    const token = generateToken(user);

    // 获取用户角色
    const userRoles = await user.getRoles();
    const roles = userRoles.map(role => role.role_name);

    const responseData = {
      token,
      user: {
        id: user.user_id,
        username: user.username,
        employee_id: user.employee_id,
        department: user.Employee?.Department?.dept_name,
        roles: roles
      }
    };

    logger.success('User login successful', {
      userId: user.user_id,
      username: user.username,
      department: user.Employee?.Department?.dept_name,
      roles: roles
    });

    success(res, responseData);
  } catch (err) {
    logger.error('Login failed', {
      username: req.body?.username,
      error: err.message,
      type: err.constructor.name
    });
    next(err);
  }
});

// 获取当前用户信息
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: User.Employee,
          include: [
            {
              model: User.Employee.Department
            }
          ]
        }
      ]
    });

    if (!user) {
      throw new AuthenticationError('用户不存在');
    }

    success(res, {
      id: user.user_id,
      username: user.username,
      employee_id: user.employee_id,
      department: user.Employee?.Department?.name,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
});

// 修改密码
router.put('/password', async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 参数验证
    if (!oldPassword || !newPassword) {
      throw new ValidationError('旧密码和新密码不能为空');
    }

    const user = await User.findByPk(req.user.id);

    // 验证旧密码
    const isValidPassword = await user.validatePassword(oldPassword);
    if (!isValidPassword) {
      throw new AuthenticationError('旧密码错误');
    }

    // 更新密码
    await user.update({ password: newPassword });

    success(res, null, '密码修改成功');
  } catch (err) {
    next(err);
  }
});

module.exports = router; 