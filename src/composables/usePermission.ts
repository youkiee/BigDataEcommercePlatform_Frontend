import { usePermissionStore } from '../store/permission';

export function usePermission() {
  const permissionStore = usePermissionStore();

  const hasPermission = (code: string): boolean => {
    return permissionStore.hasPermission(code);
  };

  const hasButtonPermission = (code: string): boolean => {
    return permissionStore.hasButtonPermission(code);
  };

  const loadPermissions = async () => {
    permissionStore.setLoading(true);
    try {
      // 实际项目中这里应该调用API获取权限
      // 这里使用模拟数据
      const mockPermissions = [
        { id: 1, name: '数据看板', code: 'dashboard', type: 'menu' },
        { id: 2, name: '用户画像管理', code: 'user-profile', type: 'menu' },
        { id: 3, name: '推荐系统管理', code: 'recommendation', type: 'menu' },
        { id: 4, name: '风险防控中心', code: 'risk-control', type: 'menu' },
        { id: 5, name: '数据安全中心', code: 'data-security', type: 'menu' },
        { id: 6, name: '系统管理', code: 'system', type: 'menu' },
        { id: 7, name: '用户管理', code: 'user-manage', type: 'menu' },
        { id: 8, name: '角色管理', code: 'role-manage', type: 'menu' },
        { id: 9, name: '添加用户', code: 'user-add', type: 'button' },
        { id: 10, name: '编辑用户', code: 'user-edit', type: 'button' },
        { id: 11, name: '删除用户', code: 'user-delete', type: 'button' },
        { id: 12, name: '重置密码', code: 'user-reset-password', type: 'button' }
      ];
      permissionStore.setPermissions(mockPermissions);
    } catch (error) {
      permissionStore.setError('加载权限失败');
    } finally {
      permissionStore.setLoading(false);
    }
  };

  return {
    hasPermission,
    hasButtonPermission,
    loadPermissions,
    permissions: permissionStore.permissions,
    menuPermissions: permissionStore.menuPermissions,
    buttonPermissions: permissionStore.buttonPermissions,
    loading: permissionStore.loading
  };
}
