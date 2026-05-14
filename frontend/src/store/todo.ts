import { defineStore } from "pinia";
import Todo from "../models/todo";

export const useTodoStore = defineStore("todo", {
  state: () => ({
  }),
  actions: {
    async getTodos() {
      const response = await fetch(`${import.meta.env.VITE_ROOT_API}/todo/all`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`${import.meta.env.VITE_ROOT_API}/todo/all`)
      console.log(response);

      if (!response.ok) {
        return false;
      }
      return await response.json();
    },
    async addTodo(todo: Todo) {
      const response = await fetch(`${import.meta.env.VITE_ROOT_API}/todo/`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      console.log(response);

      if (!response.ok) {
        return false;
      }
      return await response.json();
    },
    async deleteTodo(id: number) {
      const response = await fetch(`${import.meta.env.VITE_ROOT_API}/todo/delete/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }
      return true;
    },
    async updateTodo(todo: Todo) {
      const response = await fetch(`${import.meta.env.VITE_ROOT_API}/todo/update`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
      });
      if (!response.ok) {
        return false;
      }
      return await response.json();
    },
  }
});
