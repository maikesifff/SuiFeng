import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/product.vue')
  },
  {
    path: '/product/edit',
    name: 'ProductEdit',
    component: () => import('../views/product-edit.vue')
  },
  {
    path: '/product/detail',
    name: 'ProductDetail',
    component: () => import('../views/product-detail.vue')
  },
  {
    path: '/order/customer',
    name: 'OrderCustomer',
    component: () => import('../views/order-customer.vue')
  },
  {
    path: '/order/admin',
    name: 'OrderAdmin',
    component: () => import('../views/order-admin.vue')
  },
  {
    path: '/path-planning',
    name: 'PathPlanning',
    component: () => import('../views/path-planning.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // TODO: 实现路由守卫逻辑，比如检查用户是否已登录
  next()
})

export default router 