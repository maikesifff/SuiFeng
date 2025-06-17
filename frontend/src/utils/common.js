// 通用工具类
export const common = {
  // 深拷贝
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    const clone = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = this.deepClone(obj[key]);
      }
    }
    return clone;
  },

  // 防抖函数
  debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },

  // 节流函数
  throttle(fn, delay = 300) {
    let timer = null;
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        fn.apply(this, args);
        lastTime = now;
      } else {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
          lastTime = Date.now();
        }, delay);
      }
    };
  },

  // 生成随机字符串
  randomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // 获取URL参数
  getUrlParams(url = window.location.href) {
    const params = {};
    const search = url.split('?')[1];
    if (!search) return params;
    search.split('&').forEach(item => {
      const [key, value] = item.split('=');
      params[key] = decodeURIComponent(value);
    });
    return params;
  },

  // 生成UUID
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // 获取文件扩展名
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // 判断是否为移动设备
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 判断是否为微信浏览器
  isWeixin() {
    return /MicroMessenger/i.test(navigator.userAgent);
  },

  // 判断是否为iOS设备
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // 判断是否为Android设备
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  },

  // 获取浏览器信息
  getBrowser() {
    const ua = navigator.userAgent;
    const browser = {
      name: 'unknown',
      version: 'unknown'
    };

    if (ua.indexOf('MSIE ') > -1) {
      browser.name = 'IE';
      browser.version = ua.match(/MSIE (\d+)/)[1];
    } else if (ua.indexOf('Firefox/') > -1) {
      browser.name = 'Firefox';
      browser.version = ua.match(/Firefox\/(\d+)/)[1];
    } else if (ua.indexOf('Chrome/') > -1) {
      browser.name = 'Chrome';
      browser.version = ua.match(/Chrome\/(\d+)/)[1];
    } else if (ua.indexOf('Safari/') > -1) {
      browser.name = 'Safari';
      browser.version = ua.match(/Version\/(\d+)/)[1];
    }

    return browser;
  }
}; 