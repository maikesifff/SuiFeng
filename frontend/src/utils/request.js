import axios from 'axios';
import { setupInterceptors } from './interceptors';

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:3000', // 移除API前缀，直接使用后端基础URL
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