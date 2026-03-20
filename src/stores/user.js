import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: '',
    isLoggedIn: false
  }),
  
  getters: {
    role: (state) => state.userInfo?.role || ''
  },
  
  actions: {
    login(userData) {
      this.userInfo = userData
      this.token = userData.token
      this.isLoggedIn = true
      localStorage.setItem('userInfo', JSON.stringify(userData))
      localStorage.setItem('token', userData.token)
    },
    
    logout() {
      this.userInfo = null
      this.token = ''
      this.isLoggedIn = false
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },
    
    initUser() {
      const userInfo = localStorage.getItem('userInfo')
      const token = localStorage.getItem('token')
      if (userInfo && token) {
        this.userInfo = JSON.parse(userInfo)
        this.token = token
        this.isLoggedIn = true
      }
    }
  }
})