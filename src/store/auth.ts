import { defineStore } from 'pinia';

interface UserInfo {
  id: number;
  username: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null as UserInfo | null,
    isLoggedIn: !!localStorage.getItem('token')
  }),
  
  getters: {
    role: (state) => state.userInfo?.role || '',
    isAdmin: (state) => state.userInfo?.role === 'admin',
    isUser: (state) => state.userInfo?.role === 'user'
  },
  
  actions: {
    login(userData: { token: string; userInfo: UserInfo }) {
      this.token = userData.token;
      this.userInfo = userData.userInfo;
      this.isLoggedIn = true;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userInfo', JSON.stringify(userData.userInfo));
    },
    
    logout() {
      this.token = '';
      this.userInfo = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    },
    
    updateToken(newToken: string) {
      this.token = newToken;
      localStorage.setItem('token', newToken);
    },
    
    updateUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }
});
