<template>
  <div class="user-security">
    <!-- 页面标题 -->
    <el-page-header
      @back="handleBack"
      content="安全中心"
    />
    
    <!-- 登录设备管理 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Monitor /></el-icon>
          <span>登录设备管理</span>
        </div>
      </template>
      <div class="device-management">
        <h3>当前登录设备</h3>
        <div class="current-device">
          <div class="device-info">
            <el-avatar size="48">
              <el-icon><Monitor /></el-icon>
            </el-avatar>
            <div class="device-details">
              <div class="device-name">MacBook Pro (Chrome)</div>
              <div class="device-location">北京市 - 2024-01-01 10:30:00</div>
            </div>
          </div>
          <el-tag type="success">当前设备</el-tag>
        </div>
        
        <h3 style="margin-top: 20px;">历史登录记录</h3>
        <el-table :data="loginHistory" style="width: 100%">
          <el-table-column prop="device" label="设备" width="200" />
          <el-table-column prop="location" label="登录地点" />
          <el-table-column prop="time" label="登录时间" width="200" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="logoutDevice(scope.row)">
                下线
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 密码修改 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <span>密码修改</span>
        </div>
      </template>
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" class="password-form">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="请确认新密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePassword" :loading="passwordLoading">
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 多因素认证设置 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <span>多因素认证设置</span>
        </div>
      </template>
      <div class="mfa-settings">
        <div class="mfa-item">
          <div class="mfa-info">
            <h4>手机验证</h4>
            <p>开启后，登录时需要验证手机验证码</p>
          </div>
          <el-switch v-model="mfaSettings.phone" @change="toggleMFA('phone')" />
        </div>
        <div class="mfa-item">
          <div class="mfa-info">
            <h4>邮箱验证</h4>
            <p>开启后，登录时需要验证邮箱验证码</p>
          </div>
          <el-switch v-model="mfaSettings.email" @change="toggleMFA('email')" />
        </div>
      </div>
    </el-card>
    
    <!-- 数据授权管理 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据授权管理</span>
        </div>
      </template>
      <div class="data-authorization">
        <div class="auth-item">
          <div class="auth-info">
            <h4>个性化推荐</h4>
            <p>允许平台根据您的行为数据提供个性化推荐</p>
          </div>
          <el-switch v-model="dataAuth.personalizedRecommendation" @change="updateDataAuth" />
        </div>
        <div class="auth-item">
          <div class="auth-info">
            <h4>行为数据收集</h4>
            <p>允许平台收集您的浏览、购买等行为数据</p>
          </div>
          <el-switch v-model="dataAuth.behaviorDataCollection" @change="updateDataAuth" />
        </div>
        <div class="auth-item">
          <div class="auth-info">
            <h4>营销活动通知</h4>
            <p>允许平台向您发送营销活动通知</p>
          </div>
          <el-switch v-model="dataAuth.marketingNotifications" @change="updateDataAuth" />
        </div>
        <el-button type="primary" style="margin-top: 20px;" @click="exportData">
          导出我的数据
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Monitor, Lock, DataAnalysis } from '@element-plus/icons-vue';

const router = useRouter();

// 响应式数据
const passwordFormRef = ref(null);
const passwordLoading = ref(false);

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

// 登录历史
const loginHistory = ref([
  {
    device: 'iPhone 15 Pro',
    location: '上海市',
    time: '2023-12-31 20:00:00'
  },
  {
    device: 'Windows PC (Edge)',
    location: '北京市',
    time: '2023-12-30 15:30:00'
  },
  {
    device: 'iPad Pro',
    location: '广州市',
    time: '2023-12-29 10:00:00'
  }
]);

// 多因素认证设置
const mfaSettings = reactive({
  phone: false,
  email: true
});

// 数据授权设置
const dataAuth = reactive({
  personalizedRecommendation: true,
  behaviorDataCollection: true,
  marketingNotifications: false
});

// 方法
const handleBack = () => {
  router.back();
};

const logoutDevice = (row) => {
  ElMessage.success('设备已下线');
};

const updatePassword = async () => {
  if (!passwordFormRef.value) return;
  
  try {
    await passwordFormRef.value.validate();
    passwordLoading.value = true;
    
    // 模拟密码修改请求
    setTimeout(() => {
      ElMessage.success('密码修改成功');
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
      passwordLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('密码验证失败:', error);
  }
};

const toggleMFA = (type) => {
  ElMessage.success(`${type === 'phone' ? '手机' : '邮箱'}验证已${mfaSettings[type] ? '开启' : '关闭'}`);
};

const updateDataAuth = () => {
  ElMessage.success('数据授权设置已更新');
};

const exportData = () => {
  ElMessage.info('数据导出功能暂未实现');
};
</script>

<style scoped>
.user-security {
  padding: 20px;
}

.security-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.current-device {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-name {
  font-weight: bold;
}

.device-location {
  font-size: 14px;
  color: #606266;
}

.password-form {
  max-width: 500px;
}

.mfa-settings,
.data-authorization {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mfa-item,
.auth-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.mfa-item:last-child,
.auth-item:last-child {
  border-bottom: none;
}

.mfa-info,
.auth-info {
  flex: 1;
}

.mfa-info h4,
.auth-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
}

.mfa-info p,
.auth-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .current-device {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .mfa-item,
  .auth-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .password-form {
    max-width: 100%;
  }
}
</style>