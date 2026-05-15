import { defineStore } from 'pinia'
import hourlyForecast from '../models/hourlyForecast';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        hourlyForecast: [] as hourlyForecast[],
        sunrise: "",
        sunset: "",
        coords: ""
    }),
    actions: {
        async getHourly() {
            this.hourlyForecast = [];
            this.sunrise = "";
            this.sunset = "";
            const result = await fetch(`${import.meta.env.VITE_API_URL}/weather/hourly?coords=${this.coords}`);
            const resultJson = await result.json();
            this.hourlyForecast = resultJson["forecast"];
            this.sunrise = resultJson["sunrise"];
            this.sunset = resultJson["sunset"];
        },
        async setCoords(newCoords: string) {
            this.coords = newCoords;
            await this.getHourly();
        }
    },
})
