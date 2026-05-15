from pydantic import BaseModel

from backend.models.weather import Weather

class WeatherResponse(BaseModel):
    forecast: list[Weather]
    sunrise: str
    sunset: str