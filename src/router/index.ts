import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/auth';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/user/profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  // 普通用户路由
  {
    path: '/user',
    name: 'UserLayout',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'user' },
    children: userRoutes
  },
  // 管理员路由
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: adminRoutes
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/Forbidden.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false;
  const requiredRole = to.meta.role as 'user' | 'admin' | undefined;

  // 用户端页面不需要登录
  if (to.path.startsWith('/user/')) {
    next();
    return;
  }

  if (requiresAuth) {
    if (!authStore.isLoggedIn) {
      next('/login');
    } else if (requiredRole && authStore.role !== requiredRole) {
      // 无权限，重定向到403页面
      next('/403');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
