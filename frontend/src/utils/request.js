import axios from 'axios';
import { setupInterceptors } from './interceptors';

// 获取当前环境的API地址
const getBaseURL = () => {
  // 在浏览器环境中，获取当前页面的协议和主机
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // 如果是localhost或127.0.0.1，保持原样，否则使用当前主机IP
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    } else {
      return `${protocol}//${hostname}:3000`;
    }
  }
  // 如果不是浏览器环境，使用默认值
  return 'http://localhost:3000';
};

// 创建 axios 实例
const service = axios.create({
  baseURL: getBaseURL(), // 动态获取API基础URL
  timeout: 15000, // 请求超时时间，毫秒
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 设置拦截器
setupInterceptors(service);

// 封装 GET 请求
export const get = (url, params, config = {}) => {
  return service.get(url, { params, ...config });
};

// 封装 POST 请求
export const post = (url, data, config = {}) => {
  return service.post(url, data, config);
};

// 封装 PUT 请求
export const put = (url, data, config = {}) => {
  return service.put(url, data, config);
};

// 封装 DELETE 请求
export const del = (url, params, config = {}) => {
  return service.delete(url, { params, ...config });
};

// 封装上传文件请求
export const upload = (url, file, onProgress, config = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
};

// 封装下载文件请求
export const download = (url, params, filename, config = {}) => {
  return service.get(url, {
    ...config,
    params,
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  });
};

// 导出 axios 实例，以便需要时可以直接使用
export default service; 