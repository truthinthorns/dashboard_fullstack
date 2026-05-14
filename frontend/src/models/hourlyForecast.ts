export default class WeeklyForecast {
  number: number;
  start_time: String;
  end_time: String;
  temperature: number;
  icon: String;
  wind_speed: String;
  wind_direction: String;
  chance_of_rain: number;
  humidity: number;
  dewpoint: number;
  short_forecast: String;

  constructor(
    number: number,
    start_time: String,
    end_time: String,
    temperature: number,
    icon: String,
    wind_direction: String,
    wind_speed: String,
    chance_of_rain: number,
    humidity: number,
    dewpoint: number,
    short_forecast: String,    
  ) {
    this.number = number;
    this.start_time = start_time;
    this.end_time = end_time;
    this.temperature = temperature;
    this.icon = icon;
    this.wind_direction = wind_direction;
    this.wind_speed = wind_speed;
    this.chance_of_rain = chance_of_rain;
    this.humidity = humidity;
    this.dewpoint = dewpoint;
    this.short_forecast = short_forecast;
  }
}
