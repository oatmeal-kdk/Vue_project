import { defineStore } from 'pinia'

import { getMe, login, register } from '../api/authApi'

export const useAuthStore = defineStore('useAuthStore', {
  state: () => ({
    user: null,
    token: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async loginUser(form) {
      this.loading = true
      this.error = null

      try {
        const data = await login(form)

        this.token = data.accessToken
        this.user = data.user
        localStorage.setItem('accessToken', data.accessToken)

        return data
      } catch (error) {
        this.error = error.response?.data?.message || '로그인에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async registerUser(form) {
      this.loading = true
      this.error = null

      try {
        const data = await register(form)

        this.token = data.accessToken
        this.user = data.user
        localStorage.setItem('accessToken', data.accessToken)

        return data
      } catch (error) {
        this.error = error.response?.data?.message || '회원가입에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      if (!this.token) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const data = await getMe()
        this.user = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || '사용자 정보를 불러오지 못했습니다.'
        this.logoutUser()
        throw error
      } finally {
        this.loading = false
      }
    },

    logoutUser() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('accessToken')
    },
  },
})
