const { createApp } = Vue;

createApp({
    data() {
        return {
            newTodo: '',
            todos: [],
            filter: 'all',
            nextId: 1
        };
    },
    computed: {
        filteredTodos() {
            if (this.filter === 'active') {
                return this.todos.filter(todo => !todo.completed);
            } else if (this.filter === 'completed') {
                return this.todos.filter(todo => todo.completed);
            }
            return this.todos;
        },
        activeTodos() {
            return this.todos.filter(todo => !todo.completed);
        },
        completedTodos() {
            return this.todos.filter(todo => todo.completed);
        }
    },
    methods: {
        addTodo() {
            if (this.newTodo.trim()) {
                this.todos.push({
                    id: this.nextId++,
                    text: this.newTodo.trim(),
                    completed: false
                });
                this.newTodo = '';
                this.saveTodos();
            }
        },
        removeTodo(id) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
        },
        clearCompleted() {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
        },
        saveTodos() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
            localStorage.setItem('nextId', this.nextId);
        },
        loadTodos() {
            const savedTodos = localStorage.getItem('todos');
            const savedNextId = localStorage.getItem('nextId');

            if (savedTodos) {
                this.todos = JSON.parse(savedTodos);
            }

            if (savedNextId) {
                this.nextId = parseInt(savedNextId);
            }
        }
    },
    mounted() {
        this.loadTodos();
    },
    watch: {
        todos: {
            handler() {
                this.saveTodos();
            },
            deep: true
        }
    }
}).mount('#app');
