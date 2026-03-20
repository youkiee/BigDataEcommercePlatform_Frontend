import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/user-profile',
      name: 'UserProfile',
      component: () => import('../views/UserProfile.vue')
    },
    {
      path: '/marketing',
      name: 'Marketing',
      component: () => import('../views/Marketing.vue')
    },
    {
      path: '/risk-control',
      name: 'RiskControl',
      component: () => import('../views/RiskControl.vue')
    },
    {
      path: '/system',
      name: 'System',
      component: () => import('../views/System.vue')
    }
  ]
})

export default router