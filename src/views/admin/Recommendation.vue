<template>
  <div class="admin-recommendation">
    <!-- 页面标题 -->
    <el-page-header
      content="推荐系统管理"
    />
    
    <!-- 策略配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>策略配置</span>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="算法选择" name="algorithm">
          <el-form :model="algorithmForm" class="config-form">
            <el-form-item label="推荐算法">
              <el-radio-group v-model="algorithmForm.algorithm">
                <el-radio label="collaborative">协同过滤</el-radio>
                <el-radio label="content">内容推荐</el-radio>
                <el-radio label="deep">深度学习</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="参数配置">
              <el-input-number v-model="algorithmForm.parameters.k" label="K值" :min="1" :max="100" />
              <el-input-number v-model="algorithmForm.parameters.alpha" label="Alpha" :min="0" :max="1" :step="0.1" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveAlgorithmConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="场景配置" name="scene">
          <el-form :model="sceneForm" class="config-form">
            <el-form-item label="推荐场景">
              <el-checkbox-group v-model="sceneForm.scenes">
                <el-checkbox label="home">首页推荐</el-checkbox>
                <el-checkbox label="cart">购物车搭配</el-checkbox>
                <el-checkbox label="product">商品详情页</el-checkbox>
                <el-checkbox label="category">分类页</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="场景权重">
              <el-slider v-model="sceneForm.weight" :min="0" :max="100" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSceneConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="规则配置" name="rule">
          <el-form :model="ruleForm" class="config-form">
            <el-form-item label="推荐规则">
              <el-checkbox-group v-model="ruleForm.rules">
                <el-checkbox label="new">新品优先</el-checkbox>
                <el-checkbox label="related">关联商品</el-checkbox>
                <el-checkbox label="hot">热门商品</el-checkbox>
                <el-checkbox label="discount">优惠商品</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="规则优先级">
              <el-radio-group v-model="ruleForm.priority">
                <el-radio label="new">新品优先</el-radio>
                <el-radio label="sales">销量优先</el-radio>
                <el-radio label="rating">评分优先</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveRuleConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- A/B测试管理 -->
    <el-card class="ab-test-card">
      <template #header>
        <div class="card-header">
          <el-icon><Refresh /></el-icon>
          <span>A/B测试管理</span>
        </div>
      </template>
      <div class="ab-test-content">
        <el-button type="primary" @click="createTest">创建测试</el-button>
        <el-table :data="abTests" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="id" label="测试ID" width="100" />
          <el-table-column prop="name" label="测试名称" />
          <el-table-column prop="algorithm" label="算法" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewTest(scope.row)">
                查看
              </el-button>
              <el-button type="danger" size="small" @click="stopTest(scope.row)">
                停止
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 效果分析 -->
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>效果分析</span>
        </div>
      </template>
      <div class="analysis-grid">
        <!-- 推荐曝光/点击/转化漏斗图 -->
        <div class="analysis-item">
          <h4>推荐漏斗</h4>
          <div class="chart-container">
            <canvas ref="funnelChart"></canvas>
          </div>
        </div>
        
        <!-- 策略效果对比表格 -->
        <div class="analysis-item">
          <h4>策略效果对比</h4>
          <el-table :data="strategyEffects" style="width: 100%">
            <el-table-column prop="strategy" label="策略" />
            <el-table-column prop="exposure" label="曝光量" />
            <el-table-column prop="click" label="点击量" />
            <el-table-column prop="conversion" label="转化率" />
            <el-table-column prop="revenue" label=" revenue" />
          </el-table>
        </div>
      </div>
    </el-card>
    
    <!-- 推荐日志查询 -->
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <el-icon><Document /></el-icon>
          <span>推荐日志查询</span>
        </div>
      </template>
      <el-form :inline="true" :model="logForm" class="log-form">
        <el-form-item label="用户ID">
          <el-input v-model="logForm.userId" placeholder="输入用户ID" />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="logForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchLog">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="recommendationLogs" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="productId" label="商品ID" />
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="reason" label="推荐理由" />
        <el-table-column prop="action" label="用户行为" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { Setting, Refresh, DataAnalysis, Document } from '@element-plus/icons-vue';

