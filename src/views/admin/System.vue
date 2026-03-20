<template>
  <div class="admin-system">
    <!-- 页面标题 -->
    <el-page-header
      content="系统管理"
    />
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="user">
        <div class="user-management">
          <el-form :inline="true" :model="userForm" class="user-form">
            <el-form-item label="用户名">
              <el-input v-model="userForm.username" placeholder="输入用户名" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="userForm.role" placeholder="选择角色">
                <el-option label="普通用户" value="user" />
                <el-option label="管理员" value="admin" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchUser">查询</el-button>
              <el-button type="success" @click="addUser">添加用户</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="users" style="width: 100%; margin-top: 20px;">
            <el-table-column prop="id" label="用户ID" width="100" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-switch v-model="scope.row.status" @change="updateUserStatus(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editUser(scope.row)">
                  编辑
                </el-button>
                <el-button type="warning" size="small" @click="resetPassword(scope.row)">
                  重置密码
                </el-button>
                <el-button type="danger" size="small" @click="deleteUser(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      
      <!-- 角色与权限管理 -->
      <el-tab-pane label="角色与权限管理" name="role">
        <div class="role-management">
          <el-button type="primary" @click="addRole">添加角色</el-button>
          <el-table :data="roles" style="width: 100%; margin-top: 20px;">
            <el-table-column prop="id" label="角色ID" width="100" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editRole(scope.row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="deleteRole(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 权限配置 -->
          <div class="permission-config" style="margin-top: 30px;">
            <h4>权限配置</h4>
            <el-tree
              :data="permissionTree"
              show-checkbox
              node-key="id"
              default-expand-all
              class="permission-tree"
            />
            <el-button type="primary" style="margin-top: 20px;" @click="savePermission">
              保存权限
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 操作日志 -->
      <el-tab-pane label="操作日志" name="log">
        <div class="operation-log">
          <el-form :inline="true" :model="logForm" class="log-form">
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
            <el-form-item label="用户">
              <el-input v-model="logForm.user" placeholder="输入用户名" />
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select v-model="logForm.action" placeholder="选择操作类型">
                <el-option label="登录" value="login" />
                <el-option label="登出" value="logout" />
                <el-option label="创建" value="create" />
                <el-option label="修改" value="update" />
                <el-option label="删除" value="delete" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchLog">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="operationLogs" style="width: 100%; margin-top: 20px;">
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="user" label="用户" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="module" label="模块" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="ip" label="IP" />
          </el-table>
        </div>
      </el-tab-pane>
      
      <!-- 系统参数配置 -->
      <el-tab-pane label="系统参数配置" name="config">
        <div class="system-config">
          <el-form :model="systemForm" class="config-form">
            <el-form-item label="数据采集频率 (分钟)">
              <el-input-number v-model="systemForm.dataCollectionInterval" :min="1" :max="60" />
            </el-form-item>
            <el-form-item label="推荐刷新周期 (分钟)">
              <el-input-number v-model="systemForm.recommendationRefreshInterval" :min="1" :max="120" />
            </el-form-item>
            <el-form-item label="风控扫描间隔 (分钟)">
              <el-input-number v-model="systemForm.riskScanInterval" :min="1" :max="60" />
            </el-form-item>
            <el-form-item label="日志保留时间 (天)">
              <el-input-number v-model="systemForm.logRetentionDays" :min="1" :max="365" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSystemConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 响应式数据
const activeTab = ref('user');

// 用户管理
const userForm = reactive({
  username: '',
  role: ''
});

const users = ref([
  {
    id: 1,
    username: 'admin',
    role: '管理员',
    status: true,
    createTime: '2023-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'user1',
    role: '普通用户',
    status: true,
    createTime: '2023-01-02 00:00:00'
  },
  {
    id: 3,
    username: 'user2',
    role: '普通用户',
    status: false,
    createTime: '2023-01-03 00:00:00'
  }
]);

// 角色管理
const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有所有权限'
  },
  {
    id: 2,
    name: '运营',
    description: '负责运营相关功能'
  },
  {
    id: 3,
    name: '风控',
    description: '负责风险防控相关功能'
  },
  {
    id: 4,
    name: '审计',
    description: '负责审计相关功能'
  }
]);

