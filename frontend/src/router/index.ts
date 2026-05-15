import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import DailyForecast from '../views/DailyForecast.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Todo from '../views/TodoView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/weather',
      name: 'weather',
      component: DailyForecast,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo,
      meta: { requiresAuth: true }
    },
  ]
})

export default router


async function isAuthenticated() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });
    return response.status === 200
  } catch {
    return false
  }
}


router.beforeEach(async (to, _, next) => {
  if (to.meta.requiresAuth) {
    const loggedIn = await isAuthenticated();

    if (!loggedIn) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
    }
  }
  next();
});
