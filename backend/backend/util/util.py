from datetime import datetime

import requests
from beanie import PydanticObjectId
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder

from backend.models.todo import Todo
from backend.models.user import MongoUser as User
from backend.models.weather import Weather


def hourly_forecast_formatter(coords: str):
    try:
        result = requests.get(
            f"https://api.weather.gov/points/{coords}").json()
        hourly = requests.get(result.get(
            "properties").get("forecastHourly")).json()
        hourly_json = jsonable_encoder(hourly.get("properties").get("periods"))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"An error occurred when getting the hourly forecast: {str(e)}",
        )

    try:
        new_hourly = []
        # return only the next 48 hours
        for hour in hourly_json:
            hourly_dict = dict(hour)
            # for some reason, dewpoint is in Celsius, so convert to Fahrenheit
            dewpoint = hourly_dict.get("dewpoint").get("value", None)
            if dewpoint:
                dewpoint = int((int(dewpoint) * (9 / 5)) + 32)
            new_hourly.append(
                Weather(
                    number=hourly_dict.get("number"),
                    start_time=datetime.fromisoformat(
                        hourly_dict.get("startTime")),
                    end_time=datetime.fromisoformat(
                        hourly_dict.get("endTime")),
                    temperature=hourly_dict.get("temperature"),
                    icon=get_icon(hourly_dict.get("shortForecast"),
                                  hourly_dict.get("isDaytime")),
                    wind_speed=hourly_dict.get("windSpeed"),
                    wind_direction=hourly_dict.get("windDirection"),
                    chance_of_rain=hourly_dict.get("probabilityOfPrecipitation").get(
                        "value", None
                    ),
                    humidity=hourly_dict.get(
                        "relativeHumidity").get("value", None),
                    dewpoint=dewpoint,
                    short_forecast=hourly_dict.get("shortForecast"),
                )
            )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"An error occurred when formatting the hourly forecast: {str(e)}",
        )
    return {
        "forecast": new_hourly, 
        "sunrise": result.get("properties").get("astronomicalData").get("sunrise"), 
        "sunset": result.get("properties").get("astronomicalData").get("sunset")
    }


def get_icon(short_forecast: str, is_daytime: bool) -> str:
    forecast = short_forecast.lower()
    tod = "day" if is_daytime else "night"

    if "thunderstorm" in forecast:
        if "chance" in forecast:
            return f"isolated-thunderstorms-{tod}.svg"
        return "thunderstorms.svg"
    if "rain showers likely" in forecast:
        return f"rainy-2-{tod}.svg"
    if "showers" in forecast:
        if "slight chance" in forecast:
            return f"rainy-1-{tod}.svg"
        return f"rainy-2-{tod}.svg"
    if "rain" in forecast:
        return f"rainy-3-{tod}.svg"
    if "fog" in forecast:
        return f"fog-{tod}.svg"
    if "partly cloudy" in forecast or "partly sunny" in forecast:
        return f"cloudy-1-{tod}.svg"
    if "cloudy" in forecast:
        return "cloudy.svg"
    if (
        "mostly sunny" in forecast
        or "sunny" in forecast
        or "clear" in forecast
    ):
        return f"clear-{tod}.svg"
    print(short_forecast)
    return "not-available.svg"


async def get_user(id: PydanticObjectId) -> User:
    try:
        user = await User.get(id)
        if user is None:
            raise HTTPException(
                status_code=404, detail="No user found with that id!")
        return user
    except Exception as e:
        raise e


async def get_todo(id: PydanticObjectId) -> Todo:
    try:
        todo = await Todo.get(id)
        if todo is None:
            raise HTTPException(
                status_code=404, detail="No todo found with that id!")
        return todo
    except Exception as e:
        raise e
