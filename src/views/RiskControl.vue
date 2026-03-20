<template>
  <div class="risk-control-container">
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
      <h2>风险监控中心</h2>
      
      <!-- 风险概览卡片 -->
      <div class="risk-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon red">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">23</div>
                  <div class="stat-label">高风险预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon orange">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">45</div>
                  <div class="stat-label">中风险预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon yellow">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">89</div>
                  <div class="stat-label">低风险预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon green">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">99.2%</div>
                  <div class="stat-label">风险处理率</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 核心图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>风险评分分布图</span>
                </div>
              </template>
              <div id="riskScoreChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>风险事件分类统计</span>
                </div>
              </template>
              <div id="riskCategoryChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 实时交易监控滚动列表 -->
      <div class="transaction-monitor">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>实时交易监控</span>
            </div>
          </template>
          <div class="transaction-list">
            <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item" :class="getTransactionClass(transaction.riskLevel)">
              <div class="transaction-info">
                <div class="transaction-id">交易ID: {{ transaction.id }}</div>
                <div class="transaction-user">用户ID: {{ transaction.userId }}</div>
                <div class="transaction-amount">金额: ¥{{ transaction.amount }}</div>
                <div class="transaction-time">时间: {{ transaction.time }}</div>
              </div>
              <div class="transaction-risk">
                <el-tag :type="getRiskLevelType(transaction.riskLevel)">{{ transaction.riskLevel }}</el-tag>
                <el-button size="small" type="primary" @click="viewRiskDetail(transaction)">查看详情</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 风险规则引擎配置 -->
      <div class="rule-engine">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>风险规则引擎配置</span>
              <el-button type="primary" @click="showRuleDialog = true">
                <el-icon><Plus /></el-icon>
                <span>添加规则</span>
              </el-button>
            </div>
          </template>
          <el-table :data="rules" style="width: 100%">
            <el-table-column prop="id" label="规则ID" width="100" />
            <el-table-column prop="name" label="规则名称" />
            <el-table-column prop="type" label="规则类型">
              <template #default="scope">
                <el-tag :type="getRuleType(scope.row.type)">{{ scope.row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="threshold" label="阈值" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status ? 'success' : 'danger'">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="editRule(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRule(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
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

    <!-- 风险详情弹窗 -->
    <el-dialog
      v-model="showRiskDetailDialog"
      title="风险详情"
      width="600px"
    >
      <div class="risk-detail">
        <div class="detail-item">
          <span class="detail-label">交易ID:</span>
          <span class="detail-value">{{ currentRisk.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">用户ID:</span>
          <span class="detail-value">{{ currentRisk.userId }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">交易金额:</span>
          <span class="detail-value">¥{{ currentRisk.amount }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">交易时间:</span>
          <span class="detail-value">{{ currentRisk.time }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">风险等级:</span>
          <el-tag :type="getRiskLevelType(currentRisk.riskLevel)">{{ currentRisk.riskLevel }}</el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">风险类型:</span>
          <span class="detail-value">{{ currentRisk.riskType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">风险描述:</span>
          <span class="detail-value">{{ currentRisk.description }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">处置建议:</span>
          <span class="detail-value">{{ currentRisk.suggestion }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRiskDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="handleRisk">处理</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 规则管理对话框 -->
    <el-dialog
      v-model="showRuleDialog"
      title="风险规则配置"
      width="600px"
    >
      <el-form :model="ruleForm" label-width="80px">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="ruleForm.type" placeholder="选择规则类型">
            <el-option label="盗号" value="hacking" />
            <el-option label="刷单" value="brushing" />
            <el-option label="套现" value="cashout" />
            <el-option label="异常交易" value="abnormal" />
          </el-select>
        </el-form-item>
        <el-form-item label="阈值">
          <el-input v-model="ruleForm.threshold" type="number" placeholder="请输入阈值"></el-input>
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入规则描述"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRuleDialog = false">取消</el-button>
          <el-button type="primary" @click="saveRule">保存</el-button>
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
  ArrowDown, Check, Plus 
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value.path)

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 实时交易监控数据
const transactions = ref([
  { id: 'TXN123456', userId: 'USER7890', amount: 12000, time: '2024-06-10 14:30:22', riskLevel: '高风险', riskType: '盗号' },
  { id: 'TXN123457', userId: 'USER7891', amount: 5000, time: '2024-06-10 14:29:15', riskLevel: '中风险', riskType: '刷单' },
  { id: 'TXN123458', userId: 'USER7892', amount: 2000, time: '2024-06-10 14:28:08', riskLevel: '低风险', riskType: '异常交易' },
  { id: 'TXN123459', userId: 'USER7893', amount: 8000, time: '2024-06-10 14:27:33', riskLevel: '中风险', riskType: '套现' },
  { id: 'TXN123460', userId: 'USER7894', amount: 15000, time: '2024-06-10 14:26:45', riskLevel: '高风险', riskType: '盗号' }
])

// 风险规则数据
const rules = ref([
  { id: 1, name: '异常登录检测', type: '盗号', threshold: '5', status: true },
  { id: 2, name: '刷单行为检测', type: '刷单', threshold: '10', status: true },
  { id: 3, name: '套现行为检测', type: '套现', threshold: '20', status: false },
  { id: 4, name: '异常交易检测', type: '异常交易', threshold: '15', status: true }
])

// 对话框状态
const showRiskDetailDialog = ref(false)
const showRuleDialog = ref(false)

// 当前风险详情
const currentRisk = ref({})

// 规则表单
const ruleForm = ref({
  name: '',
  type: '',
  threshold: '',
  description: '',
  status: true
})

// 工具函数
const getRiskLevelType = (level) => {
  switch (level) {
    case '高风险': return 'danger'
    case '中风险': return 'warning'
    case '低风险': return 'info'
    default: return 'info'
  }
}

const getTransactionClass = (level) => {
  switch (level) {
    case '高风险': return 'high-risk'
    case '中风险': return 'medium-risk'
    case '低风险': return 'low-risk'
    default: return ''
  }
}

const getRuleType = (type) => {
  switch (type) {
    case '盗号': return 'danger'
    case '刷单': return 'warning'
    case '套现': return 'info'
    case '异常交易': return 'primary'
    default: return 'info'
  }
}

// 操作函数
const viewRiskDetail = (transaction) => {
  currentRisk.value = {
    ...transaction,
    description: '用户在异地登录，IP地址异常，交易金额较大，疑似被盗号',
    suggestion: '立即冻结账户，联系用户确认交易是否本人操作'
  }
  showRiskDetailDialog.value = true
}

const handleRisk = () => {
  ElMessage.success('风险处理成功')
  showRiskDetailDialog.value = false
}

const editRule = (rule) => {
  ruleForm.value = { ...rule }
  showRuleDialog.value = true
}

const deleteRule = (id) => {
  ElMessage.success('规则删除成功')
  rules.value = rules.value.filter(item => item.id !== id)
}

const saveRule = () => {
  ElMessage.success('规则保存成功')
  showRuleDialog.value = false
  ruleForm.value = {
    name: '',
    type: '',
    threshold: '',
    description: '',
    status: true
  }
}

onMounted(() => {
  // 初始化风险评分分布图
  const riskScoreChart = echarts.init(document.getElementById('riskScoreChart'))
  const riskScoreOption = {
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
      data: ['0-20', '21-40', '41-60', '61-80', '81-100']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '风险评分分布',
        type: 'bar',
        data: [120, 80, 60, 40, 23],
        itemStyle: {
          color: function(params) {
            const colors = ['#67c23a', '#e6a23c', '#fadb14', '#f56c6c', '#f56c6c']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  riskScoreChart.setOption(riskScoreOption)

  // 初始化风险事件分类统计图表
  const riskCategoryChart = echarts.init(document.getElementById('riskCategoryChart'))
  const riskCategoryOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '风险事件分类',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '盗号' },
          { value: 25, name: '刷单' },
          { value: 20, name: '套现' },
          { value: 15, name: '异常交易' },
          { value: 5, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  riskCategoryChart.setOption(riskCategoryOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    riskScoreChart.resize()
    riskCategoryChart.resize()
  })
}
</script>

<style scoped>
.risk-control-container {
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

/* 风险概览卡片 */
.risk-stats {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stat-icon.red {
  background-color: #f56c6c;
}

.stat-icon.orange {
  background-color: #e6a23c;
}

.stat-icon.yellow {
  background-color: #fadb14;
}

.stat-icon.green {
  background-color: #67c23a;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 300px;
}

/* 实时交易监控 */
.transaction-monitor {
  margin-bottom: 20px;
}

.transaction-list {
  max-height: 400px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.transaction-item:hover {
  background-color: #f5f7fa;
}

.transaction-item.high-risk {
  border-left: 4px solid #f56c6c;
}

.transaction-item.medium-risk {
  border-left: 4px solid #e6a23c;
}

.transaction-item.low-risk {
  border-left: 4px solid #67c23a;
}

.transaction-info {
  flex: 1;
}

.transaction-id {
  font-weight: bold;
  margin-bottom: 5px;
}

.transaction-user,
.transaction-amount,
.transaction-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}

.transaction-risk {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

/* 风险规则引擎 */
.rule-engine {
  margin-bottom: 20px;
}

/* 风险详情弹窗 */
.risk-detail {
  padding: 20px 0;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.detail-label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.detail-value {
  flex: 1;
  color: #333;
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