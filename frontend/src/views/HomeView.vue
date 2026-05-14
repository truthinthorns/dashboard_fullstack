<template>
  <div class="container">
    <div>
      <h2>Upcoming Todos</h2>
    </div>
    <div>
      <h2>Weather at a Glance</h2>
      <daily-forecast-vue :today="true"></daily-forecast-vue>
    </div>
  </div>
</template>

<script setup lang="ts">
import DailyForecastVue from './DailyForecast.vue';
</script>