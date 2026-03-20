<template>
  <div class="data-analysis-container">
    <el-container>
      <el-header>
        <div class="header-left">
          <h1>基于大数据的电商精准营销与风险防控平台</h1>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small">A</el-avatar>
              <span>管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/dashboard">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/marketing">
              <el-icon><Promotion /></el-icon>
              <span>精准营销</span>
            </el-menu-item>
            <el-menu-item index="/risk-control">
              <el-icon><Warning /></el-icon>
              <span>风险防控</span>
            </el-menu-item>
            <el-menu-item index="/data-analysis">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据分析</span>
            </el-menu-item>
            <el-menu-item index="/system">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="data-analysis-content">
            <h2>数据分析</h2>
            <div class="filter-section">
              <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="filterForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="数据类型">
                  <el-select v-model="filterForm.dataType" placeholder="选择数据类型">
                    <el-option label="销售数据" value="sales" />
                    <el-option label="用户数据" value="user" />
                    <el-option label="商品数据" value="product" />
                    <el-option label="订单数据" value="order" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleFilter">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="charts-section">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card shadow="hover">
                    <template #header>
                      <div class="card-header">
                        <span>销售数据趋势</span>
                      </div>
                    </template>
                    <div id="salesTrendChart" class="chart-container"></div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover">
                    <template #header>
                      <div class="card-header">
                        <span>用户增长趋势</span>
                      </div>
                    </template>
                    <div id="userGrowthChart" class="chart-container"></div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="12">
                  <el-card shadow="hover">
                    <template #header>
                      <div class="card-header">
                        <span>商品分类占比</span>
                      </div>
                    </template>
                    <div id="productCategoryChart" class="chart-container"></div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover">
                    <template #header>
                      <div class="card-header">
                        <span>订单状态分布</span>
                      </div>
                    </template>
                    <div id="orderStatusChart" class="chart-container"></div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <div class="data-table">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>数据详情</span>
                  </div>
                </template>
                <el-table :data="dataList" style="width: 100%">
                  <el-table-column prop="id" label="ID" width="100" />
                  <el-table-column prop="name" label="名称" />
                  <el-table-column prop="value" label="数值" />
                  <el-table-column prop="date" label="日期" width="180" />
                  <el-table-column prop="status" label="状态">
                    <template #default="scope">
                      <el-tag :type="scope.row.status === '正常' ? 'success' : 'warning'">{{ scope.row.status }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { House, Promotion, Warning, DataAnalysis, Setting, ArrowDown }
  from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = computed(() => router.currentRoute.value.path)

const handleMenuSelect = (key) => {
  router.push(key)
}

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const filterForm = ref({
  dateRange: [],
  dataType: ''
})

const handleFilter = () => {
  // 模拟筛选功能
  ElMessage.success('筛选成功')
}

const dataList = ref([
  { id: 1, name: '销售额', value: '1,234,567', date: '2024-06-10', status: '正常' },
  { id: 2, name: '用户数', value: '45,678', date: '2024-06-10', status: '正常' },
  { id: 3, name: '订单数', value: '8,921', date: '2024-06-10', status: '正常' },
  { id: 4, name: '商品数', value: '12,345', date: '2024-06-10', status: '正常' },
  { id: 5, name: '风险预警数', value: '23', date: '2024-06-10', status: '警告' }
])

onMounted(() => {
  // 初始化销售数据趋势图表
  const salesTrendChart = echarts.init(document.getElementById('salesTrendChart'))
  const salesTrendOption = {
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
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [120000, 190000, 300000, 500000, 800000, 1200000],
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
  salesTrendChart.setOption(salesTrendOption)

  // 初始化用户增长趋势图表
  const userGrowthChart = echarts.init(document.getElementById('userGrowthChart'))
  const userGrowthOption = {
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
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [5000, 8000, 12000, 15000, 20000, 25000],
        lineStyle: {
          color: '#67c23a'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(103, 194, 58, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(103, 194, 58, 0.1)'
            }
          ])
        }
      }
    ]
  }
  userGrowthChart.setOption(userGrowthOption)

  // 初始化商品分类占比图表
  const productCategoryChart = echarts.init(document.getElementById('productCategoryChart'))
  const productCategoryOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '商品分类',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '电子产品' },
          { value: 25, name: '服装鞋帽' },
          { value: 20, name: '家居用品' },
          { value: 15, name: '食品饮料' },
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
  productCategoryChart.setOption(productCategoryOption)

  // 初始化订单状态分布图表
  const orderStatusChart = echarts.init(document.getElementById('orderStatusChart'))
  const orderStatusOption = {
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
      data: ['待付款', '待发货', '待收货', '已完成', '已取消']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: [1200, 2000, 1500, 4000, 800],
        itemStyle: {
          color: function(params) {
            const colors = ['#f56c6c', '#e6a23c', '#409eff', '#67c23a', '#909399']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }
  orderStatusChart.setOption(orderStatusOption)

  // 响应式处理
  window.addEventListener('resize', () => {
    salesTrendChart.resize()
    userGrowthChart.resize()
    productCategoryChart.resize()
    orderStatusChart.resize()
  })
})
</script>

<style scoped>
.data-analysis-container {
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
}

.el-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.header-left h1 {
  font-size: 20px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin: 0 10px;
}

.el-aside {
  background-color: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 60px);
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.data-analysis-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.filter-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table {
  margin-top: 20px;
}
</style>