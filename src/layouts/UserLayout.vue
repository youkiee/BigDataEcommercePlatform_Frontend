<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="user-header">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon"><Star /></el-icon>
          <span class="logo-text">智营风控平台</span>
        </div>
      </div>
      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small">{{ userStore.userInfo.username.charAt(0).toUpperCase() }}</el-avatar>
              <span class="user-name">{{ userStore.userInfo.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/user/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="navigateTo('/user/security')">账号安全</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="goToLogin">登录</el-button>
          <el-button @click="goToRegister">注册</el-button>
        </template>
      </div>
    </header>

    <!-- 侧边导航 -->
    <aside class="user-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="user-menu"
        router
      >
        <el-menu-item index="/user/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人画像</span>
        </el-menu-item>
        <el-menu-item index="/user/recommendation">
          <el-icon><Star /></el-icon>
          <span>商品推荐</span>
        </el-menu-item>
        <el-menu-item index="/user/security">
          <el-icon><Lock /></el-icon>
          <span>安全中心</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 主内容区域 -->
    <main class="user-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { UserFilled, Star, Lock, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => router.currentRoute.value.path)

const navigateTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.user-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #333;
}

/* 主内容区域 */
.user-content {
  flex: 1;
  display: flex;
  padding: 20px;
  overflow-y: auto;
}

/* 侧边导航 */
.user-sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 200px;
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

.user-menu {
  height: 100%;
  border-right: none;
}

.user-content {
  margin-left: 200px;
  width: calc(100% - 200px);
}

@media (max-width: 768px) {
  .user-sidebar {
    width: 60px;
  }
  
  .user-menu .el-menu-item span {
    display: none;
  }
  
  .user-content {
    margin-left: 60px;
    width: calc(100% - 60px);
  }
}
</style>