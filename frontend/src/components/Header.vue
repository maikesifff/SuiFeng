<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <h1>随风智能仓储管理系统</h1>
      </div>
      <nav class="nav-menu">
        <router-link to="/product" class="nav-item" active-class="active">
          <span>产品管理</span>
        </router-link>
        <router-link to="/warehouse" class="nav-item" active-class="active" v-permission="['系统管理员', '仓库管理员']">
          <span>仓库管理</span>
        </router-link>
        <router-link to="/order/customer" class="nav-item" active-class="active">
          <span>客户订单</span>
        </router-link>
        <router-link to="/order/admin" class="nav-item" active-class="active" v-permission="['系统管理员', '仓库管理员']">
          <span>订单管理</span>
        </router-link>
        <router-link to="/path-planning" class="nav-item" active-class="active">
          <span>路径规划</span>
        </router-link>
      </nav>
      <div class="user-menu">
        <div class="user-info">
          <span>{{ userInfo.username || '用户' }}</span>
          <span class="user-roles" v-if="userInfo.roles && userInfo.roles.length > 0">
            ({{ userInfo.roles.join(', ') }})
          </span>
        </div>
        <button @click="logout" class="logout-btn">退出</button>
      </div>
    </div>
  </header>
</template>

<script>
import { permission } from '@/utils/permission'

export default {
  name: 'AppHeader',
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      this.$router.push('/login')
    }
  },
  mounted() {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
      permission.updateUserRoles(this.userInfo.roles)
    }
  }
}
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo h1 {
  color: #0070f3;
  font-size: 18px;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #0070f3;
}

.nav-item.active {
  background: #e6f3ff;
  color: #0070f3;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 16px;
  color: #333;
  font-size: 14px;
}

.user-roles {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.logout-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #0070f3;
  color: white;
}
</style> 