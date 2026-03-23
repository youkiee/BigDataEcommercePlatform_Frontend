import { useAuthStore } from '../store/auth';
import { authApi } from '../api/auth';
import { ElMessage } from 'element-plus';

export function useAuth() {
  const authStore = useAuthStore();

  const login = async (username: string, password: string, role: 'user' | 'admin') => {
    try {
      const response = await authApi.login({ username, password, role });
      authStore.login(response);
      ElMessage.success('登录成功');
      return true;
    } catch (error) {
      ElMessage.error('登录失败，请检查用户名和密码');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    } finally {
      authStore.logout();
      ElMessage.success('已退出登录');
    }
  };

  const register = async (username: string, password: string, email: string, phone: string, code: string) => {
    try {
      await authApi.register({ username, password, email, phone, code });
      ElMessage.success('注册成功，请登录');
      return true;
    } catch (error) {
      ElMessage.error('注册失败，请检查信息');
      return false;
    }
  };

  const getVerificationCode = async (email: string) => {
    try {
      await authApi.getVerificationCode(email);
      ElMessage.success('验证码已发送');
      return true;
    } catch (error) {
      ElMessage.error('发送验证码失败');
      return false;
    }
  };

  return {
    login,
    logout,
    register,
    getVerificationCode,
    isLoggedIn: authStore.isLoggedIn,
    userInfo: authStore.userInfo,
    role: authStore.role
  };
}
