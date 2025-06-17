<template>
  <div class="login-page">
    <div class="title-box">
      <div class="main-title">随风智能仓储高效管理平台</div>
      <div class="sub-title">统一身份认证系统 - 根据账号权限自动分配访问级别</div>
    </div>
    
    <div class="login-box">
      <div class="login-header">
        <div class="user-icon">
          <div class="icon-user"></div>
        </div>
        <div class="login-title">用户登录</div>
        <div class="login-subtitle">输入账号密码访问系统</div>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <div class="input-label">账号</div>
          <div class="input-wrapper">
            <div class="input-icon user-input-icon"></div>
            <input 
              type="text" 
              v-model="formData.username"
              class="input-field"
              placeholder="请输入您的账号"
            >
          </div>
        </div>
        
        <div class="input-group">
          <div class="input-label">密码</div>
          <div class="input-wrapper">
            <div class="input-icon lock-input-icon"></div>
            <input 
              type="password" 
              v-model="formData.password"
              class="input-field"
              placeholder="请输入您的密码"
            >
          </div>
        </div>
        
        <div class="remember-row">
          <div class="remember-box">
            <input 
              type="checkbox" 
              v-model="formData.rememberMe"
              class="remember-checkbox"
            >
            <div class="remember-text">记住账号</div>
          </div>
          <div class="forget-link">忘记密码？</div>
        </div>
        
        <div class="captcha-group">
          <div class="input-label">验证码</div>
          <div class="captcha-row">
            <div class="input-wrapper">
              <div class="input-icon shield-input-icon"></div>
              <input 
                type="text" 
                v-model="formData.captchaCode"
                class="input-field"
                placeholder="请输入验证码"
              >
            </div>
            <div class="captcha-box" @click="refreshCaptcha">
              <div class="captcha-text">点击刷新</div>
            </div>
          </div>
        </div>
        
        <button type="submit" class="login-button">
          <div class="login-icon"></div>
          <span>登录系统</span>
        </button>
      </form>
      
      <div v-if="loginStatus" class="status-box" :class="loginStatus.type">
        {{ loginStatus.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  
  data() {
    return {
      formData: {
        username: '',
        password: '',
        captchaCode: '',
        rememberMe: false
      },
      loginStatus: null
    }
  },

  methods: {
    refreshCaptcha() {
      console.log('刷新验证码')
    },

    async handleLogin() {
      try {
        console.log('登录信息：', this.formData)
        
        this.loginStatus = {
          type: 'success',
          message: '登录成功，正在跳转...'
        }
        
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1000)
      } catch (error) {
        this.loginStatus = {
          type: 'error',
          message: error.message || '登录失败，请重试'
        }
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  min-height: calc(100vh - 120px);
}

.title-box {
  text-align: center;
  margin-bottom: clamp(20px, 5vw, 40px);
  padding: 0 16px;
}

.main-title {
  font-size: clamp(20px, 5vw, 28px);
  font-weight: bold;
  color: #333;
  margin-bottom: clamp(8px, 2vw, 10px);
  line-height: 1.2;
}

.sub-title {
  font-size: clamp(12px, 3vw, 16px);
  color: #666;
  line-height: 1.4;
}

.login-box {
  width: 100%;
  max-width: min(400px, 90vw);
  background: white;
  border-radius: 8px;
  padding: clamp(20px, 4vw, 30px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.login-header {
  text-align: center;
  margin-bottom: clamp(20px, 4vw, 30px);
}

.user-icon {
  width: clamp(40px, 8vw, 50px);
  height: clamp(40px, 8vw, 50px);
  background: #e6f3ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto clamp(10px, 2vw, 15px);
}

.icon-user {
  width: 24px;
  height: 24px;
  position: relative;
}

.icon-user::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #0070f3;
  border-radius: 50%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.icon-user::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 8px;
  border: 2px solid #0070f3;
  border-radius: 8px 8px 0 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #999;
}

.user-input-icon::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 50%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.user-input-icon::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 5px;
  border: 2px solid currentColor;
  border-radius: 5px 5px 0 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.lock-input-icon::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 2px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.lock-input-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 4px;
  border: 2px solid currentColor;
  border-radius: 2px 2px 0 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.shield-input-icon::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 2px 2px 0 0;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.shield-input-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background: currentColor;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.login-title {
  font-size: clamp(16px, 3vw, 20px);
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.login-subtitle {
  font-size: clamp(12px, 2vw, 14px);
  color: #999;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 20px);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: clamp(12px, 2vw, 14px);
  color: #666;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: clamp(8px, 2vw, 10px) 10px clamp(8px, 2vw, 10px) 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: clamp(12px, 2vw, 14px);
}

.input-field:focus {
  border-color: #0070f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0,112,243,0.2);
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0070f3;
}

.remember-text {
  font-size: clamp(12px, 2vw, 14px);
  color: #666;
}

.forget-link {
  font-size: clamp(12px, 2vw, 14px);
  color: #0070f3;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.forget-link:hover {
  background: rgba(0,112,243,0.1);
}

.captcha-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.captcha-row {
  display: flex;
  gap: 10px;
}

.captcha-box {
  width: clamp(100px, 20vw, 120px);
  height: clamp(36px, 7vw, 40px);
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.captcha-box:hover {
  background: rgba(0,112,243,0.1);
}

.captcha-text {
  font-size: clamp(10px, 1.5vw, 12px);
  color: #666;
}

.login-button {
  width: 100%;
  padding: clamp(10px, 2vw, 12px);
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: clamp(14px, 2vw, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,112,243,0.2);
}

.login-button:hover {
  background: #0060df;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,112,243,0.3);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,112,243,0.2);
}

.login-icon {
  width: 16px;
  height: 16px;
  position: relative;
  margin-right: 8px;
}

.login-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 8px;
  border: 2px solid white;
  border-radius: 2px;
  top: 0;
  left: 0;
}

.login-icon::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 12px;
  border: 2px solid white;
  border-radius: 2px;
  bottom: 0;
  right: 0;
}

.status-box {
  margin-top: clamp(16px, 3vw, 20px);
  padding: clamp(8px, 2vw, 10px);
  border-radius: 4px;
  text-align: center;
  font-size: clamp(12px, 2vw, 14px);
}

.status-box.success {
  background: #e6ffed;
  color: #2ea043;
}

.status-box.error {
  background: #ffe6e6;
  color: #d73a49;
}
</style> 