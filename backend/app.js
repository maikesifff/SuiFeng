// 加载环境变量
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { sequelize } = require('./config/database');
const { requestLogger, errorHandler } = require('./middleware/error');
const logger = require('./utils/logger');

// 路由导入
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/product');
const warehouseRouter = require('./routes/warehouse');
const supplierRouter = require('./routes/supplier');
const inventoryRouter = require('./routes/inventory');
const orderRouter = require('./routes/order');
const transportRouter = require('./routes/transport');

const app = express();

// CORS 配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 请求日志中间件
app.use(requestLogger);

// 路由配置
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/warehouse', warehouseRouter);
app.use('/supplier', supplierRouter);
app.use('/inventory', inventoryRouter);
app.use('/order', orderRouter);
app.use('/transport', transportRouter);

// 404 处理
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// 全局错误处理
app.use((err, req, res, next) => {
  logger.error('Application error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params
  });

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500 
    ? 'Internal Server Error' 
    : err.message;

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 数据库连接测试
sequelize.authenticate()
  .then(() => {
    logger.success('Database connection established successfully');
  })
  .catch(err => {
    logger.error('Unable to connect to the database', {
      error: err.message,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
  });

module.exports = app;
