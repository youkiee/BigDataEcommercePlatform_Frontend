import { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'AdminDashboard',
    component: () => import('../../views/admin/Dashboard.vue'),
    meta: {
      title: '数据看板',
      icon: 'TrendCharts'
    }
  },
  {
    path: 'user-profile',
    name: 'AdminUserProfile',
    component: () => import('../../views/admin/UserProfile.vue'),
    meta: {
      title: '用户画像管理',
      icon: 'User'
    }
  },
  {
    path: 'recommendation',
    name: 'AdminRecommendation',
    component: () => import('../../views/admin/Recommendation.vue'),
    meta: {
      title: '推荐系统管理',
      icon: 'MagicStick'
    }
  },
  {
    path: 'risk-control',
    name: 'AdminRiskControl',
    component: () => import('../../views/admin/RiskControl.vue'),
    meta: {
      title: '风险防控中心',
      icon: 'Warning'
    }
  },
  {
    path: 'data-security',
    name: 'AdminDataSecurity',
    component: () => import('../../views/admin/DataSecurity.vue'),
    meta: {
      title: '数据安全中心',
      icon: 'Lock'
    }
  },
  {
    path: 'system',
    name: 'AdminSystem',
    component: () => import('../../views/admin/System.vue'),
    meta: {
      title: '系统管理',
      icon: 'Setting'
    }
  }
];

export default adminRoutes;
