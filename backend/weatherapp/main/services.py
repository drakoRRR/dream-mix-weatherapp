import requests

from weatherapp.settings import WEATHER_APP_ID

class GetWeatherService:
    """
    Get weather by cite and date service
    """

    def get_weather(self, validated_data):
        url = ('https://api.openweathermap.org/data/2.5/weather?' +
               'appid=' + WEATHER_APP_ID + '&q=' + str(validated_data['city']))

        res = requests.get(url).json()

        return res
