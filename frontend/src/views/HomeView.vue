<template>
  <div class="container">
    <h1>Hello {{ userStore.currentUser!.username }}!</h1>
    <p>Here's what's happening today.</p>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <i class="bi bi-list-check"></i>
          </div>
          <div class="col">
            <h4>Upcoming Todos</h4>
          </div>
        </div>
      </div>
      <div class="col">
        <h4>Today's Weather</h4>
        <home-page-weather-vue :today="true"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomePageWeatherVue from "../components/HomePageWeather.vue";
import { useUserStore } from "../store/user";


const userStore = useUserStore();
</script>

<style scoped>
.container {
  margin-top: 1rem;
}
</style>
