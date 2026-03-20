<template>
  <div class="dashboard-container">
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

    <!-- 核心数据可视化大屏区域 -->
    <main class="main-content">
      <!-- 数据概览卡片 -->
      <div class="stats-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon blue">
                  <el-icon><Money /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">¥1,234,567</div>
                  <div class="stat-label">今日成交额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon green">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">45,678</div>
                  <div class="stat-label">活跃用户</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon orange">
                  <el-icon><ShoppingCart /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">8,921</div>
                  <div class="stat-label">今日订单</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon red">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">23</div>
                  <div class="stat-label">风险预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>实时成交额折线图</span>
                  <el-select v-model="timeRange" size="small" placeholder="选择时间范围">
                    <el-option label="今日" value="today" />
                    <el-option label="本周" value="week" />
                    <el-option label="本月" value="month" />
                  </el-select>
                </div>
              </template>
              <div id="salesChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>用户活跃度分布图</span>
                </div>
              </template>
              <div id="userActivityChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>风险交易实时监控图</span>
                </div>
              </template>
              <div id="riskChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>热门商品推荐榜单</span>
                </div>
              </template>
              <div class="hot-products">
                <div v-for="(product, index) in hotProducts" :key="product.id" class="product-item">
                  <div class="product-rank">{{ index + 1 }}</div>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-sales">销量: {{ product.sales }}</div>
                  </div>
                  <div class="product-trend" :class="product.trend > 0 ? 'up' : 'down'">
                    <el-icon v-if="product.trend > 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    <span>{{ Math.abs(product.trend) }}%</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快捷操作区 -->
      <div class="quick-actions">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="actions-container">
            <el-button type="primary" size="large" @click="createMarketingCampaign">
              <el-icon><Promotion /></el-icon>
              <span>创建营销活动</span>
            </el-button>
            <el-button type="warning" size="large" @click="viewRiskAlerts">
              <el-icon><Warning /></el-icon>
              <span>查看风险预警</span>
            </el-button>
            <el-button type="info" size="large" @click="exportData">
              <el-icon><Download /></el-icon>
              <span>数据导出</span>
            </el-button>
          </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { 
  Shield, House, UserFilled, Promotion, Warning, Setting, Bell, 
  ArrowDown, Money, User, ShoppingCart, Download, ArrowUp, ArrowDown as ArrowDownIcon 
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value.path)
const timeRange = ref('today')

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const createMarketingCampaign = () => {
  router.push('/marketing')
}

const viewRiskAlerts = () => {
  router.push('/risk-control')
}

const exportData = () => {
  ElMessage.success('数据导出成功')
}

const hotProducts = ref([
  { id: 1, name: 'iPhone 15 Pro', sales: 1234, trend: 15 },
  { id: 2, name: 'MacBook Pro 14', sales: 987, trend: 8 },
  { id: 3, name: 'AirPods Pro 2', sales: 876, trend: -2 },
  { id: 4, name: 'iPad Air', sales: 765, trend: 5 },
  { id: 5, name: 'Apple Watch Series 9', sales: 654, trend: 10 }
])

onMounted(() => {
  // 初始化实时成交额折线图
  const salesChart = echarts.init(document.getElementById('salesChart'))
  const salesOption = {
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
        name: '成交额',
        type: 'line',
        data: [120000, 190000, 300000, 500000, 800000, 1000000, 1234567],
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
  salesChart.setOption(salesOption)

  // 初始化用户活跃度分布图
  const userActivityChart = echarts.init(document.getElementById('userActivityChart'))
  const userActivityOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户活跃度',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '高活跃' },
          { value: 25, name: '中活跃' },
          { value: 20, name: '低活跃' },
          { value: 15, name: '不活跃' },
          { value: 5, name: '流失' }
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
  userActivityChart.setOption(userActivityOption)

  // 初始化风险交易实时监控图
  const riskChart = echarts.init(document.getElementById('riskChart'))
  const riskOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '风险交易',
        type: 'bar',
        data: [5, 8, 12, 18, 15, 23],
        itemStyle: {
          color: function(params) {
            const colors = ['#f56c6c', '#e6a23c', '#fadb14', '#67c23a', '#409eff', '#909399']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  riskChart.setOption(riskOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    salesChart.resize()
    userActivityChart.resize()
    riskChart.resize()
  })
}
</script>

<style scoped>
.dashboard-container {
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

/* 数据概览卡片 */
.stats-cards {
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

.stat-icon.blue {
  background-color: #409eff;
}

.stat-icon.green {
  background-color: #67c23a;
}

.stat-icon.orange {
  background-color: #e6a23c;
}

.stat-icon.red {
  background-color: #f56c6c;
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

/* 热门商品榜单 */
.hot-products {
  padding: 10px 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-rank {
  width: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #999;
  text-align: center;
}

.product-item:nth-child(1) .product-rank {
  color: #f56c6c;
}

.product-item:nth-child(2) .product-rank {
  color: #e6a23c;
}

.product-item:nth-child(3) .product-rank {
  color: #fadb14;
}

.product-info {
  flex: 1;
  margin-left: 20px;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

.product-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.product-trend.up {
  color: #f56c6c;
}

.product-trend.down {
  color: #67c23a;
}

/* 快捷操作区 */
.quick-actions {
  margin-bottom: 20px;
}

.actions-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px 0;
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
</style>