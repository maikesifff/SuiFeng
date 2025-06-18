<template>
  <div class="app-container">
    <Header v-if="showHeader" />
    <main class="main-content" :class="{ 'with-header': showHeader, 'with-footer': showHeader }">
      <router-view></router-view>
    </main>
    <Footer v-if="showHeader" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    showHeader() {
      return this.$route.path !== '/login'
    }
  },
  created() {
    // 确保未登录时清除token
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.main-content.with-header {
  padding-top: 60px;
}

.main-content.with-footer {
  padding-bottom: 70px; /* 与Footer的height匹配 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content.with-footer {
    padding-bottom: 80px; /* 移动端Footer可能更高 */
  }
}
</style>
