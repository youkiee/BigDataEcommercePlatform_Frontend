import { defineStore } from 'pinia';

interface SystemConfig {
  dataCollectionInterval: number;
  recommendationRefreshInterval: number;
  riskScanInterval: number;
  logRetentionDays: number;
}

export const useSystemStore = defineStore('system', {
  state: () => ({
    config: null as SystemConfig | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    hasConfig: (state) => !!state.config
  },
  
  actions: {
    setConfig(config: SystemConfig) {
      this.config = config;
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    },
    
    clear() {
      this.config = null;
      this.loading = false;
      this.error = null;
    }
  }
});
