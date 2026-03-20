<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <el-icon class="error-icon"><Warning /></el-icon>
      <h1>403</h1>
      <h2>您没有权限访问此页面</h2>
      <p>您的角色没有权限访问当前页面，请联系管理员或返回首页</p>
      <div class="forbidden-actions">
        <el-button type="primary" @click="goToHome">返回首页</el-button>
        <el-button @click="goToLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Warning } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const goToHome = () => {
  // 根据用户角色返回对应首页
  if (userStore.userInfo?.role === 'admin') {
    router.push('/admin/dashboard');
  } else {
    router.push('/user/profile');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.forbidden-content {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 64px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.forbidden-content h1 {
  font-size: 48px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 10px 0;
}

.forbidden-content h2 {
  font-size: 24px;
  color: #606266;
  margin: 0 0 20px 0;
}

.forbidden-content p {
  font-size: 14px;
  color: #909399;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.forbidden-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>