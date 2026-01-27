<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useTodosStore } from '@/store/todos'
import TodoItem from '@/components/TodoItem.vue'
import TodoForm from '@/components/TodoForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const todosStore = useTodosStore()

const showForm = ref(false)
const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

onMounted(async () => {
  await todosStore.fetchTodos()
  await todosStore.fetchStats()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleTodoCreated() {
  showForm.value = false
}

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Done' }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-cream/80 backdrop-blur-lg border-b border-ink-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-ink-900 rounded-xl flex items-center justify-center shadow-soft">
              <svg class="w-5 h-5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span class="font-display text-xl font-semibold text-ink-900">Taskbook</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-ink-500 hidden sm:block">{{ authStore.user?.name }}</span>
            <button
              @click="handleLogout"
              class="text-ink-500 hover:text-ink-700 transition-colors p-2 rounded-lg hover:bg-ink-100"
              title="Sign out"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8 animate-fade-in">
        <h1 class="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-2">
          Good {{ new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening' }}, {{ authStore.user?.name?.split(' ')[0] }}
        </h1>
        <p class="text-ink-500">{{ currentDate }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-10 mb-8 animate-slide-up">
        <div class="card p-4 text-center">
          <p class="text-3xl font-display font-semibold text-ink-900">{{ todosStore.stats.total }}</p>
          <p class="text-sm text-ink-500 mt-1">Total Tasks</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-3xl font-display font-semibold text-rust">{{ todosStore.stats.overdue }}</p>
          <p class="text-sm text-ink-500 mt-1">Overdue</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-3xl font-display font-semibold text-orange-400">{{ todosStore.stats.pending }}</p>
          <p class="text-sm text-ink-500 mt-1">Pending</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-3xl font-display font-semibold text-sage">{{ todosStore.stats.completed }}</p>
          <p class="text-sm text-ink-500 mt-1">Completed</p>
        </div>
      </div>

      <!-- Add Task Button / Form -->
      <div class="mb-6 animate-slide-up animate-delay-100">
        <button
          v-if="!showForm"
          @click="showForm = true"
          class="btn-primary w-full sm:w-auto"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Task
        </button>
        
        <TodoForm 
          v-else 
          @cancel="showForm = false"
          @created="handleTodoCreated"
        />
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center space-x-2 mb-6 animate-slide-up animate-delay-200">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="todosStore.setFilter(option.value)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            todosStore.filter === option.value
              ? 'bg-ink-900 text-cream shadow-soft'
              : 'text-ink-600 hover:bg-ink-100'
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Todos List -->
      <div class="space-y-3 animate-slide-up animate-delay-300">
        <!-- Loading State -->
        <div v-if="todosStore.loading && todosStore.todos.length === 0" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-ink-400 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-ink-500">Loading your tasks...</p>
        </div>

        <!-- Empty State -->
        <div 
          v-else-if="todosStore.filteredTodos.length === 0" 
          class="text-center py-16 card"
        >
          <div class="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-medium text-ink-900 mb-2">
            {{ todosStore.filter === 'all' ? 'No tasks yet' : todosStore.filter === 'pending' ? 'No pending tasks' : 'No completed tasks' }}
          </h3>
          <p class="text-ink-500 mb-6">
            {{ todosStore.filter === 'all' ? 'Create your first task to get started' : 'Tasks will appear here when available' }}
          </p>
          <button
            v-if="todosStore.filter === 'all'"
            @click="showForm = true"
            class="btn-secondary"
          >
            Create your first task
          </button>
        </div>

        <!-- Todo Items -->
        <TransitionGroup name="list">
          <TodoItem
            v-for="todo in todosStore.filteredTodos"
            :key="todo.id"
            :todo="todo"
          />
        </TransitionGroup>
      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <p class="text-ink-400 text-sm">
        Made with care • Taskbook © {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
