const express = require('express');
const router = express.Router();
const { User, Employee, Department } = require('../models');
const { generateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { ValidationError, AuthenticationError } = require('../utils/error');

// 用户登录
router.post('/login', async (req, res, next) => {
  try {
    console.log('Login request body:', req.body);
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

    console.log('Found user:', user ? 'yes' : 'no');
    if (user) {
      console.log('User details:', {
        id: user.user_id,
        username: user.username,
        employee_id: user.employee_id,
        hasEmployee: !!user.Employee,
        hasDepartment: user.Employee ? !!user.Employee.Department : false
      });
    }

    // 验证用户是否存在
    if (!user) {
      throw new AuthenticationError('用户名或密码错误');
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    console.log('Password validation:', isValidPassword ? 'valid' : 'invalid');

    if (!isValidPassword) {
      throw new AuthenticationError('用户名或密码错误');
    }

    // 生成 token
    const token = generateToken(user);

    // 返回用户信息和 token
    success(res, {
      token,
      user: {
        id: user.user_id,
        username: user.username,
        employee_id: user.employee_id,
        department: user.Employee?.Department?.dept_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
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