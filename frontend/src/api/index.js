import { get, post, put, del } from '@/utils/request';

// 认证相关API
export const authApi = {
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  register: (data) => post('/auth/register', data),
  refreshToken: () => post('/auth/refresh')
};

// 产品相关API
export const productApi = {
  getList: (params) => get('/product', params),
  getById: (id) => get(`/product/${id}`),
  create: (data) => post('/product', data),
  update: (id, data) => put(`/product/${id}`, data),
  delete: (id) => del(`/product/${id}`)
};

// 仓库相关API
export const warehouseApi = {
  getList: (params) => get('/warehouse', params),
  getById: (id) => get(`/warehouse/${id}`),
  create: (data) => post('/warehouse', data),
  update: (id, data) => put(`/warehouse/${id}`, data),
  delete: (id) => del(`/warehouse/${id}`),
  getManagers: () => get('/warehouse/managers/available')
};

// 供应商相关API
export const supplierApi = {
  getList: (params) => get('/supplier', params),
  getById: (id) => get(`/supplier/${id}`),
  create: (data) => post('/supplier', data),
  update: (id, data) => put(`/supplier/${id}`, data),
  delete: (id) => del(`/supplier/${id}`)
};

// 库存相关API
export const inventoryApi = {
  getList: (params) => get('/inventory', params),
  getById: (id) => get(`/inventory/${id}`),
  update: (id, data) => put(`/inventory/${id}`, data),
  getAlerts: (type) => get(`/inventory/alerts/${type}`)
};

// 订单相关API
export const orderApi = {
  getList: (params) => get('/order', params),
  getById: (id) => get(`/order/${id}`),
  create: (data) => post('/order', data),
  update: (id, data) => put(`/order/${id}`, data),
  delete: (id) => del(`/order/${id}`),
  updateStatus: (id, data) => put(`/order/${id}/status`, data),
  cancel: (id) => post(`/order/${id}/cancel`)
};

// 运输相关API
export const transportApi = {
  getList: (params) => get('/transport', params),
  getById: (id) => get(`/transport/${id}`),
  create: (data) => post('/transport', data),
  update: (id, data) => put(`/transport/${id}`, data),
  delete: (id) => del(`/transport/${id}`),
  updateStatus: (id, data) => put(`/transport/${id}/status`, data)
};

// 用户相关API
export const userApi = {
  getList: (params) => get('/users', params),
  getById: (id) => get(`/users/${id}`),
  create: (data) => post('/users', data),
  update: (id, data) => put(`/users/${id}`, data),
  delete: (id) => del(`/users/${id}`),
  getProfile: () => get('/users/profile'),
  updateProfile: (data) => put('/users/profile', data)
};

// 员工相关API
export const employeeApi = {
  getList: (params) => get('/employee', params),
  getById: (id) => get(`/employee/${id}`),
  create: (data) => post('/employee', data),
  update: (id, data) => put(`/employee/${id}`, data),
  delete: (id) => del(`/employee/${id}`),
  getManagers: () => get('/employee/managers')
};

 