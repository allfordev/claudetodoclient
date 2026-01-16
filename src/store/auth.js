import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data
      
      token.value = data.token
      user.value = data.user
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Invalid email or password'
      return false
    } finally {
      loading.value = false
    }
  }

  async function signup(name, email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/signup', { name, email, password })
      const data = response.data
      
      token.value = data.token
      user.value = data.user
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.errors?.email || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    clearError
  }
})
