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
        <a href="#" class="footer-link" title="电话" @click.prevent="showContact">
          <div class="link-icon phone-icon">
            <div class="icon-phone"></div>
          </div>
        </a>
        <a href="#" class="footer-link" title="邮件" @click.prevent="showEmail">
          <div class="link-icon mail-icon">
            <div class="icon-envelope"></div>
          </div>
        </a>
        <a href="#" class="footer-link" title="帮助" @click.prevent="showHelp">
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
  name: 'Footer',
  methods: {
    showContact() {
      alert(`📞 联系我们

客服热线：400-888-8888
技术支持：010-12345678
工作时间：周一至周五 9:00-18:00

如需紧急技术支持，请拨打24小时热线：
400-999-9999`)
    },
    
    showEmail() {
      alert(`📧 邮件联系

商务合作：business@suifeng.com
技术支持：support@suifeng.com
意见反馈：feedback@suifeng.com

我们会在24小时内回复您的邮件
感谢您使用随风智能仓储管理系统！`)
    },
    
    showHelp() {
      alert(`❓ 帮助中心

🔹 快速入门
• 登录系统后，可在产品管理中查看所有产品信息
• 仓库管理员可以管理仓库和库存
• 系统管理员拥有所有权限

🔹 常见问题
• 忘记密码：请联系系统管理员重置
• 权限不足：请确认您的角色权限
• 数据异常：请检查网络连接或联系技术支持

🔹 操作指南
• 产品管理：查看、编辑、删除产品信息
• 订单管理：处理订单状态流转
• 仓库管理：管理仓库信息和库存

如需更多帮助，请联系技术支持！`)
    }
  }
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
  height: 70px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
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
  gap: 12px;
}

.footer-link {
  color: #9e9e9e;
  text-decoration: none;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
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
  width: 18px;
  height: 18px;
  position: relative;
}

/* 手机图标 */
.phone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-phone {
  width: 10px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;
}

.icon-phone::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 1px;
  transform: translateX(-50%);
  width: 3px;
  height: 1px;
  background: currentColor;
  border-radius: 1px;
}

.icon-phone::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 1px;
  transform: translateX(-50%);
  width: 4px;
  height: 1px;
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
  width: 16px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.icon-envelope::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  border-bottom: 1px solid currentColor;
  transform: translateY(-1px);
}

.icon-envelope::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid currentColor;
}

/* 帮助图标 */
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.icon-question-mark::before {
  content: '?';
  color: currentColor;
  line-height: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    padding: 8px 12px;
    flex-direction: column;
    gap: 8px;
  }
  
  .footer {
    height: auto;
    min-height: 60px;
  }
  
  .footer-info {
    align-items: center;
    text-align: center;
  }
  
  .footer-links {
    gap: 8px;
  }
  
  .footer-link {
    width: 28px;
    height: 28px;
  }
  
  .link-icon {
    width: 16px;
    height: 16px;
  }
}
</style> 