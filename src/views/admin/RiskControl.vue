<template>
  <div class="admin-risk-control">
    <!-- 页面标题 -->
    <el-page-header
      content="风险防控中心"
    />
    
    <!-- 风险概览 -->
    <div class="risk-overview">
      <el-card class="overview-card">
        <div class="overview-content">
          <div class="overview-item">
            <div class="overview-value">{{ riskOverview.todayRiskCount }}</div>
            <div class="overview-label">今日风险交易数</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ riskOverview.highRiskUserCount }}</div>
            <div class="overview-label">高危用户数</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ riskOverview.interceptRate }}%</div>
            <div class="overview-label">拦截率</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ riskOverview.falsePositiveRate }}%</div>
            <div class="overview-label">误报率</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 实时风险交易流 -->
    <el-card class="risk-stream-card">
      <template #header>
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>实时风险交易流</span>
        </div>
      </template>
      <el-table :data="riskTransactions" style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="amount" label="交易金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="device" label="设备信息" />
        <el-table-column prop="ip" label="IP" width="150" />
        <el-table-column prop="riskScore" label="风险评分" width="100">
          <template #default="scope">
            <el-tag :type="getRiskLevel(scope.row.riskScore)" size="small">
              {{ scope.row.riskScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="releaseTransaction(scope.row)">
              放行
            </el-button>
            <el-button type="danger" size="small" @click="freezeTransaction(scope.row)">
              冻结
            </el-button>
            <el-button type="warning" size="small" @click="markReview(scope.row)">
              复核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 风险规则配置 -->
    <el-card class="rule-config-card">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>风险规则配置</span>
        </div>
      </template>
      <div class="rule-config-content">
        <h4>可视化规则编辑器</h4>
        <div class="rule-editor">
          <el-form :model="ruleForm" class="rule-form">
            <el-form-item label="规则名称">
              <el-input v-model="ruleForm.name" placeholder="输入规则名称" />
            </el-form-item>
            <el-form-item label="触发条件">
              <el-select v-model="ruleForm.condition" placeholder="选择触发条件">
                <el-option label="异地登录 + 高金额" value="remote_login_high_amount" />
                <el-option label="短时间多次交易" value="multiple_transactions" />
                <el-option label="异常IP地址" value="abnormal_ip" />
                <el-option label="设备信息异常" value="abnormal_device" />
              </el-select>
            </el-form-item>
            <el-form-item label="风险等级">
              <el-select v-model="ruleForm.riskLevel" placeholder="选择风险等级">
                <el-option label="高风险" value="high" />
                <el-option label="中风险" value="medium" />
                <el-option label="低风险" value="low" />
              </el-select>
            </el-form-item>
            <el-form-item label="评分阈值">
              <el-slider v-model="ruleForm.scoreThreshold" :min="0" :max="100" />
              <span class="threshold-value">{{ ruleForm.scoreThreshold }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveRule">保存规则</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <h4 style="margin-top: 30px;">已配置规则</h4>
        <el-table :data="riskRules" style="width: 100%; margin-top: 10px;">
          <el-table-column prop="name" label="规则名称" />
          <el-table-column prop="condition" label="触发条件" />
          <el-table-column prop="riskLevel" label="风险等级" />
          <el-table-column prop="scoreThreshold" label="评分阈值" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editRule(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteRule(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 风险模型监控 -->
    <el-card class="model-monitor-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>风险模型监控</span>
        </div>
      </template>
      <div class="model-monitor-content">
        <div class="chart-container">
          <canvas ref="modelChart"></canvas>
        </div>
      </div>
    </el-card>
    
    <!-- 历史风险事件 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon><Document /></el-icon>
          <span>历史风险事件</span>
        </div>
      </template>
      <el-form :inline="true" :model="historyForm" class="history-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="historyForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="historyForm.status" placeholder="选择处理状态">
            <el-option label="全部" value="all" />
            <el-option label="已处理" value="processed" />
            <el-option label="未处理" value="unprocessed" />
            <el-option label="复核中" value="reviewing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHistory">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="historyEvents" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="eventType" label="事件类型" />
        <el-table-column prop="riskScore" label="风险评分" />
        <el-table-column prop="status" label="处理状态" />
        <el-table-column prop="handler" label="处理人" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { Warning, Setting, DataAnalysis, Document } from '@element-plus/icons-vue';

// 风险概览数据
const riskOverview = reactive({
  todayRiskCount: 128,
  highRiskUserCount: 35,
  interceptRate: 92.5,
  falsePositiveRate: 3.2
});

// 实时风险交易数据
const riskTransactions = ref([
  {
    userId: '10086',
    amount: 50000,
    device: 'iPhone 15 Pro',
    ip: '192.168.1.100',
    riskScore: 95
  },
  {
    userId: '10087',
    amount: 25000,
    device: 'Windows PC',
    ip: '192.168.1.101',
    riskScore: 85
  },
  {
    userId: '10088',
    amount: 10000,
    device: 'iPad Pro',
    ip: '192.168.1.102',
    riskScore: 75
  },
  {
    userId: '10089',
    amount: 5000,
    device: 'Android Phone',
    ip: '192.168.1.103',
    riskScore: 65
  },
  {
    userId: '10090',
    amount: 2000,
    device: 'MacBook Pro',
    ip: '192.168.1.104',
    riskScore: 55
  }
]);

// 规则配置表单
const ruleForm = reactive({
  name: '',
  condition: '',
  riskLevel: 'high',
  scoreThreshold: 70
});

// 已配置规则
const riskRules = ref([
  {
    id: 1,
    name: '异地登录高金额',
    condition: '异地登录 + 高金额',
    riskLevel: '高风险',
    scoreThreshold: 80
  },
  {
    id: 2,
    name: '短时间多次交易',
    condition: '短时间多次交易',
    riskLevel: '中风险',
    scoreThreshold: 60
  },
  {
    id: 3,
    name: '异常IP地址',
    condition: '异常IP地址',
    riskLevel: '中风险',
    scoreThreshold: 65
  }
]);

// 历史风险事件查询表单
const historyForm = reactive({
  timeRange: [],
  status: 'all'
});

// 历史风险事件
const historyEvents = ref([
  {
    time: '2024-01-01 10:00:00',
    userId: '10086',
    eventType: '异地登录',
    riskScore: 95,
    status: '已处理',
    handler: 'admin'
  },
  {
    time: '2024-01-01 09:30:00',
    userId: '10087',
    eventType: '多次交易',
    riskScore: 85,
    status: '已处理',
    handler: 'admin'
  },
  {
    time: '2024-01-01 09:00:00',
    userId: '10088',
    eventType: '异常IP',
    riskScore: 75,
    status: '复核中',
    handler: 'admin'
  }
]);

// 图表引用
const modelChart = ref(null);

// 图表实例
let modelChartInstance = null;

// 初始化图表
onMounted(() => {
  initModelChart();
});

// 风险模型监控图表
const initModelChart = () => {
  if (!modelChart.value) return;
  
  const ctx = modelChart.value.getContext('2d');
  modelChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '准确率',
          data: [85, 88, 90, 92, 94, 95],
          borderColor: '#409eff',
          tension: 0.4
        },
        {
          label: '召回率',
          data: [80, 82, 85, 88, 90, 92],
          borderColor: '#67c23a',
          tension: 0.4
        },
        {
          label: 'F1值',
          data: [82, 85, 87, 90, 92, 93],
          borderColor: '#e6a23c',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 70,
          max: 100
        }
      }
    }
  });
};

