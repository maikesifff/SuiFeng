// 加载环境变量
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./utils/logger');
const { error: errorResponse } = require('./utils/response');
const { AppError } = require('./utils/error');

// 路由导入
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 请求日志中间件
app.use(requestLogger);

// 路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 处理
app.use((req, res, next) => {
  next(new AppError('接口不存在', 404));
});

// 错误日志中间件
app.use(errorLogger);

// 错误处理中间件
app.use((err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || '服务器内部错误';
  errorResponse(res, message, statusCode);
});

module.exports = app;
