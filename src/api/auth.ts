import request from '../utils/request';

interface LoginParams {
  username: string;
  password: string;
  role: 'user' | 'admin';
  remember?: boolean;
}

interface RegisterParams {
  username: string;
  password: string;
  email: string;
  phone: string;
  code: string;
}

interface LoginResponse {
  token: string;
  userInfo: {
    id: number;
    username: string;
    role: 'user' | 'admin';
    avatar?: string;
  };
}

export const authApi = {
  login: (params: LoginParams) => {
    return request.post<LoginResponse>('/api/auth/login', params);
  },
  register: (params: RegisterParams) => {
    return request.post('/api/auth/register', params);
  },
  logout: () => {
    return request.post('/api/auth/logout');
  },
  refreshToken: () => {
    return request.post<{ token: string }>('/api/auth/refresh');
  },
  getVerificationCode: (email: string) => {
    return request.get('/api/auth/code', { params: { email } });
  }
};
