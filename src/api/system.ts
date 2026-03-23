import request from '../utils/request';

interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  status: boolean;
  createTime: string;
  lastLoginTime?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  type: 'menu' | 'button';
}

interface SystemConfig {
  dataCollectionInterval: number;
  recommendationRefreshInterval: number;
  riskScanInterval: number;
  logRetentionDays: number;
}

interface OperationLog {
  id: number;
  time: string;
  user: string;
  action: string;
  module: string;
  description: string;
  ip: string;
}

export const systemApi = {
  getUsers: (params: { page?: number; limit?: number; username?: string; role?: string; status?: boolean }) => {
    return request.get<{ list: User[]; total: number }>('/api/system/users', { params });
  },
  createUser: (data: { username: string; password: string; role: 'user' | 'admin' }) => {
    return request.post<User>('/api/system/users', data);
  },
  updateUser: (id: number, data: Partial<User>) => {
    return request.put<User>(`/api/system/users/${id}`, data);
  },
  deleteUser: (id: number) => {
    return request.delete(`/api/system/users/${id}`);
  },
  resetPassword: (id: number) => {
    return request.post(`/api/system/users/${id}/reset-password`);
  },
  getRoles: () => {
    return request.get<Role[]>('/api/system/roles');
  },
  createRole: (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    return request.post<Role>('/api/system/roles', data);
  },
  updateRole: (id: number, data: Partial<Role>) => {
    return request.put<Role>(`/api/system/roles/${id}`, data);
  },
  deleteRole: (id: number) => {
    return request.delete(`/api/system/roles/${id}`);
  },
  getPermissions: () => {
    return request.get<Permission[]>('/api/system/permissions');
  },
  assignPermissions: (roleId: number, permissionIds: number[]) => {
    return request.post(`/api/system/roles/${roleId}/permissions`, { permissionIds });
  },
  getSystemConfig: () => {
    return request.get<SystemConfig>('/api/system/config');
  },
  updateSystemConfig: (data: SystemConfig) => {
    return request.put('/api/system/config', data);
  },
  getOperationLogs: (params: { page?: number; limit?: number; user?: string; action?: string; module?: string; startTime?: string; endTime?: string }) => {
    return request.get<{ list: OperationLog[]; total: number }>('/api/system/logs', { params });
  }
};
