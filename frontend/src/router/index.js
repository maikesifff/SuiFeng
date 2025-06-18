import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/product.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/edit',
    name: 'ProductEdit',
    component: () => import('../views/product-edit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/detail',
    name: 'ProductDetail',
    component: () => import('../views/product-detail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/customer',
    name: 'OrderCustomer',
    component: () => import('../views/order-customer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/admin',
    name: 'OrderAdmin',
    component: () => import('../views/order-admin.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('../views/warehouse.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/path-planning',
    name: 'PathPlanning',
    component: () => import('../views/path-planning.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 如果是访问登录页
  if (to.path === '/login') {
    if (token) {
      // 已登录，重定向到首页
      next('/product');
    } else {
      // 未登录，允许访问登录页
      next();
    }
    return;
  }

  // 如果是访问需要认证的页面
  if (requiresAuth) {
    if (token) {
      // 已登录，允许访问
      next();
    } else {
      // 未登录，重定向到登录页
      next('/login');
    }
    return;
  }

  // 其他情况正常访问
  next();
})

export default router 