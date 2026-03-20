<template>
  <div class="marketing-container">
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
      <h2>营销推荐引擎</h2>
      
      <el-tabs v-model="activeTab">
        <!-- 推荐策略配置 -->
        <el-tab-pane label="推荐策略配置" name="strategy">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>推荐策略管理</span>
                <el-button type="primary" @click="showStrategyDialog = true">
                  <el-icon><Plus /></el-icon>
                  <span>添加策略</span>
                </el-button>
              </div>
            </template>
            <el-table :data="strategies" style="width: 100%">
              <el-table-column prop="id" label="策略ID" width="100" />
              <el-table-column prop="name" label="策略名称" />
              <el-table-column prop="type" label="策略类型">
                <template #default="scope">
                  <el-tag :type="getStrategyType(scope.row.type)">{{ scope.row.type }}</el-tag>
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
                  <el-button size="small" @click="editStrategy(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteStrategy(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 营销活动管理 -->
        <el-tab-pane label="营销活动管理" name="activity">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>营销活动列表</span>
                <el-button type="primary" @click="showActivityDialog = true">
                  <el-icon><Plus /></el-icon>
                  <span>创建活动</span>
                </el-button>
              </div>
            </template>
            <el-table :data="activities" style="width: 100%">
              <el-table-column prop="id" label="活动ID" width="100" />
              <el-table-column prop="name" label="活动名称" />
              <el-table-column prop="type" label="活动类型">
                <template #default="scope">
                  <el-tag :type="getActivityType(scope.row.type)">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="startDate" label="开始时间" width="180" />
              <el-table-column prop="endDate" label="结束时间" width="180" />
              <el-table-column prop="status" label="状态">
                <template #default="scope">
                  <el-tag :type="getActivityStatus(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" @click="viewActivity(scope.row)">查看</el-button>
                  <el-button size="small" type="danger" @click="deleteActivity(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 推送记录列表 -->
        <el-tab-pane label="推送记录列表" name="push">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>推送记录</span>
              </div>
            </template>
            <el-table :data="pushRecords" style="width: 100%">
              <el-table-column prop="id" label="记录ID" width="100" />
              <el-table-column prop="title" label="推送标题" />
              <el-table-column prop="channel" label="推送渠道">
                <template #default="scope">
                  <el-tag :type="getChannelType(scope.row.channel)">{{ scope.row.channel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="target" label="目标用户" />
              <el-table-column prop="sendTime" label="发送时间" width="180" />
              <el-table-column prop="status" label="状态">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button size="small" @click="viewPushRecord(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 效果分析图表 -->
        <el-tab-pane label="效果分析" name="analysis">
          <div class="analysis-charts">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card shadow="hover" class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>点击率趋势</span>
                    </div>
                  </template>
                  <div id="clickRateChart" class="chart-container"></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>转化率对比</span>
                    </div>
                  </template>
                  <div id="conversionRateChart" class="chart-container"></div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="24">
                <el-card shadow="hover" class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>各渠道触达效果</span>
                    </div>
                  </template>
                  <div id="channelEffectChart" class="chart-container"></div>
                </el-card>
              </el-col>
            </el-row>
          </div>
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

    <!-- 策略管理对话框 -->
    <el-dialog
      v-model="showStrategyDialog"
      title="推荐策略配置"
      width="600px"
    >
      <el-form :model="strategyForm" label-width="80px">
        <el-form-item label="策略名称">
          <el-input v-model="strategyForm.name" placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="策略类型">
          <el-select v-model="strategyForm.type" placeholder="选择策略类型">
            <el-option label="协同过滤" value="collaborative" />
            <el-option label="热门推荐" value="popular" />
            <el-option label="新品推荐" value="new" />
            <el-option label="个性化推荐" value="personalized" />
          </el-select>
        </el-form-item>
        <el-form-item label="策略描述">
          <el-input v-model="strategyForm.description" type="textarea" placeholder="请输入策略描述"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="strategyForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showStrategyDialog = false">取消</el-button>
          <el-button type="primary" @click="saveStrategy">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 活动管理对话框 -->
    <el-dialog
      v-model="showActivityDialog"
      title="创建营销活动"
      width="600px"
    >
      <el-form :model="activityForm" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="activityForm.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="activityForm.type" placeholder="选择活动类型">
            <el-option label="优惠券" value="coupon" />
            <el-option label="满减" value="discount" />
            <el-option label="秒杀" value="seckill" />
            <el-option label="限时折扣" value="limited" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="activityForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="activityForm.description" type="textarea" placeholder="请输入活动描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showActivityDialog = false">取消</el-button>
          <el-button type="primary" @click="saveActivity">保存</el-button>
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
const activeTab = ref('strategy')

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 推荐策略数据
const strategies = ref([
  { id: 1, name: '协同过滤推荐', type: '协同过滤', status: true, createTime: '2024-06-01 10:00:00' },
  { id: 2, name: '热门商品推荐', type: '热门推荐', status: true, createTime: '2024-06-02 11:00:00' },
  { id: 3, name: '新品推荐', type: '新品推荐', status: false, createTime: '2024-06-03 12:00:00' },
  { id: 4, name: '个性化推荐', type: '个性化推荐', status: true, createTime: '2024-06-04 13:00:00' }
])

// 营销活动数据
const activities = ref([
  { id: 1, name: '618年中大促', type: '满减', startDate: '2024-06-01', endDate: '2024-06-20', status: '进行中' },
  { id: 2, name: '新用户专享优惠券', type: '优惠券', startDate: '2024-05-15', endDate: '2024-06-15', status: '进行中' },
  { id: 3, name: '会员日秒杀', type: '秒杀', startDate: '2024-05-01', endDate: '2024-05-07', status: '已结束' },
  { id: 4, name: '限时折扣活动', type: '限时折扣', startDate: '2024-06-10', endDate: '2024-06-12', status: '未开始' }
])

// 推送记录数据
const pushRecords = ref([
  { id: 1, title: '618活动预热', channel: '站内信', target: '全体用户', sendTime: '2024-05-25 10:00:00', status: '成功' },
  { id: 2, title: '新用户优惠券', channel: 'APP推送', target: '新用户', sendTime: '2024-05-20 14:00:00', status: '成功' },
  { id: 3, title: '会员专享活动', channel: '短信', target: '会员用户', sendTime: '2024-05-15 09:00:00', status: '失败' },
  { id: 4, title: '限时秒杀提醒', channel: '站内信', target: '活跃用户', sendTime: '2024-05-10 20:00:00', status: '成功' }
])

// 对话框状态
const showStrategyDialog = ref(false)
const showActivityDialog = ref(false)

// 表单数据
const strategyForm = ref({
  name: '',
  type: '',
  description: '',
  status: true
})

const activityForm = ref({
  name: '',
  type: '',
  dateRange: [],
  description: ''
})

// 工具函数
const getStrategyType = (type) => {
  switch (type) {
    case '协同过滤': return 'primary'
    case '热门推荐': return 'success'
    case '新品推荐': return 'warning'
    case '个性化推荐': return 'info'
    default: return 'info'
  }
}

const getActivityType = (type) => {
  switch (type) {
    case '优惠券': return 'primary'
    case '满减': return 'success'
    case '秒杀': return 'warning'
    case '限时折扣': return 'info'
    default: return 'info'
  }
}

const getActivityStatus = (status) => {
  switch (status) {
    case '进行中': return 'success'
    case '已结束': return 'info'
    case '未开始': return 'warning'
    default: return 'info'
  }
}

const getChannelType = (channel) => {
  switch (channel) {
    case '站内信': return 'primary'
    case 'APP推送': return 'success'
    case '短信': return 'warning'
    case '邮件': return 'info'
    default: return 'info'
  }
}

// 操作函数
const editStrategy = (strategy) => {
  strategyForm.value = { ...strategy }
  showStrategyDialog.value = true
}

const deleteStrategy = (id) => {
  ElMessage.success('策略删除成功')
  strategies.value = strategies.value.filter(item => item.id !== id)
}

const saveStrategy = () => {
  ElMessage.success('策略保存成功')
  showStrategyDialog.value = false
  strategyForm.value = {
    name: '',
    type: '',
    description: '',
    status: true
  }
}

const viewActivity = (activity) => {
  ElMessage.info('查看活动详情')
}

const deleteActivity = (id) => {
  ElMessage.success('活动删除成功')
  activities.value = activities.value.filter(item => item.id !== id)
}

const saveActivity = () => {
  ElMessage.success('活动创建成功')
  showActivityDialog.value = false
  activityForm.value = {
    name: '',
    type: '',
    dateRange: [],
    description: ''
  }
}

const viewPushRecord = (record) => {
  ElMessage.info('查看推送记录详情')
}

onMounted(() => {
  // 初始化点击率趋势图表
  const clickRateChart = echarts.init(document.getElementById('clickRateChart'))
  const clickRateOption = {
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
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '点击率',
        type: 'line',
        data: [5.2, 6.8, 8.5, 10.2, 12.5, 15.8],
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
  clickRateChart.setOption(clickRateOption)

  // 初始化转化率对比图表
  const conversionRateChart = echarts.init(document.getElementById('conversionRateChart'))
  const conversionRateOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['协同过滤', '热门推荐', '新品推荐']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '协同过滤',
        type: 'bar',
        data: [2.1, 2.8, 3.5, 4.2, 5.1, 6.2]
      },
      {
        name: '热门推荐',
        type: 'bar',
        data: [1.8, 2.5, 3.2, 3.8, 4.5, 5.2]
      },
      {
        name: '新品推荐',
        type: 'bar',
        data: [1.5, 2.1, 2.8, 3.5, 4.2, 4.8]
      }
    ]
  }
  conversionRateChart.setOption(conversionRateOption)

  // 初始化各渠道触达效果图表
  const channelEffectChart = echarts.init(document.getElementById('channelEffectChart'))
  const channelEffectOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['触达率', '点击率', '转化率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['站内信', 'APP推送', '短信', '邮件']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '触达率',
        type: 'line',
        data: [95, 85, 75, 65],
        smooth: true
      },
      {
        name: '点击率',
        type: 'line',
        data: [15, 25, 10, 8],
        smooth: true
      },
      {
        name: '转化率',
        type: 'line',
        data: [5, 8, 3, 2],
        smooth: true
      }
    ]
  }
  channelEffectChart.setOption(channelEffectOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    clickRateChart.resize()
    conversionRateChart.resize()
    channelEffectChart.resize()
  })
}
</script>

<style scoped>
.marketing-container {
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
.analysis-charts {
  margin-top: 20px;
}

.chart-card {
  height: 100%;
}

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