import './scss/styles.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

app.use(Toast, {
    // Optional config
    transition: 'Vue-Toastification__fade',
    maxToasts: 5,
    newestOnTop: true,
  })
app.mount('#app');