// 方法
const getRiskLevel = (score) => {
  if (score >= 80) return 'danger';
  if (score >= 60) return 'warning';
  return 'info';
};

const releaseTransaction = (row) => {
  ElMessage.success(`交易已放行`);
};

const freezeTransaction = (row) => {
  ElMessage.success(`交易已冻结`);
};

const markReview = (row) => {
  ElMessage.success(`交易已标记为复核`);
};

const saveRule = () => {
  ElMessage.success('规则已保存');
};

const editRule = (row) => {
  ElMessage.info(`编辑规则 ${row.name}`);
};

const deleteRule = (row) => {
  ElMessage.success(`规则 ${row.name} 已删除`);
};

const searchHistory = () => {
  ElMessage.success('历史事件查询成功');
};
</script>

<style scoped>
.admin-risk-control {
  padding: 20px;
}

.risk-overview {
  margin-bottom: 20px;
}

.overview-card {
  width: 100%;
}

.overview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.overview-item {
  text-align: center;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.overview-label {
  font-size: 14px;
  color: #606266;
}

.risk-stream-card,
.rule-config-card,
.model-monitor-card,
.history-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.rule-config-content h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: bold;
}

.rule-form {
  max-width: 600px;
  margin-bottom: 20px;
}

.threshold-value {
  margin-left: 10px;
  font-weight: bold;
}

.model-monitor-content {
  height: 300px;
}

.chart-container {
  height: 100%;
  width: 100%;
}

.history-form {
  margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .overview-content {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .rule-form {
    max-width: 100%;
  }
  
  .history-form {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>