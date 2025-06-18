/**
 * 日志工具
 */
const fs = require('fs');
const path = require('path');

// 确保日志目录存在
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 格式化时间
const formatTime = () => {
  return new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 格式化对象为JSON字符串
const formatObject = (obj) => {
  if (typeof obj === 'string') {
    return obj;
  }
  
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return String(obj);
  }
};

// 日志级别颜色
const colors = {
  info: '\x1b[36m',    // 青色
  warn: '\x1b[33m',    // 黄色
  error: '\x1b[31m',   // 红色
  success: '\x1b[32m', // 绿色
  reset: '\x1b[0m'     // 重置
};

// 基础日志函数
const log = (level, message, data = null) => {
  const timestamp = formatTime();
  const color = colors[level] || colors.reset;
  
  let logMessage = `${color}[${timestamp}] [${level.toUpperCase()}] ${message}${colors.reset}`;
  
  // 控制台输出
  console.log(logMessage);
  
  // 如果有数据对象，格式化输出
  if (data !== null && data !== undefined) {
    const formattedData = formatObject(data);
    console.log(`${color}${formattedData}${colors.reset}`);
  }
  
  // 写入文件（移除颜色代码）
  const fileMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
  
  let fileContent = fileMessage + '\n';
  if (data !== null && data !== undefined) {
    fileContent += formatObject(data) + '\n';
  }
  
  fs.appendFileSync(logFile, fileContent);
};

// 导出日志方法
const logger = {
  info: (message, data) => log('info', message, data),
  warn: (message, data) => log('warn', message, data),
  error: (message, data) => log('error', message, data),
  success: (message, data) => log('success', message, data),
  
  // API请求日志
  request: (req) => {
    const requestInfo = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined,
      query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
      params: req.params && Object.keys(req.params).length > 0 ? req.params : undefined
    };
    
    log('info', `API Request: ${req.method} ${req.url}`, requestInfo);
  },
  
  // API响应日志
  response: (req, res, data) => {
    const responseInfo = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: res.responseTime ? `${res.responseTime}ms` : undefined,
      dataSize: data ? JSON.stringify(data).length : 0
    };
    
    const level = res.statusCode >= 400 ? 'error' : 'success';
    log(level, `API Response: ${req.method} ${req.url} - ${res.statusCode}`, responseInfo);
  },
  
  // 数据库操作日志
  database: (operation, table, data) => {
    log('info', `Database ${operation}: ${table}`, data);
  }
};

module.exports = logger; 