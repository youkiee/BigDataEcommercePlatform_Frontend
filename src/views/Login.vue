<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2>电商精准营销与风险防控平台</h2>
        <p>请登录您的账号</p>
      </div>
      
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        class="login-form"
      >
        <!-- 角色选择 -->
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="loginForm.role">
            <el-radio-button label="user">普通用户</el-radio-button>
            <el-radio-button label="admin">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <!-- 账号输入 -->
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入手机号/邮箱"
            prefix-icon="User"
          />
        </el-form-item>
        
        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <!-- 验证码（多因素认证） -->
        <el-form-item label="验证码" prop="verificationCode" v-if="showVerificationCode">
          <div class="verification-code-container">
            <el-input
              v-model="loginForm.verificationCode"
              placeholder="请输入验证码"
              prefix-icon="Message"
            />
            <el-button
              type="primary"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
              class="send-code-btn"
            >
              {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        
        <!-- 记住密码和忘记密码 -->
        <el-form-item class="form-options">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <el-link type="primary" @click="handleForgotPassword">忘记密码？</el-link>
        </el-form-item>
        
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
        
        <!-- 注册链接 -->
        <div class="register-link">
          <span>还没有账号？</span>
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
      
      <!-- 错误提示 -->
      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        class="error-alert"
        @close="errorMsg = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const loginFormRef = ref(null);
const loading = ref(false);
const errorMsg = ref('');
const showVerificationCode = ref(false);
const countdown = ref(0);

// 登录表单
const loginForm = reactive({
  role: 'user',
  username: '',
  password: '',
  verificationCode: '',
  rememberMe: false
});

// 表单验证规则
const loginRules = {
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { length: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
};

// 方法
const handleLogin = async () => {
  // 表单验证
  if (!loginFormRef.value) return;
  
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    errorMsg.value = '';
    
    // 模拟登录请求
    setTimeout(() => {
      // 模拟登录成功
      userStore.login({
        username: loginForm.username,
        role: loginForm.role,
        token: 'mock-token-' + Date.now(),
        avatar: ''
      });
      
      // 根据角色跳转对应首页
      if (loginForm.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/profile');
      }
      
      loading.value = false;
    }, 1000);
  } catch (error) {
    console.error('登录验证失败:', error);
  }
};

const sendVerificationCode = () => {
  // 模拟发送验证码
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
  
  // 显示验证码输入框
  showVerificationCode.value = true;
};

const handleForgotPassword = () => {
  // 跳转到忘记密码页面（暂未实现）
  ElMessage.info('忘记密码功能暂未实现');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-wrapper {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #303133;
  margin: 0 0 10px 0;
}

.login-header p {
  color: #909399;
  margin: 0;
}

.login-form {
  width: 100%;
}

.verification-code-container {
  display: flex;
  gap: 10px;
}

.send-code-btn {
  flex-shrink: 0;
  width: 120px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #909399;
}

.error-alert {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    padding: 20px;
  }
}
</style>