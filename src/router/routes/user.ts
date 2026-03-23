import { RouteRecordRaw } from 'vue-router';

const userRoutes: RouteRecordRaw[] = [
  {
    path: 'profile',
    name: 'UserProfile',
    component: () => import('../../views/user/Profile.vue'),
    meta: {
      title: '个人画像',
      icon: 'UserFilled'
    }
  },
  {
    path: 'recommendation',
    name: 'UserRecommendation',
    component: () => import('../../views/user/Recommendation.vue'),
    meta: {
      title: '商品推荐',
      icon: 'Star'
    }
  },
  {
    path: 'security',
    name: 'UserSecurity',
    component: () => import('../../views/user/Security.vue'),
    meta: {
      title: '安全中心',
      icon: 'Lock'
    }
  }
];

export default userRoutes;
