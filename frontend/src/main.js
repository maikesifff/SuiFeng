import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { permissionDirective } from './utils/permission'

const app = createApp(App)

// 注册权限指令
app.directive('permission', permissionDirective)

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  // 配置消息提示框默认持续时间为3秒
  message: {
    duration: 3000
  }
})
app.mount('#app')
