# 随风智能仓储管理系统

一个基于Vue.js + Express.js + MySQL的现代化仓储管理系统，提供完整的仓库管理、产品管理、订单管理和路径规划功能。

## 🚀 功能特性

### 🔐 用户认证系统
- 多角色登录支持（管理员、仓库管理员、运输调度员、采购员等）
- JWT token认证
- 权限控制和路由守卫

### 📦 产品管理
- 产品信息的增删改查
- 产品分类管理
- 库存状态监控
- 供应商关联管理
- 仓库位置管理

### 🏪 仓库管理  
- 仓库信息维护
- 库存统计和分析
- 仓库容量管理
- 联系人信息管理

### 📋 订单管理
- **客户订单管理**：查看和处理客户订单
- **管理员订单管理**：全面的订单监控和状态管理
- 订单状态流转（待处理→处理中→已发货→已送达→已完成）
- 订单搜索和筛选功能

### 🗺️ 路径规划
- 智能商品定位系统
- 从大门到货架的最短路径规划
- 可视化仓库地图
- 导航步骤指引
- 搜索历史记录

## 🛠️ 技术栈

### 前端
- **Vue.js 3** - 渐进式JavaScript框架
- **Vue Router** - 单页面应用路由
- **Axios** - HTTP客户端
- **Vite** - 快速构建工具

### 后端
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **Sequelize** - ORM数据库操作
- **MySQL** - 关系型数据库
- **JWT** - 身份认证

## 📁 项目结构

```
SuiFeng/
├── backend/                 # 后端服务
│   ├── app.js              # 应用入口
│   ├── config/             # 配置文件
│   ├── models/             # 数据模型
│   ├── routes/             # API路由
│   ├── middleware/         # 中间件
│   ├── migrations/         # 数据库迁移
│   ├── seeders/           # 测试数据
│   └── utils/             # 工具函数
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── views/         # 页面
│   │   ├── router/        # 路由配置
│   │   ├── api/           # API接口
│   │   └── utils/         # 工具函数
│   └── public/            # 静态资源
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- MySQL >= 5.7
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd SuiFeng
```

### 2. 后端设置
```bash
cd backend
npm install

# 配置数据库连接
# 编辑 config/config.json 文件，设置数据库连接信息

# 运行数据库迁移
npx sequelize-cli db:migrate

# 导入测试数据
npx sequelize-cli db:seed:all

# 启动后端服务
npm start
```

### 3. 前端设置
```bash
cd frontend
npm install

# 启动前端开发服务器
npm run dev
```

### 4. 访问应用
- 前端地址：http://localhost:3000
- 后端API：http://localhost:5000

## 👥 测试账号

系统提供了以下测试账号：

| 用户名 | 密码 | 角色 | 权限 |
|--------|------|------|------|
| admin | admin123 | 系统管理员 | 全部权限 |
| manager | manager123 | 仓库管理员 | 仓库管理 |
| warehouse | warehouse123 | 仓库管理员 | 库存管理 |
| transport | transport123 | 运输调度员 | 运输管理 |
| purchase | purchase123 | 采购员 | 采购管理 |
| sales | sales123 | 销售员 | 销售管理 |

## 📊 数据库设计

系统包含以下主要数据表：

- **用户表** (`user`) - 用户账号信息
- **员工表** (`employee`) - 员工基本信息
- **部门表** (`department`) - 组织架构
- **仓库表** (`warehouse`) - 仓库信息
- **供应商表** (`supplier`) - 供应商管理
- **产品表** (`product`) - 产品信息
- **库存表** (`inventory`) - 库存记录
- **订单表** (`order`) - 订单信息
- **配送表** (`delivery`) - 配送记录
- **权限表** (`permission`) - 权限定义
- **角色表** (`role`) - 角色管理

## 🔧 API接口

### 认证接口
- `POST /auth/login` - 用户登录
- `GET /auth/profile` - 获取用户信息
- `PUT /auth/password` - 修改密码

### 产品管理
- `GET /product` - 获取产品列表
- `GET /product/:id` - 获取产品详情
- `POST /product` - 创建产品
- `PUT /product/:id` - 更新产品
- `DELETE /product/:id` - 删除产品

### 仓库管理
- `GET /warehouse` - 获取仓库列表
- `GET /warehouse/:id` - 获取仓库详情
- `POST /warehouse` - 创建仓库
- `PUT /warehouse/:id` - 更新仓库
- `DELETE /warehouse/:id` - 删除仓库

### 订单管理
- `GET /order` - 获取订单列表
- `GET /order/:id` - 获取订单详情
- `POST /order` - 创建订单
- `PUT /order/:id/status` - 更新订单状态
- `POST /order/:id/cancel` - 取消订单

### 库存管理
- `GET /inventory` - 获取库存列表
- `GET /inventory/:id` - 获取库存详情
- `PUT /inventory/:id` - 更新库存

## 🎯 主要功能演示

### 1. 登录系统
使用测试账号登录，系统会根据用户角色自动分配相应权限。

### 2. 产品管理
- 查看产品列表，支持搜索和筛选
- 添加新产品，关联供应商和仓库
- 编辑产品信息
- 查看产品详情和库存状态

### 3. 仓库管理
- 查看所有仓库信息
- 管理仓库基本信息和联系方式
- 监控仓库容量和状态

### 4. 订单处理
- 查看客户订单列表
- 处理订单状态流转
- 管理员可以查看所有订单类型

### 5. 路径规划
- 输入商品名称或编号
- 系统自动查找商品位置
- 生成最短路径和导航指引
- 保存搜索历史

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.0.0 (2025-06-19)
- ✅ 完成用户认证系统
- ✅ 实现产品管理功能
- ✅ 实现仓库管理功能
- ✅ 实现订单管理功能
- ✅ 实现路径规划功能
- ✅ 完成数据库设计和测试数据
- ✅ 实现前后端API对接

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库：[GitHub Repository]
- 邮箱：[your-email@example.com]

---

**随风智能仓储管理系统** - 让仓库管理更智能、更高效！ 🚀 