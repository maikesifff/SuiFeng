import axios from 'axios';

// 请求拦截器
const requestInterceptor = (config) => {
  // token 自动注入
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// 请求错误拦截器
const requestErrorInterceptor = (error) => {
  console.error('请求错误：', error);
  return Promise.reject(error);
};

// 响应拦截器
const responseInterceptor = (response) => {
  const { data } = response;
  // 适配后端返回格式 { code: number, data: any, message: string }
  if (data.code === 200) {
    return data.data;
  }
  if (data.code === 401) {
    // token 过期或未登录
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
    return Promise.reject(new Error('未登录或登录已过期'));
  }
  return Promise.reject(new Error(data.message || '请求失败'));
};

// 响应错误拦截器
const responseErrorInterceptor = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // 区分认证失败和权限不足
        if (data?.message?.includes('权限') || data?.message?.includes('没有权限')) {
          // 权限不足，只返回错误信息，不跳转登录页
          return Promise.reject(new Error('您没有权限执行此操作'));
        }
        // 认证失败（token过期等），跳转登录页
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        }
        return Promise.reject(new Error('用户名或密码错误'));
      case 403:
        return Promise.reject(new Error('您没有权限执行此操作'));
      case 404:
        return Promise.reject(new Error('请求的资源不存在'));
      case 500:
        return Promise.reject(new Error('服务器内部错误，请稍后重试'));
      default:
        return Promise.reject(new Error(data?.message || '请求失败，请稍后重试'));
    }
  } else if (error.request) {
    return Promise.reject(new Error('网络连接失败，请检查您的网络设置'));
  } else {
    return Promise.reject(new Error('请求配置错误，请稍后重试'));
  }
};

// 设置拦截器
export const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );
  axiosInstance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  );
}; 