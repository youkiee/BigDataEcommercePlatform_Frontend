import request from '../utils/request';

interface UserInfo {
  id: number;
  username: string;
  avatar?: string;
  memberLevel: string;
  registerTime: string;
  lastLoginTime: string;
  riskScore: number;
  interests: string[];
  consumptionLevel: string;
  activityLevel: string;
}

interface Activity {
  id: number;
  type: 'browse' | 'collect' | 'cart' | 'purchase';
  time: string;
  title: string;
  description: string;
  image?: string;
}

export const userApi = {
  getUserInfo: () => {
    return request.get<UserInfo>('/api/user/info');
  },
  getActivityHistory: (params: { page?: number; limit?: number; startTime?: string; endTime?: string }) => {
    return request.get<{ list: Activity[]; total: number }>('/api/user/activities', { params });
  },
  updateUserInfo: (data: Partial<UserInfo>) => {
    return request.put('/api/user/info', data);
  },
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return request.post('/api/user/password', data);
  },
  getLoginDevices: () => {
    return request.get('/api/user/devices');
  },
  logoutDevice: (deviceId: string) => {
    return request.post(`/api/user/devices/${deviceId}/logout`);
  },
  updateMfaSettings: (data: { phone: boolean; email: boolean }) => {
    return request.put('/api/user/mfa', data);
  },
  updateDataAuth: (data: { personalizedRecommendation: boolean; behaviorDataCollection: boolean; marketingNotifications: boolean }) => {
    return request.put('/api/user/auth', data);
  },
  exportUserData: () => {
    return request.get('/api/user/export', { responseType: 'blob' });
  }
};
