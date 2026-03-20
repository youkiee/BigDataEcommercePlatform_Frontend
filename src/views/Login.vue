<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-form-wrapper">
      <div class="login-form">
        <div class="form-header">
          <h2>智营风控平台</h2>
          <p>基于大数据的电商精准营销与风险防控平台</p>
        </div>
        <div class="form-tabs">
          <el-tabs v-model="activeTab" class="login-tabs">
            <el-tab-pane label="登录" name="login">
              <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
                <el-form-item label="用户名/手机号">
                  <el-input v-model="loginForm.username" placeholder="请输入用户名或手机号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="验证码" v-if="showCaptcha">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <el-input v-model="loginForm.captcha" placeholder="请输入验证码"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <div class="captcha-image">
                        <img src="https://picsum.photos/120/40" alt="验证码" @click="refreshCaptcha" />
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <div class="form-options">
                    <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
                    <el-link type="primary" @click="handleForgotPassword">忘记密码</el-link>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register">
              <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="80px">
                <el-form-item label="用户名">
                  <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-button type="primary" @click="sendSmsCode" :disabled="smsDisabled">发送验证码</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="验证码">
                  <el-input v-model="registerForm.smsCode" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="registerForm.agree">我已阅读并同意<a href="#" class="agreement-link">用户协议</a>和<a href="#" class="agreement-link">隐私政策</a></el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleRegister" style="width: 100%">注册</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="third-party-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="third-party-buttons">
            <el-button circle>
              <el-icon><ChatLineRound /></el-icon>
            </el-button>
            <el-button circle>
              <el-icon><Github /></el-icon>
            </el-button>
            <el-button circle>
              <el-icon><OfficeBuilding /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatLineRound, Github, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('login')
const showCaptcha = ref(false)
const smsDisabled = ref(false)
const smsCountdown = ref(60)

// 登录表单
const loginForm = ref({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名或手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

// 注册表单
const registerForm = ref({
  username: '',
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  smsCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  agree: [
    { required: true, message: '请阅读并同意用户协议和隐私政策', trigger: 'change' }
  ]
}

const handleLogin = () => {
  // 模拟登录验证
  if (loginForm.value.username === 'admin' && loginForm.value.password === '123456') {
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    ElMessage.error('用户名或密码错误')
    // 显示验证码
    showCaptcha.value = true
  }
}

const handleRegister = () => {
  // 模拟注册
  if (registerForm.value.agree) {
    ElMessage.success('注册成功')
    activeTab.value = 'login'
  } else {
    ElMessage.error('请阅读并同意用户协议和隐私政策')
  }
}

const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中')
}

const refreshCaptcha = () => {
  // 模拟刷新验证码
  ElMessage.success('验证码已刷新')
}

const sendSmsCode = () => {
  // 模拟发送验证码
  ElMessage.success('验证码已发送')
  smsDisabled.value = true
  
  // 倒计时
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
      smsDisabled.value = false
      smsCountdown.value = 60
    }
  }, 1000)
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.login-form-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-form {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.form-header p {
  font-size: 14px;
  color: #666;
}

.login-tabs {
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.captcha-image {
  text-align: center;
  cursor: pointer;
}

.captcha-image img {
  border-radius: 4px;
}

.third-party-login {
  margin-top: 30px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}

.divider span {
  position: relative;
  background-color: white;
  padding: 0 20px;
  z-index: 2;
  font-size: 14px;
  color: #999;
}

.third-party-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.third-party-buttons .el-button {
  border-color: #d9d9d9;
  color: #666;
}

.third-party-buttons .el-button:hover {
  border-color: #409eff;
  color: #409eff;
}

.agreement-link {
  color: #409eff;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-form {
    padding: 30px 20px;
  }
}
</style>