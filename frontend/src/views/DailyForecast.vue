<template>
    <div class="forecast-container">
        <h1 v-if="!props.today" class="text-center text-light">Next 48 Hours Forecast</h1>
        <div class="row">
            <div class="col" v-for="day in divideForecasts()" :key="day.date">
                <h3 class="text-center text-light">{{day.date}}</h3>
                <table class="table table-striped-columns">
                    <thead>
                        <tr>
                            <th class="text-center">Time</th>
                            <th class="text-center">Temperature</th>
                            <th class="text-center">Rain</th>
                            <th class="text-center">Wind</th>
                            <th class="text-center">Short Forecast</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="forecast in day.forecasts" :key="forecast.number">
                            <th scope="row" class="text-center"><b>{{ formatTime(forecast.start_time) }}</b></th>
                            <td class="text-center">{{ forecast.temperature }}&#176;F</td>
                            <td class="text-center">{{ forecast.chance_of_rain }}%</td>
                            <td class="text-center">{{ forecast.wind_direction }}{{ forecast.wind_speed }}</td>
                            <td class="text-center">{{ forecast.short_forecast }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '../store/weather';
import hourlyForecast from '../models/hourlyForecast';

const weatherStore = useWeatherStore();

const props = defineProps({
  today: Boolean
})

interface Day {
  date: string
  forecasts: hourlyForecast[]
}

const divideForecasts = () => {
    // all the formatted forecasts
    const days: Day[] = [];
    // the forecast for each day
    let forecasts: hourlyForecast[] = [];
    // the tz the user is in
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // get the current Date
    let currentDay = new Date((typeof weatherStore.hourlyForecast[0].start_time === "string" ? new Date(weatherStore.hourlyForecast[0].start_time) : weatherStore.hourlyForecast[0].start_time).toLocaleString("en-US", { timeZone: tz }));
    // get the date of the current Date
    const startDay = currentDay.getDate();
    for (const forecast of weatherStore.hourlyForecast) {
        const day = new Date((typeof forecast.start_time === "string" ? new Date(forecast.start_time) : forecast.start_time).toLocaleString("en-US", { timeZone: tz }));
        // break if we're more than 2 days out.
        if (day.getDate() > startDay+2) break;
        if (props.today && day.getDate() !== currentDay.getDate()) break
        if (day.getDate() === currentDay.getDate()) {
            forecasts.push(forecast);
        } else {
            let dateValue = "";
            // decide what value to put for date
            if (days.length === 0) dateValue = "Today";
            else if (days.length === 1) dateValue = "Tomorrow";
            // push the date and the forecasts
            days.push({
                "date": dateValue,
                "forecasts": forecasts
            })
            // clear the array
            forecasts = [];
            // set currentDay to the new day and push this forecast to forecasts
            currentDay = day;
            forecasts.push(forecast);
        }
    }
    days.push({
        "date": currentDay.toDateString().substring(0, 10),
        "forecasts": forecasts
    })
    return days;
}



const formatTime = (fDate: any) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzDate = new Date((typeof fDate === "string" ? new Date(fDate) : fDate).toLocaleString("en-US", { timeZone: tz }))
    if (tzDate.getHours() >= 12) {
        return tzDate.getHours() > 12 ? `${tzDate.getHours() - 12}:00 pm` : `12:00 pm`;
    } else if (tzDate.getHours() < 12 && tzDate.getHours() > 0) {
        return `${tzDate.getHours()}:00 am`;
    } else {
        return '12:00 am'
    }
}
</script>

<style scoped>
.forecast-container {
    padding: 2rem;
    background: linear-gradient(180deg, #1e3a8a, #2563eb);
}

/* Main title */
h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    letter-spacing: 1px;
}

/* Day header */
h3 {
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 1.3rem;
}

/* Day forecast card */
.col {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(6px);
}

/* Table styling */
.table {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    overflow: hidden;
}

.table thead {
    background: #2563eb;
    color: white;
}

.table-striped-columns tbody tr:nth-of-type(odd) {
    background-color: rgba(37, 99, 235, 0.05);
}

.table-striped-columns tbody tr:hover {
    background-color: rgba(37, 99, 235, 0.15);
    transition: background-color 0.2s ease-in-out;
}

th,
td {
    vertical-align: middle !important;
    padding: 0.6rem;
}

td:last-child {
    font-style: italic;
    font-size: 0.9rem;
    color: #374151;
}

th[scope="row"] b {
    font-weight: 700;
}

/* Responsive tweaks */
@media (max-width: 768px) {
    .col {
        margin-bottom: 2rem;
    }
    h1 {
        font-size: 1.5rem;
    }
    h3 {
        font-size: 1.1rem;
    }
}
</style>