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
  getList: (params) => get('/products', params),
  getById: (id) => get(`/products/${id}`),
  create: (data) => post('/products', data),
  update: (id, data) => put(`/products/${id}`, data),
  delete: (id) => del(`/products/${id}`)
};

// 仓库相关API
export const warehouseApi = {
  getList: (params) => get('/warehouses', params),
  getById: (id) => get(`/warehouses/${id}`),
  create: (data) => post('/warehouses', data),
  update: (id, data) => put(`/warehouses/${id}`, data),
  delete: (id) => del(`/warehouses/${id}`)
};

// 供应商相关API
export const supplierApi = {
  getList: (params) => get('/suppliers', params),
  getById: (id) => get(`/suppliers/${id}`),
  create: (data) => post('/suppliers', data),
  update: (id, data) => put(`/suppliers/${id}`, data),
  delete: (id) => del(`/suppliers/${id}`)
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
  getList: (params) => get('/orders', params),
  getById: (id) => get(`/orders/${id}`),
  create: (data) => post('/orders', data),
  update: (id, data) => put(`/orders/${id}`, data),
  delete: (id) => del(`/orders/${id}`),
  updateStatus: (id, data) => put(`/orders/${id}/status`, data)
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

 