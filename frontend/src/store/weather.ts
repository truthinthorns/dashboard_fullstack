import { defineStore } from 'pinia'
import hourlyForecast from '../models/hourlyForecast';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        hourlyForecast: [] as hourlyForecast[],
        coords: ""
    }),
    actions: {
        async getHourly() {
            this.hourlyForecast = [];
            const result = await fetch(`${import.meta.env.VITE_API_URL}/weather/hourly?coords=${this.coords}`);
            const forecast = await result.json();
            this.hourlyForecast = forecast;
        },
        async setCoords(newCoords: string) {
            this.coords = newCoords;
            await this.getHourly();
        }
    },
})
