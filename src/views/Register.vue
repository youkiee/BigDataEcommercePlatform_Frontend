<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <div class="register-header">
        <h2>电商精准营销与风险防控平台</h2>
        <p>创建新账号</p>
      </div>
      
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        class="register-form"
      >
        <!-- 手机号/邮箱输入 -->
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="registerForm.account"
            placeholder="请输入手机号或邮箱"
            prefix-icon="User"
          />
        </el-form-item>
        
        <!-- 验证码 -->
        <el-form-item label="验证码" prop="verificationCode">
          <div class="verification-code-container">
            <el-input
              v-model="registerForm.verificationCode"
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
        
        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请设置密码（至少6位）"
            prefix-icon="Lock"
            show-password
          />
          <!-- 密码强度提示 -->
          <div class="password-strength" v-if="registerForm.password">
            <div class="strength-bar">
              <div 
                class="strength-indicator" 
                :class="passwordStrengthClass"
              ></div>
            </div>
            <div class="strength-text">{{ passwordStrengthText }}</div>
          </div>
        </el-form-item>
        
        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefix-icon="Check"
            show-password
          />
        </el-form-item>
        
        <!-- 图形验证码 -->
        <el-form-item label="图形验证码" prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="registerForm.captcha"
              placeholder="请输入图形验证码"
              prefix-icon="Picture"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <img :src="captchaUrl" alt="图形验证码" />
            </div>
          </div>
        </el-form-item>
        
        <!-- 同意协议 -->
        <el-form-item prop="agreeTerms">
          <el-checkbox v-model="registerForm.agreeTerms">
            我已阅读并同意
            <el-link type="primary">《用户协议》</el-link>
            和
            <el-link type="primary">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>
        
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            @click="handleRegister"
            :loading="loading"
          >
            注册
          </el-button>
        </el-form-item>
        
        <!-- 登录链接 -->
        <div class="login-link">
          <span>已有账号？</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
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
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const registerFormRef = ref(null);
const loading = ref(false);
const errorMsg = ref('');
const countdown = ref(0);
const captchaUrl = ref('https://api.dicebear.com/7.x/personas/svg?seed=' + Math.random());

// 注册表单
const registerForm = reactive({
  account: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreeTerms: false
});

// 表单验证规则
const registerRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 简单的手机号或邮箱验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!phoneRegex.test(value) && !emailRegex.test(value)) {
          callback(new Error('请输入正确的手机号或邮箱'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { length: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '请输入图形验证码', trigger: 'blur' }
  ],
  agreeTerms: [
    { required: true, message: '请阅读并同意用户协议和隐私政策', trigger: 'change' }
  ]
};

// 计算属性：密码强度
const passwordStrength = computed(() => {
  const password = registerForm.password;
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 5);
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return '';
  if (strength <= 2) return '弱';
  if (strength <= 3) return '中';
  return '强';
});

// 方法
const handleRegister = async () => {
  // 表单验证
  if (!registerFormRef.value) return;
  
  try {
    await registerFormRef.value.validate();
    loading.value = true;
    errorMsg.value = '';
    
    // 模拟注册请求
    setTimeout(() => {
      // 模拟注册成功
      ElMessage.success('注册成功，请登录');
      router.push('/login');
      loading.value = false;
    }, 1000);
  } catch (error) {
    console.error('注册验证失败:', error);
  }
};

const sendVerificationCode = () => {
  // 验证账号格式
  if (!registerForm.account) {
    ElMessage.warning('请输入手机号或邮箱');
    return;
  }
  
  // 模拟发送验证码
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
  
  ElMessage.success('验证码已发送');
};

const refreshCaptcha = () => {
  captchaUrl.value = 'https://api.dicebear.com/7.x/personas/svg?seed=' + Math.random();
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form-wrapper {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #303133;
  margin: 0 0 10px 0;
}

.register-header p {
  color: #909399;
  margin: 0;
}

.register-form {
  width: 100%;
}

.verification-code-container,
.captcha-container {
  display: flex;
  gap: 10px;
}

.send-code-btn {
  flex-shrink: 0;
  width: 120px;
}

.captcha-image {
  flex-shrink: 0;
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-indicator {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background-color 0.3s;
}

.strength-indicator.weak {
  width: 20%;
  background-color: #f56c6c;
}

.strength-indicator.medium {
  width: 60%;
  background-color: #e6a23c;
}

.strength-indicator.strong {
  width: 100%;
  background-color: #67c23a;
}

.strength-text {
  font-size: 12px;
  color: #909399;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #909399;
}

.error-alert {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .register-form-wrapper {
    width: 90%;
    padding: 20px;
  }
}
</style>