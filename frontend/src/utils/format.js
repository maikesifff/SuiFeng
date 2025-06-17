// 格式化工具类
export const format = {
  // 格式化日期
  date(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  // 格式化金额
  money(amount, decimals = 2, separator = ',') {
    if (!amount && amount !== 0) return '';
    const num = parseFloat(amount).toFixed(decimals);
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  },

  // 格式化文件大小
  fileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 格式化手机号
  phone(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },

  // 格式化身份证号
  idCard(idCard) {
    if (!idCard) return '';
    return idCard.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2');
  },

  // 格式化银行卡号
  bankCard(cardNo) {
    if (!cardNo) return '';
    return cardNo.replace(/(\d{4})\d+(\d{4})$/, '$1 **** **** $2');
  },

  // 格式化数字（添加千分位）
  number(num) {
    if (!num && num !== 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // 格式化百分比
  percent(num, decimals = 2) {
    if (!num && num !== 0) return '';
    return (num * 100).toFixed(decimals) + '%';
  },

  // 格式化持续时间（秒转时分秒）
  duration(seconds) {
    if (!seconds && seconds !== 0) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (hours > 0) parts.push(String(hours).padStart(2, '0'));
    parts.push(String(minutes).padStart(2, '0'));
    parts.push(String(secs).padStart(2, '0'));
    
    return parts.join(':');
  }
}; 