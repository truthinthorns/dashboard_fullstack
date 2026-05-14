<template>
  <div class="todo-app">
    <!-- Left column: form -->
    <div class="todo-form-container">
      <form @submit.prevent="addTodo" class="todo-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input v-model="title" id="title" placeholder="Title" class="form-input" />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <input v-model="description" id="description" placeholder="Description" class="form-input" />
        </div>

        <div class="form-group">
          <label for="finish_by">Finish By</label>
          <input v-model="finish_by" id="finish_by" type="date" :min="today" class="form-input" />
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <input v-model="priority" id="priority" type="number" placeholder="Priority" class="form-input" />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <input v-model="status" id="status" placeholder="Status" class="form-input" />
        </div>

        <div class="form-group">
          <label for="tags">Tags</label>
          <input v-model="newTag" @keydown.enter.prevent="addTag" placeholder="Type tag and press Enter"
            class="form-input" />
          <div class="tags-list">
            <div class="tag" v-for="(tag, index) in tags" :key="index">
              {{ tag }}
              <button type="button" @click="removeTag(index)">×</button>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn">Add</button>
      </form>
    </div>

    <!-- Right column: searchable list -->
    <div class="todo-list-container">
      <input v-model="searchQuery" placeholder="Search todos..." class="search-input" />
      <div class="todo-list">
        <div class="todo-item" v-for="todo in filteredTodos" :key="todo.id">
          <h3>{{ todo.title }}</h3>
          <p>{{ todo.description }}</p>
          <small>Finish by: {{ todo.finish_by }} | Priority: {{ todo.priority }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Todo from '../models/todo';
import { useTodoStore } from '../store/todo';
import { useUserStore } from '../store/user';
import { ref, computed, onBeforeMount } from "vue";

const todoStore = useTodoStore();
const userStore = useUserStore();

const today = new Date().toISOString().split('T')[0]

const description = ref('');
const title = ref('');
const finish_by = ref('');
const status = ref('');
const tags = ref<string[]>([]);
const priority = ref(0);
const todoList = ref();

const newTag = ref('');
const searchQuery = ref('');


function addTag() {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
  }
  newTag.value = ''
}

function removeTag(index: number) {
  tags.value.splice(index, 1)
}

const getTodos = async () => {
  const todos = await todoStore.getTodos();
  return todoList.value = todos;
}
const addTodo = async () => {
  const tempTodo = new Todo(
    userStore.currentUser!.id, 
    description.value, 
    title.value, 
    new Date().toISOString(), 
    new Date(finish_by.value).toISOString(), 
    status.value, 
    "Incomplete",
    tags.value, 
    priority.value
  );
  const newTodo = await todoStore.addTodo(tempTodo);
  return newTodo;
}
const updateTodo = async (todo: Todo) => {
  const updatedTodo = await todoStore.updateTodo(todo);
  return updatedTodo;
}
const deleteTodo = async (id: number) => {
  const success = await todoStore.deleteTodo(id);
  return success;
}

const filteredTodos = computed(() => {
  if (!searchQuery.value) return todoList.value
  return todoList.value.filter((todo: Todo) =>
    todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onBeforeMount(async () => {
  await getTodos()
  console.log(todoList.value);
})
</script>

<style scoped>
/* --- Main Layout --- */
.todo-app {
  display: flex;
  height: 100vh;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
}

/* --- Left Column: Form --- */
.todo-form-container {
  width: 35%;
  flex-shrink: 0;
}

.todo-form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
}

/* --- Submit Button --- */
.submit-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #4a90e2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #357ab8;
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
}

/* --- Tags Below Input --- */
.tags-list {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e0e7ff;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #555;
}

.tag button:hover {
  color: #000;
}

/* --- Right Column: Todo List --- */
.todo-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

/* Search input above list */
.search-input {
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.todo-list {
  overflow-y: auto;
  flex: 1;
}

.todo-item {
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
}

.todo-item h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.todo-item p {
  margin: 0.3rem 0;
}

.todo-item small {
  color: #555;
  font-size: 0.85rem;
}

/* Optional: smooth scrolling for list */
.todo-list {
  scroll-behavior: smooth;
}

/* --- Responsive: stack columns on small screens --- */
@media (max-width: 768px) {
  .todo-app {
    flex-direction: column;
    height: auto;
  }

  .todo-form-container {
    width: 100%;
  }

  .todo-list-container {
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
