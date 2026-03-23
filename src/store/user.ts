import { defineStore } from 'pinia';

interface UserProfile {
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

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    activities: [] as Array<{
      id: number;
      type: 'browse' | 'collect' | 'cart' | 'purchase';
      time: string;
      title: string;
      description: string;
      image?: string;
    }>,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    hasProfile: (state) => !!state.profile,
    interestTags: (state) => state.profile?.interests || []
  },
  
  actions: {
    setProfile(profile: UserProfile) {
      this.profile = profile;
    },
    
    setActivities(activities: any[]) {
      this.activities = activities;
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    },
    
    clear() {
      this.profile = null;
      this.activities = [];
      this.loading = false;
      this.error = null;
    }
  }
});
