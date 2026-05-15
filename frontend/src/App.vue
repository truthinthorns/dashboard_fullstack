<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationView from './views/NavigationView.vue';
import { useWeatherStore } from './store/weather';


const weatherStore = useWeatherStore();
const locationAllowed = (position: any) => {
  weatherStore.setCoords(position.coords.latitude + ","+position.coords.longitude);
}
navigator.geolocation.getCurrentPosition(locationAllowed);


</script>

<template>
  <div class="h-100 w-100 background" v-if="weatherStore.coords && weatherStore.hourlyForecast.length > 0">
    <NavigationView />
    <RouterView />
  </div>
</template>

<style scoped>
  .background {
    background-color: #f8fafc;
  }
</style>
