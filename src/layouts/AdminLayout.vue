<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="admin-sidebar">
      <div class="logo">
        <h1>电商精准营销与风险防控平台</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        router
        :unique-opened="true"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><PieChart /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/admin/user-profile">
          <el-icon><User /></el-icon>
          <span>用户画像管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/recommendation">
          <el-icon><MagicStick /></el-icon>
          <span>推荐系统管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/risk-control">
          <el-icon><Warning /></el-icon>
          <span>风险防控中心</span>
        </el-menu-item>
        <el-menu-item index="/admin/data-security">
          <el-icon><Lock /></el-icon>
          <span>数据安全中心</span>
        </el-menu-item>
        <el-menu-item index="/admin/system">
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <el-header height="60px" class="admin-header">
        <div class="header-left">
          <el-button 
            type="text" 
            @click="toggleSidebar"
            class="sidebar-toggle"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small" :src="userAvatar"></el-avatar>
              <span class="user-name">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="admin-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { PieChart, User, MagicStick, Warning, Lock, Setting, Menu, ArrowDown, SwitchButton } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const isSidebarCollapsed = ref(false);

// 计算属性
const activeMenu = computed(() => {
  const path = router.currentRoute.value.path;
  return path;
});

const userName = computed(() => {
  return userStore.userInfo?.username || '管理员';
});

const userAvatar = computed(() => {
  return userStore.userInfo?.avatar || '';
});

// 方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

// 生命周期
onMounted(() => {
  // 确保用户已登录
  if (!userStore.isLoggedIn) {
    router.push('/login');
  }
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  background-color: #1f2329;
  color: #fff;
  transition: width 0.3s;
  overflow-y: auto;
}

.admin-sidebar.collapsed {
  width: 64px !important;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #30363d;
}

.logo h1 {
  font-size: 16px;
  margin: 0;
  color: #fff;
}

.admin-menu {
  margin-top: 20px;
  background-color: transparent;
}

.admin-menu .el-menu-item {
  color: #c9d1d9;
  height: 50px;
  line-height: 50px;
  margin: 0 10px;
  border-radius: 6px;
}

.admin-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.admin-menu .el-menu-item.is-active {
  background-color: #238636;
  color: #fff;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: hidden;
}

.admin-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  margin-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-name {
  margin: 0 10px;
  font-size: 14px;
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>