// 验证工具类
export const validate = {
  // 验证手机号
  isPhone(value) {
    return /^1[3-9]\d{9}$/.test(value);
  },

  // 验证邮箱
  isEmail(value) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  },

  // 验证身份证号
  isIdCard(value) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
  },

  // 验证URL
  isUrl(value) {
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
  },

  // 验证密码强度（至少8位，包含大小写字母和数字）
  isStrongPassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
  },

  // 验证是否为空
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // 验证是否为数字
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // 验证是否为整数
  isInteger(value) {
    return Number.isInteger(Number(value));
  },

  // 验证是否为中文
  isChinese(value) {
    return /^[\u4e00-\u9fa5]+$/.test(value);
  },

  // 验证是否为邮政编码
  isPostalCode(value) {
    return /^[1-9]\d{5}$/.test(value);
  }
}; 