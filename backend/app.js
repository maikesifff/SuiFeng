// 加载环境变量
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./utils/logger');
const { error: errorResponse } = require('./utils/response');
const { AppError } = require('./utils/error');

// 路由导入
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const inventoryRouter = require('./routes/inventory');
const warehouseRouter = require('./routes/warehouse');
const supplierRouter = require('./routes/supplier');
const transportRouter = require('./routes/transport');

const app = express();

// CORS 配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // 允许多个前端域名
  credentials: true, // 允许携带凭证
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 请求日志中间件
app.use(requestLogger);

// API 路由
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
app.use(API_PREFIX, indexRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/products`, productRouter);
app.use(`${API_PREFIX}/orders`, orderRouter);
app.use(`${API_PREFIX}/inventory`, inventoryRouter);
app.use(`${API_PREFIX}/warehouses`, warehouseRouter);
app.use(`${API_PREFIX}/suppliers`, supplierRouter);
app.use(`${API_PREFIX}/transport`, transportRouter);

// 404 处理
app.use((req, res, next) => {
  next(new AppError('接口不存在', 404));
});

// 错误日志中间件
app.use(errorLogger);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error details:', JSON.stringify(err, null, 2));
  const statusCode = err.code || 500;
  const message = err.message || '服务器内部错误';
  errorResponse(res, message, statusCode);
});

module.exports = app;