// 响应式数据
const activeTab = ref('algorithm');

// 算法配置
const algorithmForm = reactive({
  algorithm: 'collaborative',
  parameters: {
    k: 20,
    alpha: 0.5
  }
});

// 场景配置
const sceneForm = reactive({
  scenes: ['home', 'cart'],
  weight: 80
});

// 规则配置
const ruleForm = reactive({
  rules: ['new', 'related'],
  priority: 'new'
});

// A/B测试数据
const abTests = ref([
  {
    id: 'AB-001',
    name: '协同过滤 vs 深度学习',
    algorithm: 'collaborative, deep',
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-01-07 23:59:59',
    status: '进行中'
  },
  {
    id: 'AB-002',
    name: '内容推荐 vs 协同过滤',
    algorithm: 'content, collaborative',
    startTime: '2023-12-25 00:00:00',
    endTime: '2023-12-31 23:59:59',
    status: '已结束'
  }
]);

// 策略效果数据
const strategyEffects = ref([
  {
    strategy: '协同过滤',
    exposure: 10000,
    click: 3000,
    conversion: '8.5%',
    revenue: '¥125,000'
  },
  {
    strategy: '内容推荐',
    exposure: 9500,
    click: 2800,
    conversion: '7.8%',
    revenue: '¥112,000'
  },
  {
    strategy: '深度学习',
    exposure: 10500,
    click: 3200,
    conversion: '9.2%',
    revenue: '¥138,000'
  }
]);

// 推荐日志查询表单
const logForm = reactive({
  userId: '',
  timeRange: []
});

// 推荐日志数据
const recommendationLogs = ref([
  {
    time: '2024-01-01 10:00:00',
    userId: '10086',
    productId: 'P001',
    productName: 'iPhone 15 Pro Max',
    reason: '基于浏览记录',
    action: '点击'
  },
  {
    time: '2024-01-01 09:30:00',
    userId: '10086',
    productId: 'P002',
    productName: 'AirPods Pro 2',
    reason: '热门商品',
    action: '收藏'
  },
  {
    time: '2024-01-01 09:00:00',
    userId: '10086',
    productId: 'P003',
    productName: 'MacBook Air M2',
    reason: '关联推荐',
    action: '加入购物车'
  }
]);

// 图表引用
const funnelChart = ref(null);

// 图表实例
let funnelChartInstance = null;

// 初始化图表
onMounted(() => {
  initFunnelChart();
});

// 推荐漏斗图表
const initFunnelChart = () => {
  if (!funnelChart.value) return;
  
  const ctx = funnelChart.value.getContext('2d');
  funnelChartInstance = new Chart(ctx, {
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

// 方法
const saveAlgorithmConfig = () => {
  ElMessage.success('算法配置已保存');
};

const saveSceneConfig = () => {
  ElMessage.success('场景配置已保存');
};

const saveRuleConfig = () => {
  ElMessage.success('规则配置已保存');
};

const createTest = () => {
  ElMessage.info('创建测试功能暂未实现');
};

const viewTest = (row) => {
  ElMessage.info(`查看测试 ${row.id}`);
};

const stopTest = (row) => {
  ElMessage.success(`测试 ${row.id} 已停止`);
};

const searchLog = () => {
  ElMessage.success('日志查询成功');
};
</script>

<style scoped>
.admin-recommendation {
  padding: 20px;
}

.config-card,
.ab-test-card,
.analysis-card,
.log-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.config-form {
  max-width: 600px;
}

.ab-test-content {
  margin-top: 10px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

.log-form {
  margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .config-form {
    max-width: 100%;
  }
  
  .log-form {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>