<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

onMounted(() => {
  authStore.clearError()
})

async function handleSubmit() {
  passwordError.value = ''
  
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }
  
  const success = await authStore.signup(name.value, email.value, password.value)
  if (success) {
    router.push('/todos')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <!-- Decorative elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-rust/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-sage/10 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative">
      <!-- Logo/Brand -->
      <div class="text-center mb-10 animate-fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-ink-900 rounded-2xl mb-4 shadow-lifted">
          <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 class="font-display text-4xl font-semibold text-ink-900 mb-2">Taskbook</h1>
        <p class="text-ink-500 font-light">Your personal productivity journal</p>
      </div>

      <!-- Signup Card -->
      <div class="card p-8 animate-slide-up">
        <h2 class="font-display text-2xl font-medium text-ink-900 mb-6 text-center">Create your account</h2>

        <!-- Error Messages -->
        <div 
          v-if="authStore.error || passwordError" 
          class="mb-6 p-4 bg-rust/10 border border-rust/20 rounded-lg text-rust text-sm animate-slide-down"
        >
          {{ authStore.error || passwordError }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-ink-700 mb-2">Full name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-ink-700 mb-2">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-ink-700 mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-ink-400">At least 6 characters</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-ink-700 mb-2">Confirm password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-ink-500">
            Already have an account?
            <router-link to="/login" class="link font-medium">Sign in</router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-ink-400 text-sm mt-8 animate-fade-in">
        Start your productivity journey today
      </p>
    </div>
  </div>
</template>
