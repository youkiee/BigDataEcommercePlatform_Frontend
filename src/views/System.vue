<template>
  <div class="system-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="logo">
          <el-icon class="logo-icon"><Shield /></el-icon>
          <span class="logo-text">智营风控平台</span>
        </div>
      </div>
      <div class="nav-center">
        <el-menu :default-active="activeMenu" mode="horizontal" router>
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/user-profile">
            <el-icon><UserFilled /></el-icon>
            <span>用户画像</span>
          </el-menu-item>
          <el-menu-item index="/marketing">
            <el-icon><Promotion /></el-icon>
            <span>营销推荐</span>
          </el-menu-item>
          <el-menu-item index="/risk-control">
            <el-icon><Warning /></el-icon>
            <span>风险监控</span>
          </el-menu-item>
          <el-menu-item index="/system">
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="nav-right">
        <el-badge :value="5" class="message-badge">
          <el-button circle>
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
        <el-dropdown>
          <span class="user-info">
            <el-avatar size="small">A</el-avatar>
            <span class="user-name">管理员</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <h2>系统管理后台</h2>
      
      <el-tabs v-model="activeTab">
        <!-- 用户权限管理 -->
        <el-tab-pane label="用户权限管理" name="user">
          <div class="user-permission">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>用户列表</span>
                  <el-button type="primary" @click="showAddUserDialog = true">
                    <el-icon><Plus /></el-icon>
                    <span>添加用户</span>
                  </el-button>
                </div>
              </template>
              <el-table :data="users" style="width: 100%">
                <el-table-column prop="id" label="用户ID" width="100" />
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="role" label="角色">
                  <template #default="scope">
                    <el-tag :type="getRoleType(scope.row.role)">{{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <el-card shadow="hover" style="margin-top: 20px;">
              <template #header>
                <div class="card-header">
                  <span>操作日志</span>
                </div>
              </template>
              <el-table :data="logs" style="width: 100%">
                <el-table-column prop="id" label="日志ID" width="100" />
                <el-table-column prop="operator" label="操作人" />
                <el-table-column prop="action" label="操作内容" />
                <el-table-column prop="time" label="操作时间" width="180" />
                <el-table-column prop="ip" label="IP地址" width="150" />
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- 数据脱敏设置 -->
        <el-tab-pane label="数据脱敏设置" name="data">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>数据脱敏配置</span>
              </div>
            </template>
            <el-form :model="dataMasking" label-width="120px">
              <el-form-item label="手机号脱敏">
                <el-switch v-model="dataMasking.phone"></el-switch>
                <el-input v-model="dataMasking.phoneRule" placeholder="脱敏规则" style="margin-left: 20px; width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="身份证号脱敏">
                <el-switch v-model="dataMasking.idCard"></el-switch>
                <el-input v-model="dataMasking.idCardRule" placeholder="脱敏规则" style="margin-left: 20px; width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号脱敏">
                <el-switch v-model="dataMasking.bankCard"></el-switch>
                <el-input v-model="dataMasking.bankCardRule" placeholder="脱敏规则" style="margin-left: 20px; width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="邮箱脱敏">
                <el-switch v-model="dataMasking.email"></el-switch>
                <el-input v-model="dataMasking.emailRule" placeholder="脱敏规则" style="margin-left: 20px; width: 300px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveDataMasking">保存设置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 接口调用监控 -->
        <el-tab-pane label="接口调用监控" name="api">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>接口调用统计</span>
              </div>
            </template>
            <div id="apiCallChart" class="chart-container"></div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>接口调用记录</span>
              </div>
            </template>
            <el-table :data="apiCalls" style="width: 100%">
              <el-table-column prop="id" label="ID" width="100" />
              <el-table-column prop="api" label="接口路径" />
              <el-table-column prop="method" label="请求方法" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.method === 'GET' ? 'success' : 'primary'">{{ scope.row.method }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态码" width="100" />
              <el-table-column prop="responseTime" label="响应时间(ms)" width="120" />
              <el-table-column prop="time" label="调用时间" width="180" />
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 系统配置项 -->
        <el-tab-pane label="系统配置" name="config">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统配置项</span>
              </div>
            </template>
            <el-form :model="systemConfig" label-width="120px">
              <el-form-item label="系统名称">
                <el-input v-model="systemConfig.systemName" placeholder="请输入系统名称"></el-input>
              </el-form-item>
              <el-form-item label="系统版本">
                <el-input v-model="systemConfig.version" placeholder="请输入系统版本" disabled></el-input>
              </el-form-item>
              <el-form-item label="API地址">
                <el-input v-model="systemConfig.apiUrl" placeholder="请输入API地址"></el-input>
              </el-form-item>
              <el-form-item label="缓存设置">
                <el-select v-model="systemConfig.cache" placeholder="选择缓存策略">
                  <el-option label="内存缓存" value="memory" />
                  <el-option label="Redis" value="redis" />
                  <el-option label="Memcached" value="memcached" />
                </el-select>
              </el-form-item>
              <el-form-item label="日志级别">
                <el-select v-model="systemConfig.logLevel" placeholder="选择日志级别">
                  <el-option label="DEBUG" value="debug" />
                  <el-option label="INFO" value="info" />
                  <el-option label="WARN" value="warn" />
                  <el-option label="ERROR" value="error" />
                </el-select>
              </el-form-item>
              <el-form-item label="备份策略">
                <el-select v-model="systemConfig.backup" placeholder="选择备份策略">
                  <el-option label="每日备份" value="daily" />
                  <el-option label="每周备份" value="weekly" />
                  <el-option label="每月备份" value="monthly" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSystemConfig">保存配置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </main>

    <!-- 底部信息栏 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">帮助中心</a>
          <a href="#">隐私政策</a>
          <a href="#">使用条款</a>
        </div>
        <div class="footer-copyright">
          © 2024 智营风控平台 版权所有
        </div>
      </div>
    </footer>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="showAddUserDialog"
      title="添加用户"
      width="500px"
    >
      <el-form :model="newUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newUser.role" placeholder="选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { 
  Shield, House, UserFilled, Promotion, Warning, Setting, Bell, 
  ArrowDown, Plus 
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value.path)
const activeTab = ref('user')

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 用户数据
const users = ref([
  { id: 1, username: 'admin', role: 'admin', status: true, createTime: '2024-06-01 10:00:00' },
  { id: 2, username: 'user1', role: 'user', status: true, createTime: '2024-06-02 11:00:00' },
  { id: 3, username: 'user2', role: 'user', status: false, createTime: '2024-06-03 12:00:00' }
])

// 操作日志数据
const logs = ref([
  { id: 1, operator: 'admin', action: '登录系统', time: '2024-06-10 14:30:22', ip: '192.168.1.1' },
  { id: 2, operator: 'admin', action: '创建营销活动', time: '2024-06-10 13:45:11', ip: '192.168.1.1' },
  { id: 3, operator: 'user1', action: '查看数据分析', time: '2024-06-10 12:20:33', ip: '192.168.1.2' },
  { id: 4, operator: 'admin', action: '处理风险预警', time: '2024-06-10 11:15:44', ip: '192.168.1.1' }
])

// 接口调用数据
const apiCalls = ref([
  { id: 1, api: '/api/user/list', method: 'GET', status: 200, responseTime: 120, time: '2024-06-10 14:30:22' },
  { id: 2, api: '/api/marketing/create', method: 'POST', status: 200, responseTime: 250, time: '2024-06-10 13:45:11' },
  { id: 3, api: '/api/risk/handle', method: 'POST', status: 200, responseTime: 180, time: '2024-06-10 12:20:33' },
  { id: 4, api: '/api/data/analysis', method: 'GET', status: 200, responseTime: 320, time: '2024-06-10 11:15:44' }
])

// 数据脱敏设置
const dataMasking = ref({
  phone: true,
  phoneRule: '****',
  idCard: true,
  idCardRule: '***********',
  bankCard: true,
  bankCardRule: '************',
  email: true,
  emailRule: '****'
})

// 系统配置
const systemConfig = ref({
  systemName: '基于大数据的电商精准营销与风险防控平台',
  version: '1.0.0',
  apiUrl: 'http://localhost:8080/api',
  cache: 'memory',
  logLevel: 'info',
  backup: 'daily'
})

// 对话框状态
const showAddUserDialog = ref(false)

// 新用户表单
const newUser = ref({
  username: '',
  password: '',
  role: ''
})

// 工具函数
const getRoleType = (role) => {
  return role === 'admin' ? 'primary' : 'info'
}

// 操作函数
const addUser = () => {
  ElMessage.success('用户添加成功')
  showAddUserDialog.value = false
  newUser.value = {
    username: '',
    password: '',
    role: ''
  }
}

const editUser = (user) => {
  ElMessage.info('编辑用户')
}

const deleteUser = (id) => {
  ElMessage.success('用户删除成功')
  users.value = users.value.filter(item => item.id !== id)
}

const saveDataMasking = () => {
  ElMessage.success('数据脱敏设置保存成功')
}

const saveSystemConfig = () => {
  ElMessage.success('系统配置保存成功')
}

onMounted(() => {
  // 初始化接口调用监控图表
  const apiCallChart = echarts.init(document.getElementById('apiCallChart'))
  const apiCallOption = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '接口调用次数',
        type: 'line',
        data: [120, 190, 300, 500, 800, 1000, 1200],
        smooth: true,
        lineStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.1)'
            }
          ])
        }
      }
    ]
  }
  apiCallChart.setOption(apiCallOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    apiCallChart.resize()
  })
}
</script>

<style scoped>
.system-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
}

.nav-left .logo {
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

.nav-center .el-menu {
  border-bottom: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.message-badge {
  margin-right: 10px;
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
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.main-content h2 {
  margin-bottom: 20px;
  color: #333;
}

/* 卡片样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 图表区域 */
.chart-container {
  width: 100%;
  height: 300px;
}

/* 底部信息栏 */
.footer {
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  color: #409eff;
}

.footer-copyright {
  font-size: 14px;
  color: #999;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>