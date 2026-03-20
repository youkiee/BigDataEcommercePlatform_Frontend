<template>
  <div class="user-profile-container">
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
      <h2>用户画像分析</h2>
      
      <!-- 筛选条件 -->
      <div class="filter-section">
        <el-card shadow="hover">
          <el-form :inline="true" :model="filterForm" class="demo-form-inline">
            <el-form-item label="用户群体">
              <el-select v-model="filterForm.userGroup" placeholder="选择用户群体">
                <el-option label="全部用户" value="all" />
                <el-option label="新用户" value="new" />
                <el-option label="活跃用户" value="active" />
                <el-option label="流失风险" value="risk" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 核心图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>用户标签云图</span>
                </div>
              </template>
              <div id="tagCloud" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>用户分层统计图</span>
                </div>
              </template>
              <div id="userLayerChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>用户行为路径图</span>
                </div>
              </template>
              <div id="userPathChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>用户搜索词频分析表</span>
                </div>
              </template>
              <div class="search-frequency">
                <el-table :data="searchKeywords" style="width: 100%">
                  <el-table-column prop="keyword" label="关键词" />
                  <el-table-column prop="frequency" label="搜索频次" />
                  <el-table-column prop="trend" label="趋势">
                    <template #default="scope">
                      <div class="trend" :class="scope.row.trend > 0 ? 'up' : 'down'">
                        <el-icon v-if="scope.row.trend > 0"><ArrowUp /></el-icon>
                        <el-icon v-else><ArrowDown /></el-icon>
                        <span>{{ Math.abs(scope.row.trend) }}%</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 工具区域 -->
      <div class="tools-section">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>画像导出 / 标签管理</span>
            </div>
          </template>
          <div class="tools-container">
            <div class="export-tools">
              <el-button type="primary" @click="exportUserProfile">
                <el-icon><Download /></el-icon>
                <span>导出用户画像</span>
              </el-button>
              <el-button type="info" @click="exportTagData">
                <el-icon><Download /></el-icon>
                <span>导出标签数据</span>
              </el-button>
            </div>
            <div class="tag-management">
              <el-button type="success" @click="showTagDialog = true">
                <el-icon><Plus /></el-icon>
                <span>管理标签</span>
              </el-button>
            </div>
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

    <!-- 标签管理对话框 -->
    <el-dialog
      v-model="showTagDialog"
      title="标签管理"
      width="600px"
    >
      <el-form :model="tagForm" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="tagForm.type" placeholder="选择标签类型">
            <el-option label="用户属性" value="property" />
            <el-option label="行为特征" value="behavior" />
            <el-option label="偏好标签" value="preference" />
            <el-option label="风险标签" value="risk" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签值">
          <el-input v-model="tagForm.value" placeholder="请输入标签值"></el-input>
        </el-form-item>
        <el-form-item label="标签描述">
          <el-input v-model="tagForm.description" type="textarea" placeholder="请输入标签描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTagDialog = false">取消</el-button>
          <el-button type="primary" @click="saveTag">保存</el-button>
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
  ArrowDown, Download, Plus, ArrowUp, ArrowDown as ArrowDownIcon 
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value.path)

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const filterForm = ref({
  userGroup: 'all',
  dateRange: []
})

const handleFilter = () => {
  ElMessage.success('筛选成功')
}

const searchKeywords = ref([
  { keyword: 'iPhone 15', frequency: 1234, trend: 15 },
  { keyword: 'MacBook Pro', frequency: 987, trend: 8 },
  { keyword: 'AirPods Pro', frequency: 876, trend: -2 },
  { keyword: 'iPad Air', frequency: 765, trend: 5 },
  { keyword: 'Apple Watch', frequency: 654, trend: 10 }
])

const showTagDialog = ref(false)
const tagForm = ref({
  name: '',
  type: '',
  value: '',
  description: ''
})

const exportUserProfile = () => {
  ElMessage.success('用户画像导出成功')
}

const exportTagData = () => {
  ElMessage.success('标签数据导出成功')
}

const saveTag = () => {
  ElMessage.success('标签保存成功')
  showTagDialog.value = false
  tagForm.value = {
    name: '',
    type: '',
    value: '',
    description: ''
  }
}

onMounted(() => {
  // 初始化用户标签云图
  const tagCloud = echarts.init(document.getElementById('tagCloud'))
  const tagCloudOption = {
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '80%',
      right: null,
      bottom: null,
      sizeRange: [12, 60],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')'
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: [
        { name: '高价值', value: 100 },
        { name: '价格敏感', value: 80 },
        { name: '母婴偏好', value: 70 },
        { name: '数码爱好者', value: 90 },
        { name: '时尚达人', value: 75 },
        { name: '美食爱好者', value: 65 },
        { name: '旅行爱好者', value: 60 },
        { name: '健身达人', value: 55 },
        { name: '阅读爱好者', value: 50 },
        { name: '游戏玩家', value: 85 },
        { name: '音乐爱好者', value: 60 },
        { name: '电影爱好者', value: 55 },
        { name: '宠物爱好者', value: 45 },
        { name: '汽车爱好者', value: 40 },
        { name: '摄影爱好者', value: 35 }
      ]
    }]
  }
  tagCloud.setOption(tagCloudOption)

  // 初始化用户分层统计图
  const userLayerChart = echarts.init(document.getElementById('userLayerChart'))
  const userLayerOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户分层',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '新用户' },
          { value: 25, name: '活跃用户' },
          { value: 20, name: '高价值用户' },
          { value: 15, name: '流失风险' },
          { value: 5, name: '流失用户' }
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
  userLayerChart.setOption(userLayerOption)

  // 初始化用户行为路径图
  const userPathChart = echarts.init(document.getElementById('userPathChart'))
  const userPathOption = {
    tooltip: {
      trigger: 'item'
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: [
          { name: '首页', symbolSize: 70 },
          { name: '分类页', symbolSize: 50 },
          { name: '商品详情', symbolSize: 60 },
          { name: '购物车', symbolSize: 50 },
          { name: '结算页', symbolSize: 40 },
          { name: '支付页', symbolSize: 40 },
          { name: '订单成功', symbolSize: 50 }
        ],
        links: [
          { source: '首页', target: '分类页', lineStyle: { width: 2 } },
          { source: '首页', target: '商品详情', lineStyle: { width: 3 } },
          { source: '分类页', target: '商品详情', lineStyle: { width: 2 } },
          { source: '商品详情', target: '购物车', lineStyle: { width: 3 } },
          { source: '购物车', target: '结算页', lineStyle: { width: 2 } },
          { source: '结算页', target: '支付页', lineStyle: { width: 2 } },
          { source: '支付页', target: '订单成功', lineStyle: { width: 2 } }
        ],
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4
          }
        }
      }
    ]
  }
  userPathChart.setOption(userPathOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    tagCloud.resize()
    userLayerChart.resize()
    userPathChart.resize()
  })
}
</script>

<style scoped>
.user-profile-container {
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

/* 筛选区域 */
.filter-section {
  margin-bottom: 20px;
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
  height: 400px;
}

/* 搜索词频分析表 */
.search-frequency {
  padding: 10px 0;
}

.trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.trend.up {
  color: #f56c6c;
}

.trend.down {
  color: #67c23a;
}

/* 工具区域 */
.tools-section {
  margin-bottom: 20px;
}

.tools-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.export-tools {
  display: flex;
  gap: 10px;
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