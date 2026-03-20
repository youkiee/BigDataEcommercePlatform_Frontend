<template>
  <div class="admin-user-profile">
    <!-- 页面标题 -->
    <el-page-header
      content="用户画像管理"
    />
    
    <!-- 用户群体筛选 -->
    <el-card class="filter-card">
      <template #header>
        <div class="card-header">
          <el-icon><Filter /></el-icon>
          <span>用户群体筛选</span>
        </div>
      </template>
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="filterForm.tags" multiple placeholder="选择标签">
            <el-option label="高价值" value="high_value" />
            <el-option label="潜力用户" value="potential" />
            <el-option label="流失风险" value="churn_risk" />
            <el-option label="高活跃" value="high_active" />
            <el-option label="中活跃" value="medium_active" />
            <el-option label="低活跃" value="low_active" />
          </el-select>
        </el-form-item>
        <el-form-item label="价值等级">
          <el-select v-model="filterForm.valueLevel" placeholder="选择价值等级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="filterForm.riskLevel" placeholder="选择风险等级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFilter">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 群体画像分析 -->
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>群体画像分析</span>
        </div>
      </template>
      <div class="analysis-grid">
        <!-- 基础属性 -->
        <div class="analysis-item">
          <h4>基础属性</h4>
          <div class="chart-container">
            <canvas ref="ageChart"></canvas>
          </div>
        </div>
        
        <!-- 消费特征 -->
        <div class="analysis-item">
          <h4>消费特征</h4>
          <div class="chart-container">
            <canvas ref="consumptionChart"></canvas>
          </div>
        </div>
        
        <!-- 标签分布 -->
        <div class="analysis-item">
          <h4>标签分布</h4>
          <div class="chart-container">
            <canvas ref="tagChart"></canvas>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 个体画像查询 -->
    <el-card class="individual-card">
      <template #header>
        <div class="card-header">
          <el-icon><User /></el-icon>
          <span>个体画像查询</span>
        </div>
      </template>
      <div class="individual-search">
        <el-form :inline="true" :model="individualForm" class="search-form">
          <el-form-item label="用户ID">
            <el-input v-model="individualForm.userId" placeholder="输入用户ID" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchUser">查询</el-button>
          </el-form-item>
        </el-form>
        
        <div v-if="userProfile" class="user-profile-detail">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ userProfile.userId }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ userProfile.username }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">{{ userProfile.memberLevel }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ userProfile.registerTime }}</el-descriptions-item>
            <el-descriptions-item label="最近登录">{{ userProfile.lastLoginTime }}</el-descriptions-item>
            <el-descriptions-item label="风险评分">{{ userProfile.riskScore }}</el-descriptions-item>
            <el-descriptions-item label="兴趣标签" :span="2">
              <el-tag v-for="tag in userProfile.interests" :key="tag" size="small">{{ tag }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="行为轨迹" :span="2">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in userProfile.activities"
                  :key="index"
                  :timestamp="activity.time"
                >
                  {{ activity.description }}
                </el-timeline-item>
              </el-timeline>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
    
    <!-- 画像导出 -->
    <div class="export-section">
      <el-button type="primary" @click="exportData">
        <el-icon><Download /></el-icon>
        导出筛选群体数据
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { Filter, DataAnalysis, User, Download } from '@element-plus/icons-vue';

// 筛选表单
const filterForm = reactive({
  timeRange: [],
  tags: [],
  valueLevel: '',
  riskLevel: ''
});

// 个体查询表单
const individualForm = reactive({
  userId: ''
});

// 用户画像数据
const userProfile = ref(null);

// 图表引用
const ageChart = ref(null);
const consumptionChart = ref(null);
const tagChart = ref(null);

// 图表实例
let ageChartInstance = null;
let consumptionChartInstance = null;
let tagChartInstance = null;

// 初始化图表
onMounted(() => {
  initAgeChart();
  initConsumptionChart();
  initTagChart();
});

// 基础属性图表
const initAgeChart = () => {
  if (!ageChart.value) return;
  
  const ctx = ageChart.value.getContext('2d');
  ageChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
      datasets: [{
        label: '用户数量',
        data: [35000, 45000, 30000, 12000, 6000],
        backgroundColor: '#409eff'
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

// 消费特征图表
const initConsumptionChart = () => {
  if (!consumptionChart.value) return;
  
  const ctx = consumptionChart.value.getContext('2d');
  consumptionChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['高消费', '中消费', '低消费'],
      datasets: [{
        data: [20, 50, 30],
        backgroundColor: ['#f56c6c', '#e6a23c', '#67c23a']
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

// 标签分布图表
const initTagChart = () => {
  if (!tagChart.value) return;
  
  const ctx = tagChart.value.getContext('2d');
  tagChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['高价值', '潜力用户', '流失风险', '其他'],
      datasets: [{
        data: [15, 35, 10, 40],
        backgroundColor: ['#409eff', '#67c23a', '#f56c6c', '#909399']
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

// 方法
const applyFilter = () => {
  ElMessage.success('筛选条件已应用');
};

const resetFilter = () => {
  filterForm.timeRange = [];
  filterForm.tags = [];
  filterForm.valueLevel = '';
  filterForm.riskLevel = '';
  ElMessage.info('筛选条件已重置');
};

const searchUser = () => {
  if (!individualForm.userId) {
    ElMessage.warning('请输入用户ID');
    return;
  }
  
  // 模拟查询用户画像
  userProfile.value = {
    userId: individualForm.userId,
    username: '张三',
    memberLevel: '黄金会员',
    registerTime: '2023-01-15',
    lastLoginTime: '2024-01-01 10:30:00',
    riskScore: 85,
    interests: ['数码', '美妆', '运动', '美食'],
    activities: [
      {
        time: '2024-01-01 10:00:00',
        description: '浏览了 iPhone 15 Pro Max'
      },
      {
        time: '2024-01-01 09:30:00',
        description: '收藏了 AirPods Pro 2'
      },
      {
        time: '2024-01-01 09:00:00',
        description: '将 MacBook Air M2 加入购物车'
      }
    ]
  };
  
  ElMessage.success('查询成功');
};

const exportData = () => {
  ElMessage.info('数据导出功能暂未实现');
};
</script>

<style scoped>
.admin-user-profile {
  padding: 20px;
}

.filter-card,
.analysis-card,
.individual-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-item h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
}

.chart-container {
  height: 200px;
  width: 100%;
}

.individual-search {
  margin-top: 10px;
}

.search-form {
  margin-bottom: 20px;
}

.user-profile-detail {
  margin-top: 20px;
}

.export-section {
  text-align: right;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>