// 权限树
const permissionTree = ref([
  {
    id: 1,
    label: '数据看板',
    children: [
      { id: 11, label: '查看' },
      { id: 12, label: '导出' }
    ]
  },
  {
    id: 2,
    label: '用户画像管理',
    children: [
      { id: 21, label: '查看' },
      { id: 22, label: '编辑' },
      { id: 23, label: '导出' }
    ]
  },
  {
    id: 3,
    label: '推荐系统管理',
    children: [
      { id: 31, label: '查看' },
      { id: 32, label: '配置' },
      { id: 33, label: '测试' }
    ]
  },
  {
    id: 4,
    label: '风险防控中心',
    children: [
      { id: 41, label: '查看' },
      { id: 42, label: '配置' },
      { id: 43, label: '处理' }
    ]
  },
  {
    id: 5,
    label: '数据安全中心',
    children: [
      { id: 51, label: '查看' },
      { id: 52, label: '配置' }
    ]
  },
  {
    id: 6,
    label: '系统管理',
    children: [
      { id: 61, label: '用户管理' },
      { id: 62, label: '角色管理' },
      { id: 63, label: '日志查看' },
      { id: 64, label: '系统配置' }
    ]
  }
]);

// 操作日志查询
const logForm = reactive({
  timeRange: [],
  user: '',
  action: ''
});

const operationLogs = ref([
  {
    time: '2024-01-01 10:00:00',
    user: 'admin',
    action: '登录',
    module: '系统管理',
    description: '管理员登录系统',
    ip: '192.168.1.100'
  },
  {
    time: '2024-01-01 09:30:00',
    user: 'admin',
    action: '修改',
    module: '推荐系统管理',
    description: '修改推荐算法配置',
    ip: '192.168.1.100'
  },
  {
    time: '2024-01-01 09:00:00',
    user: 'user1',
    action: '登录',
    module: '系统管理',
    description: '用户登录系统',
    ip: '192.168.1.101'
  }
]);

// 系统参数配置
const systemForm = reactive({
  dataCollectionInterval: 5,
  recommendationRefreshInterval: 30,
  riskScanInterval: 10,
  logRetentionDays: 90
});

// 方法
const searchUser = () => {
  ElMessage.success('用户查询成功');
};

const addUser = () => {
  ElMessage.info('添加用户功能暂未实现');
};

const updateUserStatus = (user) => {
  ElMessage.success(`${user.username} 状态已更新`);
};

const editUser = (user) => {
  ElMessage.info(`编辑用户 ${user.username}`);
};

const resetPassword = (user) => {
  ElMessage.success(`${user.username} 密码已重置`);
};

const deleteUser = (user) => {
  ElMessage.success(`${user.username} 已删除`);
};

const addRole = () => {
  ElMessage.info('添加角色功能暂未实现');
};

const editRole = (role) => {
  ElMessage.info(`编辑角色 ${role.name}`);
};

const deleteRole = (role) => {
  ElMessage.success(`角色 ${role.name} 已删除`);
};

const savePermission = () => {
  ElMessage.success('权限配置已保存');
};

const searchLog = () => {
  ElMessage.success('操作日志查询成功');
};

const saveSystemConfig = () => {
  ElMessage.success('系统参数配置已保存');
};
</script>

<style scoped>
.admin-system {
  padding: 20px;
}

.user-form,
.log-form {
  margin-bottom: 20px;
}

.role-management h4,
.permission-config h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: bold;
}

.permission-tree {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.config-form {
  max-width: 600px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-form,
  .log-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .config-form {
    max-width: 100%;
  }
}
</style>