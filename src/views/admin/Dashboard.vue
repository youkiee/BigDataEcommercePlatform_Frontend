<template>
  <div class="admin-dashboard">
    <!-- 页面标题 -->
    <el-page-header
      content="数据看板"
    />
    
    <!-- 关键指标卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.gmv.toLocaleString() }}</div>
          <div class="stat-label">GMV</div>
        </div>
        <div class="stat-icon success">
          <el-icon><TrendCharts /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.userCount.toLocaleString() }}</div>
          <div class="stat-label">用户总数</div>
        </div>
        <div class="stat-icon primary">
          <el-icon><UserFilled /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.orderCount.toLocaleString() }}</div>
          <div class="stat-label">订单总数</div>
        </div>
        <div class="stat-icon info">
          <el-icon><ShoppingBag /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.riskCount }}</div>
          <div class="stat-label">风险交易数</div>
        </div>
        <div class="stat-icon warning">
          <el-icon><Warning /></el-icon>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.recommendationRate }}%</div>
          <div class="stat-label">推荐转化率</div>
        </div>
        <div class="stat-icon danger">
          <el-icon><MagicStick /></el-icon>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 实时交易趋势图 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <el-icon><Timer /></el-icon>
            <span>实时交易趋势</span>
          </div>
        </template>
        <div class="chart-container">
          <canvas ref="tradeChart"></canvas>
        </div>
      </el-card>
      
      <!-- 用户活跃度分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <el-icon><PieChart /></el-icon>
            <span>用户活跃度分布</span>
          </div>
        </template>
        <div class="chart-container">
          <canvas ref="activityChart"></canvas>
        </div>
      </el-card>
      
      <!-- 推荐效果概览 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <el-icon><MagicStick /></el-icon>
            <span>推荐效果概览</span>
          </div>
        </template>
        <div class="chart-container">
          <canvas ref="recommendationChart"></canvas>
        </div>
      </el-card>
      
      <!-- 风险监控动态 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <el-icon><Warning /></el-icon>
            <span>风险监控动态</span>
          </div>
        </template>
        <div class="risk-monitor">
          <el-scrollbar height="200px">
            <div v-for="(risk, index) in riskEvents" :key="index" class="risk-item">
              <div class="risk-time">{{ risk.time }}</div>
              <div class="risk-content">
                <el-tag :type="risk.level === 'high' ? 'danger' : 'warning'" size="small">{{ risk.level === 'high' ? '高风险' : '中风险' }}</el-tag>
                <span>{{ risk.description }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import Chart from 'chart.js/auto';
import { TrendCharts, UserFilled, ShoppingBag, Warning, MagicStick, Timer, PieChart } from '@element-plus/icons-vue';

// 模拟数据
const stats = reactive({
  gmv: 12580000,
  userCount: 128000,
  orderCount: 56800,
  riskCount: 128,
  recommendationRate: 8.5
});

// 风险事件
const riskEvents = ref([
  {
    time: '2024-01-01 10:30:00',
    level: 'high',
    description: '用户 10086 异地登录并进行大额交易'
  },
  {
    time: '2024-01-01 10:25:00',
    level: 'medium',
    description: '用户 10087 短时间内多次尝试登录'
  },
  {
    time: '2024-01-01 10:20:00',
    level: 'high',
    description: '用户 10088 异常 IP 地址登录'
  },
  {
    time: '2024-01-01 10:15:00',
    level: 'medium',
    description: '用户 10089 购买行为异常'
  },
  {
    time: '2024-01-01 10:10:00',
    level: 'high',
    description: '用户 10090 账号存在被盗风险'
  }
]);

// 图表引用
const tradeChart = ref(null);
const activityChart = ref(null);
const recommendationChart = ref(null);

// 图表实例
let tradeChartInstance = null;
let activityChartInstance = null;
let recommendationChartInstance = null;

// 初始化图表
onMounted(() => {
  initTradeChart();
  initActivityChart();
  initRecommendationChart();
});

// 实时交易趋势图
const initTradeChart = () => {
  if (!tradeChart.value) return;
  
  const ctx = tradeChart.value.getContext('2d');
  tradeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      datasets: [{
        label: '交易量',
        data: [1200, 900, 1500, 2100, 1800, 2500, 1900],
        borderColor: '#409eff',
        backgroundColor: 'rgba(64, 158, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// 用户活跃度分布图
const initActivityChart = () => {
  if (!activityChart.value) return;
  
  const ctx = activityChart.value.getContext('2d');
  activityChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['高活跃', '中活跃', '低活跃'],
      datasets: [{
        data: [35, 45, 20],
        backgroundColor: ['#67c23a', '#e6a23c', '#f56c6c'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
};

// 推荐效果概览图
const initRecommendationChart = () => {
  if (!recommendationChart.value) return;
  
  const ctx = recommendationChart.value.getContext('2d');
  recommendationChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['曝光', '点击', '加购', '购买'],
      datasets: [{
        label: '数量',
        data: [10000, 3000, 1500, 850],
        backgroundColor: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  font-size: 24px;
}

.stat-icon.success {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.stat-icon.primary {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.stat-icon.info {
  background-color: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.stat-icon.warning {
  background-color: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.stat-icon.danger {
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  height: 300px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.chart-container {
  height: 240px;
  width: 100%;
}

.risk-monitor {
  height: 240px;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.risk-item:last-child {
  border-bottom: none;
}

.risk-time {
  font-size: 12px;
  color: #909399;
  min-width: 120px;
}

.risk-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>