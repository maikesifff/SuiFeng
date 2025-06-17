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
  // 假设后端返回格式为 { code: number, data: any, message: string }
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
    const { status } = error.response;
    switch (status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
        break;
      case 403:
        console.error('权限不足');
        break;
      case 404:
        console.error('请求的资源不存在');
        break;
      case 500:
        console.error('服务器错误');
        break;
      default:
        console.error('请求失败');
    }
  } else if (error.request) {
    console.error('网络错误，请检查您的网络连接');
  } else {
    console.error('请求配置错误：', error.message);
  }
  return Promise.reject(error);
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