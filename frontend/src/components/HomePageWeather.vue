<template>
  <div class="weather">
    <div class="current-weather">
      <div class="current-top">
        <img
          :src="String(getWeatherIcon(getTodayForecast()!.forecasts[0].icon))"
          alt="Weather icon"
          class="main-weather-icon"
        />
        <div>
          <p class="current-temp">{{ getTodayForecast()!.forecasts[0].temperature }}°F</p>
          <p class="current-condition">
            {{ getTodayForecast()!.forecasts[0].short_forecast }}
          </p>
        </div>
      </div>
      <div class="weather-stats">
        <div class="weather-stat">
          <span>Humidity</span>
          <strong>{{ getTodayForecast()!.forecasts![0].humidity }}%</strong>
        </div>
        <div class="weather-stat">
          <span>Wind</span>
          <strong>
            {{ getTodayForecast()!.forecasts![0].wind_direction
            }}{{ getTodayForecast()!.forecasts![0].wind_speed }}
          </strong>
        </div>
        <div class="weather-stat">
          <span>Rain Chance</span>
          <strong> {{ getTodayForecast()!.forecasts![0].chance_of_rain }}% </strong>
        </div>
        <div class="weather-stat">
          <span>High / Low</span>
          <strong>
            {{ getTodayForecast()!.high}}°F / {{ getTodayForecast()!.low }}°F
          </strong>
        </div>
        <div class="weather-stat">
          <span>Sunrise/Sunset</span>
          <strong>
            {{ formatTimeFull(weatherStore.sunrise) }} / {{ formatTimeFull(weatherStore.sunset) }}
          </strong>
        </div>
      </div>
    </div>
    <div class="hourly-forecast">
      <div class="hourly-row" v-for="fc in getTodayForecast()!.forecasts.slice(1)" :key="fc.number">
        <p class="forecast-time">
          {{ formatTime(fc.start_time) }}
        </p>
        <img
          :src="String(getWeatherIcon(fc.icon))"
          alt="Weather icon"
          class="hourly-forecast-icon"
        />
        <p class="forecast-temp">{{ fc.temperature }}°F</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from "../store/weather";
import hourlyForecast from "../models/hourlyForecast";

const weatherStore = useWeatherStore();

const props = defineProps({
  today: Boolean,
});

const getTodayForecast = () => {
  // the forecast for each day
  let forecasts: hourlyForecast[] = [];
  let high: number = 0;
  let low: number = 999;
  // the tz the user is in
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // get the current Date
  let currentDay = new Date(
    (typeof weatherStore.hourlyForecast[0].start_time === "string"
      ? new Date(weatherStore.hourlyForecast[0].start_time)
      : weatherStore.hourlyForecast[0].start_time
    ).toLocaleString("en-US", { timeZone: tz }),
  );
  // get the date of the current Date
  const startDay = currentDay.getDate();
  for (const forecast of weatherStore.hourlyForecast.slice(1)) {
    const day = new Date(
      (typeof forecast.start_time === "string"
        ? new Date(forecast.start_time)
        : forecast.start_time
      ).toLocaleString("en-US", { timeZone: tz }),
    );
    // break if we're more than 2 days out.
    if (day.getDate() > startDay + 2) break;
    if (day.getDate() !== currentDay.getDate()) break;
    if (day.getDate() === currentDay.getDate()) {
        high = Math.max(high, forecast.temperature)
        low = Math.min(low, forecast.temperature)
        forecasts.push(forecast);
    }
  }
  return {forecasts, high, low};
};

const icons = import.meta.glob("@/assets/weather-icons/animated/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function getWeatherIcon(iconName: String) {
  return icons[`/src/assets/weather-icons/animated/${iconName}`];
}

const formatTime = (fDate: String) => {
  return new Date(String(fDate)).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }).toLowerCase();
};

const formatTimeFull = (fDate: String) => {
  return new Date(String(fDate)).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }).toLowerCase();
};
</script>

<style scoped>
.weather {
  width: min(100%, 1100px);
  margin: 2rem auto;
  display: grid;
  grid-template-columns: minmax(400px, 1.1fr) minmax(400px, 0.9fr);
  gap: 2rem;
  padding: 2rem;
  border-radius: 32px;
  background:
    linear-gradient(rgba(15, 23, 42, 0.28), rgba(15, 23, 42, 0.28)),
    url("@/assets/sky.webp");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.18),
    0 4px 10px rgba(15, 23, 42, 0.08);
}

.current-weather {
  padding: 2rem;
  border-radius: 1.5rem;
  color: white;
  background: rgba(37, 99, 235, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 20px 50px rgba(37, 99, 235, 0.18),
    0 8px 20px rgba(15, 23, 42, 0.1);
}

.current-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.main-weather-icon {
  width: 8rem;
  height: 8rem;
  object-fit: contain;
}

.current-temp {
  margin: 0;
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
}

.current-condition {
  max-width: 180px;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  line-height: 1.3;
  color: white;
  opacity: 0.95;
}

.weather-stats {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.weather-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}

.weather-stat:last-child {
  border-bottom: none;
}

.weather-stat span {
  font-size: 0.95rem;
  color: white;
  opacity: 0.9;
}

.weather-stat strong {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.hourly-forecast {
  min-width: 0;
  width: 100%;
  max-height: 560px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.hourly-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
}

.hourly-row:last-child {
  border-bottom: none;
}

.forecast-time {
  justify-self: start;
  margin: 0;
  font-weight: 700;
  color: #475569;
}

.hourly-forecast-icon {
  justify-self: center;
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
}

.forecast-temp {
  justify-self: end;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

@media (max-width: 900px) {
  .weather {
    grid-template-columns: 1fr;
    margin: 1rem;
  }
  .current-temp {
    font-size: 3.25rem;
  }
}

@media (max-width: 600px) {
  .weather {
    padding: 1rem;
    border-radius: 24px;
  }
  .current-weather,
  .hourly-forecast {
    border-radius: 22px;
    padding: 1.25rem;
  }
  .current-top {
    flex-direction: column;
    text-align: center;
  }
  .main-weather-icon {
    width: 6rem;
    height: 6rem;
  }
  .hourly-row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
