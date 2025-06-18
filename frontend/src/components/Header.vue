<template>
  <header class="header">
    <div class="header-content">
      <div class="logo-box">
        <div class="logo-icon"></div>
        <h1 class="logo-text">随风网吧</h1>
        <span class="logo-tag">智能仓储</span>
      </div>
      <nav class="nav-menu">
        <a href="#" class="nav-link">联系我们</a>
      </nav>
      <div class="user-info">
        <template v-if="isLoggedIn && userInfo">
          <span class="username">{{ userInfo.username }}</span>
          <el-button type="text" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="goToLogin">登录</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: false,
      userInfo: null
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    handleLogout() {
      // 清除登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // 更新状态
      this.isLoggedIn = false;
      this.userInfo = null;
      // 跳转到登录页
      this.$router.push('/login');
    },
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      this.isLoggedIn = !!token;
      this.userInfo = userInfo ? JSON.parse(userInfo) : null;
    }
  },
  created() {
    this.checkLoginStatus();
  },
  watch: {
    // 监听路由变化，更新登录状态
    '$route': {
      handler() {
        this.checkLoginStatus();
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-icon {
  width: 24px;
  height: 24px;
  position: relative;
  transform: rotate(-15deg);
}

.logo-icon::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0070f3;
  transform: skewX(-15deg);
}

.logo-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0070f3;
  transform: skewY(15deg);
  opacity: 0.7;
}

.logo-text {
  font-size: clamp(16px, 4vw, 20px);
  font-weight: bold;
  color: #212121;
  margin: 0;
  white-space: nowrap;
}

.logo-tag {
  font-size: clamp(10px, 2vw, 12px);
  background-color: rgba(0,112,243,0.1);
  color: #0070f3;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #757575;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
  padding: 6px 12px;
  border-radius: 4px;
}

.nav-link:hover {
  color: #0070f3;
  background: rgba(0,112,243,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: #666;
  font-size: 14px;
}

.el-button--text {
  color: #409EFF;
}

.el-button--text:hover {
  color: #66b1ff;
}
</style> 