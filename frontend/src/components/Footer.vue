<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <div class="footer-logo">
          <div class="icon-cube"></div>
          <span>随风智能仓储</span>
        </div>
        <div class="footer-copyright">
          © 2025 随风网吧. 智能仓储高效管理平台 版权所有
        </div>
      </div>
      
      <div class="footer-links">
        <a href="#" class="footer-link" title="电话">
          <div class="link-icon phone-icon">
            <div class="icon-phone"></div>
          </div>
        </a>
        <a href="#" class="footer-link" title="邮件">
          <div class="link-icon mail-icon">
            <div class="icon-envelope"></div>
          </div>
        </a>
        <a href="#" class="footer-link" title="帮助">
          <div class="link-icon help-icon">
            <div class="icon-question-mark"></div>
          </div>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: white;
  border-top: 1px solid #e0e0e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-cube {
  width: 14px;
  height: 14px;
  position: relative;
  transform: rotate(-15deg);
}

.icon-cube::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0070f3;
  transform: skewX(-15deg);
}

.icon-cube::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0070f3;
  transform: skewY(15deg);
  opacity: 0.7;
}

.footer-logo span {
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 500;
  color: #212121;
  white-space: nowrap;
}

.footer-copyright {
  font-size: clamp(8px, 1.5vw, 10px);
  color: #9e9e9e;
  white-space: nowrap;
}

.footer-links {
  display: flex;
  gap: 16px;
}

.footer-link {
  color: #9e9e9e;
  text-decoration: none;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #f5f5f5;
}

.footer-link:hover {
  background: rgba(0,112,243,0.1);
}

.link-icon {
  width: 20px;
  height: 20px;
  position: relative;
}

/* 手机图标 */
.phone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-phone {
  width: 12px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;
}

.icon-phone::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translateX(-50%);
  width: 4px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.icon-phone::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
  width: 6px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

/* 邮件图标 */
.mail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-envelope {
  width: 18px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.icon-envelope::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  height: 8px;
  border: 2px solid currentColor;
  border-bottom: none;
  transform: rotate(180deg);
  transform-origin: center top;
}

.icon-envelope::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
}

/* 问号图标 */
.help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-question-mark {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  position: relative;
}

.icon-question-mark::before {
  content: '?';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  line-height: 1;
  font-weight: bold;
  color: currentColor;
}

@media (min-width: 640px) {
  .footer-content {
    padding: 16px 24px;
  }
}
</style> 