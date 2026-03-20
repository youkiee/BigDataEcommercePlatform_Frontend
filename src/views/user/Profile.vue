<template>
  <div class="user-profile">
    <!-- 页面标题 -->
    <el-page-header
      @back="handleBack"
      content="个人画像"
    />
    
    <!-- 基础信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <el-icon><User /></el-icon>
          <span>基础信息</span>
        </div>
      </template>
      <div class="basic-info">
        <el-avatar :size="80" :src="userInfo.avatar || ''"></el-avatar>
        <div class="info-details">
          <h3>{{ userInfo.username }}</h3>
          <div class="info-row">
            <span class="label">会员等级：</span>
            <el-tag type="success">{{ userInfo.memberLevel }}</el-tag>
          </div>
          <div class="info-row">
            <span class="label">注册时间：</span>
            <span>{{ userInfo.registerTime }}</span>
          </div>
          <div class="info-row">
            <span class="label">最近登录：</span>
            <span>{{ userInfo.lastLoginTime }}</span>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 我的标签卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <el-icon><CollectionTag /></el-icon>
          <span>我的标签</span>
        </div>
      </template>
      <div class="tags-container">
        <div class="tag-group">
          <h4>兴趣偏好</h4>
          <div class="tag-list">
            <el-tag v-for="tag in userTags.interests" :key="tag" size="medium">{{ tag }}</el-tag>
          </div>
        </div>
        <div class="tag-group">
          <h4>消费能力</h4>
          <div class="tag-list">
            <el-tag size="medium" type="warning">{{ userTags.consumptionLevel }}</el-tag>
          </div>
        </div>
        <div class="tag-group">
          <h4>活跃度等级</h4>
          <div class="tag-list">
            <el-tag size="medium" type="info">{{ userTags.activityLevel }}</el-tag>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 行为轨迹卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>行为轨迹</span>
        </div>
      </template>
      <div class="activity-timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activityHistory"
            :key="index"
            :timestamp="activity.time"
            :type="getActivityType(activity.type)"
            :icon="getActivityIcon(activity.type)"
          >
            <div class="activity-content">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <img v-if="activity.image" :src="activity.image" alt="活动图片" class="activity-image" />
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
    
    <!-- 风险提示卡片 -->
    <el-card class="profile-card" v-if="hasRiskAlert">
      <template #header>
        <div class="card-header risk-header">
          <el-icon><Warning /></el-icon>
          <span>风险提示</span>
        </div>
      </template>
      <div class="risk-alert">
        <el-alert
          :title="riskAlert.title"
          :description="riskAlert.description"
          type="warning"
          show-icon
        />
        <div class="risk-actions">
          <el-button type="primary" @click="handleRiskAction">立即处理</el-button>
          <el-button @click="dismissRiskAlert">忽略</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { User, CollectionTag, Clock, Warning, View, Star, ShoppingCart, ShoppingBag } from '@element-plus/icons-vue';

const router = useRouter();

// 模拟用户信息
const userInfo = reactive({
  username: '张三',
  avatar: '',
  memberLevel: '黄金会员',
  registerTime: '2023-01-15',
  lastLoginTime: '2024-01-01 10:30:00'
});

// 模拟用户标签
const userTags = reactive({
  interests: ['数码', '美妆', '运动', '美食'],
  consumptionLevel: '中高消费',
  activityLevel: '高活跃'
});

// 模拟行为历史
const activityHistory = ref([
  {
    type: 'browse',
    time: '2024-01-01 10:00:00',
    title: '浏览商品',
    description: '查看了 iPhone 15 Pro Max',
    image: 'https://via.placeholder.com/100'
  },
  {
    type: 'collect',
    time: '2024-01-01 09:30:00',
    title: '收藏商品',
    description: '收藏了 AirPods Pro 2',
    image: 'https://via.placeholder.com/100'
  },
  {
    type: 'cart',
    time: '2024-01-01 09:00:00',
    title: '加入购物车',
    description: '将 MacBook Air M2 加入购物车',
    image: 'https://via.placeholder.com/100'
  },
  {
    type: 'purchase',
    time: '2023-12-31 20:00:00',
    title: '购买商品',
    description: '购买了 Apple Watch Series 9',
    image: 'https://via.placeholder.com/100'
  }
]);

// 风险提示
const hasRiskAlert = ref(true);
const riskAlert = reactive({
  title: '账号异常登录',
  description: '检测到您的账号于 2024-01-01 08:00:00 在异地登录，可能存在安全风险'
});

// 计算属性和方法
const getActivityType = (type) => {
  const typeMap = {
    browse: 'info',
    collect: 'success',
    cart: 'warning',
    purchase: 'primary'
  };
  return typeMap[type] || 'info';
};

const getActivityIcon = (type) => {
  const iconMap = {
    browse: View,
    collect: Star,
    cart: ShoppingCart,
    purchase: ShoppingBag
  };
  return iconMap[type] || View;
};

const handleBack = () => {
  router.back();
};

const handleRiskAction = () => {
  // 跳转到安全中心
  router.push('/user/security');
};

const dismissRiskAlert = () => {
  hasRiskAlert.value = false;
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.risk-header {
  color: #e6a23c;
}

.basic-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.info-details {
  flex: 1;
}

.info-details h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #909399;
  min-width: 80px;
}

.tags-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.tag-group h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.activity-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.activity-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.activity-content p {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.activity-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.risk-alert {
  padding: 10px 0;
}

.risk-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .basic-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tags-container {
    grid-template-columns: 1fr;
  }
}
</style>