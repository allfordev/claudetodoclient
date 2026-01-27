<script setup>
import { ref } from 'vue'
import { useTodosStore } from '@/store/todos'

const emit = defineEmits(['cancel', 'created'])
const todosStore = useTodosStore()

const title = ref('')
const priority = ref('medium')
const dueDate = ref('')

async function handleSubmit() {
  if (!title.value.trim()) return
  
  const result = await todosStore.createTodo({
    title: title.value.trim(),
    dueDate: dueDate.value || null,
    priority: priority.value
  })
  
  if (result) {
    title.value = ''
    priority.value = 'medium'
    dueDate.value = ''
    emit('created')
  }
}
</script>

<template>
  <div class="card p-6 animate-slide-down">
    <h3 class="font-display text-lg font-medium text-ink-900 mb-4">New Task</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <input
          v-model="title"
          type="text"
          class="input"
          placeholder="What needs to be done?"
          autofocus
        />
        <input
          v-model="dueDate"
          type="datetime-local"
          class="input"
          placeholder="When is it due?"
          autofocus
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-ink-700 mb-2">Priority</label>
        <div class="flex gap-2">
          <button
            v-for="p in ['low', 'medium', 'high']"
            :key="p"
            type="button"
            @click="priority = p"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              priority === p
                ? p === 'high' ? 'bg-rust text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-sage text-white'
                : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>
      
      <div class="flex gap-3 pt-2">
        <button type="submit" class="btn-primary" :disabled="!title.trim()">
          Add Task
        </button>
        <button type="button" @click="emit('cancel')" class="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
