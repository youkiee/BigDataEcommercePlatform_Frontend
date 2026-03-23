import { defineStore } from 'pinia';

interface Permission {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  type: 'menu' | 'button';
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [] as Permission[],
    menuPermissions: [] as Permission[],
    buttonPermissions: [] as Permission[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    hasPermissions: (state) => state.permissions.length > 0,
    hasMenuPermissions: (state) => state.menuPermissions.length > 0
  },
  
  actions: {
    setPermissions(permissions: Permission[]) {
      this.permissions = permissions;
      this.menuPermissions = permissions.filter(p => p.type === 'menu');
      this.buttonPermissions = permissions.filter(p => p.type === 'button');
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    },
    
    clear() {
      this.permissions = [];
      this.menuPermissions = [];
      this.buttonPermissions = [];
      this.loading = false;
      this.error = null;
    },
    
    hasPermission(code: string): boolean {
      return this.permissions.some(p => p.code === code);
    },
    
    hasButtonPermission(code: string): boolean {
      return this.buttonPermissions.some(p => p.code === code);
    }
  }
});
