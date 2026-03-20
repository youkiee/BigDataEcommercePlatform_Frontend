import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      children: [
        {
          path: 'profile',
          name: 'UserProfile',
          component: () => import('../views/user/Profile.vue')
        },
        {
          path: 'recommendation',
          name: 'UserRecommendation',
          component: () => import('../views/user/Recommendation.vue')
        },
        {
          path: 'security',
          name: 'UserSecurity',
          component: () => import('../views/user/Security.vue')
        }
      ]
    },
    // 管理员路由
    {
      path: '/admin',
      name: 'AdminLayout',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/admin/Dashboard.vue')
        },
        {
          path: 'user-profile',
          name: 'AdminUserProfile',
          component: () => import('../views/admin/UserProfile.vue')
        },
        {
          path: 'recommendation',
          name: 'AdminRecommendation',
          component: () => import('../views/admin/Recommendation.vue')
        },
        {
          path: 'risk-control',
          name: 'AdminRiskControl',
          component: () => import('../views/admin/RiskControl.vue')
        },
        {
          path: 'data-security',
          name: 'AdminDataSecurity',
          component: () => import('../views/admin/DataSecurity.vue')
        },
        {
          path: 'system',
          name: 'AdminSystem',
          component: () => import('../views/admin/System.vue')
        }
      ]
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
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false
  const requiredRole = to.meta.role

  // 用户端页面不需要登录
  if (to.path.startsWith('/user/')) {
    next()
    return
  }

  if (requiresAuth) {
    if (!userStore.isLoggedIn) {
      next('/login')
    } else if (requiredRole && userStore.userInfo?.role !== requiredRole) {
      // 无权限，重定向到403页面
      next('/403')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router