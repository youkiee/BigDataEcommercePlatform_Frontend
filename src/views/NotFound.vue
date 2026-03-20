<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <el-icon class="error-icon"><CircleClose /></el-icon>
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除，请检查您的链接是否正确</p>
      <div class="not-found-actions">
        <el-button type="primary" @click="goToHome">返回首页</el-button>
        <el-button @click="goToLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { CircleClose } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const goToHome = () => {
  // 根据用户角色返回对应首页
  if (userStore.isLoggedIn) {
    if (userStore.userInfo?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/profile');
    }
  } else {
    router.push('/login');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
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

.not-found-content h1 {
  font-size: 48px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 10px 0;
}

.not-found-content h2 {
  font-size: 24px;
  color: #606266;
  margin: 0 0 20px 0;
}

.not-found-content p {
  font-size: 14px;
  color: #909399;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>