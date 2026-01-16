<script setup>
import { ref } from 'vue'
import { useTodosStore } from '@/store/todos'

const props = defineProps({
  todo: { type: Object, required: true }
})

const todosStore = useTodosStore()
const isEditing = ref(false)
const editTitle = ref('')
const showDelete = ref(false)

const priorityColors = {
  high: 'bg-rust/20 text-rust',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-sage/20 text-sage'
}

async function handleToggle() {
  await todosStore.toggleTodo(props.todo.id)
}

function startEdit() {
  editTitle.value = props.todo.title
  isEditing.value = true
}

async function saveEdit() {
  if (editTitle.value.trim()) {
    await todosStore.updateTodo(props.todo.id, { title: editTitle.value.trim() })
  }
  isEditing.value = false
}

async function handleDelete() {
  await todosStore.deleteTodo(props.todo.id)
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateTime(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}
</script>

<template>
  <div 
    class="card p-4 group transition-all duration-200 hover:shadow-lifted"
    :class="{ 'opacity-60': todo.completed }"
  >
    <div class="flex items-start gap-4">
      <!-- Checkbox -->
      <button
        @click="handleToggle"
        class="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
        :class="todo.completed ? 'bg-sage border-sage' : 'border-ink-300 hover:border-ink-500'"
      >
        <svg
          v-if="todo.completed"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div v-if="isEditing" class="flex gap-2">
          <input
            v-model="editTitle"
            @keyup.enter="saveEdit"
            @keyup.escape="isEditing = false"
            class="input flex-1"
            autofocus
          />
          <button @click="saveEdit" class="btn-primary px-3">Save</button>
          <button @click="isEditing = false" class="btn-secondary px-3">Cancel</button>
        </div>
        
        <div v-else>
          <p 
            class="text-ink-900 font-medium"
            :class="{ 'line-through text-ink-400': todo.completed }"
          >
            {{ todo.title }}
          </p>
          
          <div class="flex items-center gap-3 mt-2">
            <span
              class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
              :class="priorityColors[todo.priority]"
            >
              {{ todo.priority }}
            </span>
            <span v-if="todo.dueDate" class="text-xs text-ink-400">
              Due {{ formatDate(todo.dueDate) }}
            </span>
            <span v-if="todo.completed && todo.completedAt" class="text-xs text-sage font-medium">
              Completed {{ formatDateTime(todo.completedAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="startEdit"
          class="p-2 text-ink-400 hover:text-ink-600 hover:bg-ink-100 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-2 text-ink-400 hover:text-rust hover:bg-rust/10 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
