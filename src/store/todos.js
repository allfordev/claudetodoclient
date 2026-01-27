import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTodosStore = defineStore('todos', () => {
  const todos = ref([])
  const stats = ref({ total: 0, completed: 0, pending: 0, completed: 0, overdue: 0 })
  const loading = ref(false)
  const error = ref(null)
  const filter = ref('all') // all, pending, completed

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'pending':
        return todos.value.filter(t => !t.completed)
      case 'completed':
        return todos.value.filter(t => t.completed)
      default:
        return todos.value
    }
  })

  async function fetchTodos() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/todos')
      todos.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch todos'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await api.get('/todos/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  async function createTodo(todoData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/todos', todoData)
      todos.value.unshift(response.data)
      stats.value.total++
      stats.value.pending++

      const now = new Date()
      const dueDate = new Date(todoData.dueDate)
      if (dueDate < now) {
        stats.value.overdue++
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create todo'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id, todoData) {
    error.value = null
    
    try {
      const response = await api.put(`/todos/${id}`, todoData)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update todo'
      return null
    }
  }

  async function toggleTodo(id) {
    error.value = null
    
    try {
      const response = await api.patch(`/todos/${id}/toggle`)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        const wasCompleted = todos.value[index].completed
        todos.value[index] = response.data
        
        const todo = todos.value[index];
        const now = new Date()
        const dueDate = new Date(todo.dueDate)
        const overdueTodo = dueDate < now;
        if (wasCompleted) {
          stats.value.completed--
          stats.value.pending++
          if (overdueTodo) {
            stats.value.overdue++
          }
        } else {
          stats.value.completed++
          stats.value.pending--
          if (overdueTodo) {
            stats.value.overdue--
          }
        }
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to toggle todo'
      return null
    }
  }

  async function deleteTodo(id) {
    error.value = null
    
    try {
      const todo = todos.value.find(t => t.id === id)
      await api.delete(`/todos/${id}`)
      todos.value = todos.value.filter(t => t.id !== id)
      
      stats.value.total--
      if (todo?.completed) {
        stats.value.completed--
      } else {
        stats.value.pending--
      }
      
      if (todo.dueDate < new Date()) {
        stats.value.overdue--
      }

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete todo'
      return false
    }
  }

  function setFilter(newFilter) {
    filter.value = newFilter
  }

  function clearError() {
    error.value = null
  }

  return {
    todos,
    stats,
    loading,
    error,
    filter,
    filteredTodos,
    fetchTodos,
    fetchStats,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearError
  }
})
