<template>
  <div class="admin-data-security">
    <!-- 页面标题 -->
    <el-page-header
      content="数据安全中心"
    />
    
    <!-- 加密策略配置 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <span>加密策略配置</span>
        </div>
      </template>
      <div class="encryption-config">
        <el-form :model="encryptionForm" class="encryption-form">
          <el-form-item label="传输加密 (TLS)">
            <el-switch v-model="encryptionForm.tls" @change="saveEncryptionConfig" />
          </el-form-item>
          <el-form-item label="存储加密 (AES)">
            <el-switch v-model="encryptionForm.aes" @change="saveEncryptionConfig" />
          </el-form-item>
          <el-form-item label="加密密钥管理">
            <el-select v-model="encryptionForm.keyManagement" placeholder="选择密钥管理方式">
              <el-option label="本地管理" value="local" />
              <el-option label="云密钥管理" value="cloud" />
              <el-option label="硬件加密模块" value="hsm" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveEncryptionConfig">保存配置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!-- 脱敏策略管理 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Remove /></el-icon>
          <span>脱敏策略管理</span>
        </div>
      </template>
      <div class="masking-config">
        <h4>场景化脱敏</h4>
        <el-table :data="maskingScenarios" style="width: 100%; margin-bottom: 20px;">
          <el-table-column prop="name" label="场景" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-switch v-model="scope.row.status" @change="updateMaskingScenario(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        
        <h4>字段级脱敏规则配置</h4>
        <el-table :data="maskingRules" style="width: 100%;">
          <el-table-column prop="field" label="字段" />
          <el-table-column prop="type" label="脱敏类型" />
          <el-table-column prop="rule" label="脱敏规则" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editMaskingRule(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteMaskingRule(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px;" @click="addMaskingRule">
          添加规则
        </el-button>
      </div>
    </el-card>
    
    <!-- 访问审计日志 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Document /></el-icon>
          <span>访问审计日志</span>
        </div>
      </template>
      <el-form :inline="true" :model="auditForm" class="audit-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="auditForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="auditForm.user" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="auditForm.action" placeholder="选择操作类型">
            <el-option label="查询" value="query" />
            <el-option label="修改" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="导出" value="export" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAuditLog">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="auditLogs" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="user" label="用户" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="dataRange" label="数据范围" />
        <el-table-column prop="ip" label="IP" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
    
    <!-- 安全事件告警 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>安全事件告警</span>
        </div>
      </template>
      <el-table :data="securityEvents" style="width: 100%;">
        <el-table-column prop="time" label="时间" />
        <el-table-column prop="type" label="事件类型" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="level" label="严重程度">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)" size="small">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="处理状态" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEvent(scope.row)">
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Lock, Remove, Document, Warning } from '@element-plus/icons-vue';

// 加密策略配置
const encryptionForm = reactive({
  tls: true,
  aes: true,
  keyManagement: 'local'
});

// 脱敏场景
const maskingScenarios = ref([
  {
    id: 1,
    name: '开发环境',
    description: '开发人员访问数据时的脱敏策略',
    status: true
  },
  {
    id: 2,
    name: '测试环境',
    description: '测试人员访问数据时的脱敏策略',
    status: true
  },
  {
    id: 3,
    name: '分析环境',
    description: '数据分析人员访问数据时的脱敏策略',
    status: true
  },
  {
    id: 4,
    name: '第三方共享',
    description: '与第三方共享数据时的脱敏策略',
    status: false
  }
]);

// 脱敏规则
const maskingRules = ref([
  {
    id: 1,
    field: '手机号',
    type: '部分脱敏',
    rule: '保留前3后4位，中间用*代替'
  },
  {
    id: 2,
    field: '身份证号',
    type: '部分脱敏',
    rule: '保留前6后4位，中间用*代替'
  },
  {
    id: 3,
    field: '地址',
    type: '部分脱敏',
    rule: '保留省市，详细地址用*代替'
  },
  {
    id: 4,
    field: '姓名',
    type: '部分脱敏',
    rule: '保留姓氏，名字用*代替'
  }
]);

// 审计日志查询表单
const auditForm = reactive({
  timeRange: [],
  user: '',
  action: ''
});

// 审计日志数据
const auditLogs = ref([
  {
    time: '2024-01-01 10:00:00',
    user: 'admin',
    action: '查询',
    dataRange: '用户画像数据',
    ip: '192.168.1.100',
    status: '成功'
  },
  {
    time: '2024-01-01 09:30:00',
    user: 'user1',
    action: '导出',
    dataRange: '交易数据',
    ip: '192.168.1.101',
    status: '成功'
  },
  {
    time: '2024-01-01 09:00:00',
    user: 'user2',
    action: '修改',
    dataRange: '风险规则',
    ip: '192.168.1.102',
    status: '失败'
  }
]);

// 安全事件数据
const securityEvents = ref([
  {
    time: '2024-01-01 10:00:00',
    type: '异常登录',
    description: '用户 admin 在异常 IP 地址登录',
    level: '高',
    status: '未处理'
  },
  {
    time: '2024-01-01 09:30:00',
    type: '数据导出',
    description: '用户 user1 导出大量数据',
    level: '中',
    status: '已处理'
  },
  {
    time: '2024-01-01 09:00:00',
    type: '权限变更',
    description: '用户 admin 修改了权限配置',
    level: '中',
    status: '已处理'
  }
]);

// 方法
const saveEncryptionConfig = () => {
  ElMessage.success('加密策略配置已保存');
};

const updateMaskingScenario = (scenario) => {
  ElMessage.success(`${scenario.name} 场景状态已更新`);
};

const addMaskingRule = () => {
  ElMessage.info('添加脱敏规则功能暂未实现');
};

const editMaskingRule = (rule) => {
  ElMessage.info(`编辑脱敏规则 ${rule.field}`);
};

const deleteMaskingRule = (rule) => {
  ElMessage.success(`脱敏规则 ${rule.field} 已删除`);
};

const searchAuditLog = () => {
  ElMessage.success('审计日志查询成功');
};

const getLevelType = (level) => {
  if (level === '高') return 'danger';
  if (level === '中') return 'warning';
  return 'info';
};

const handleEvent = (event) => {
  ElMessage.success(`事件 ${event.type} 已处理`);
};
</script>

<style scoped>
.admin-data-security {
  padding: 20px;
}

.security-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.encryption-form {
  max-width: 600px;
}

.masking-config h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: bold;
}

.audit-form {
  margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .encryption-form {
    max-width: 100%;
  }
  
  .audit-form {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>