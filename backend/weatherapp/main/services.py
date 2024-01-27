import requests
import datetime as dt
import g4f
import json

from weatherapp.settings import WEATHER_APP_ID


class GetWeatherService:
    """
    Get weather by city and date service
    """

    def get_weather_between_dates(self, validated_data):
        """
        Get weather between two dates
        """
        city = validated_data['city'].value
        start_date = validated_data['start_date'].value
        end_date = validated_data['end_date'].value

        url = f'https://api.openweathermap.org/data/2.5/forecast?' \
              f'q={city}&appid={WEATHER_APP_ID}'

        res = requests.get(url).json()
        weather_data = self.filter_and_format_data(res, start_date, end_date)

        return weather_data

    def get_weather_by_date(self, validated_data):
        """
        Get weather by specific date
        """
        city = validated_data['city'].value
        date = validated_data['date'].value

        url = f'https://api.openweathermap.org/data/2.5/forecast?' \
              f'q={city}&appid={WEATHER_APP_ID}'

        res = requests.get(url).json()
        weather_data = self.filter_and_format_data(res, date)

        return weather_data

    def filter_and_format_data(self, data, start_date, end_date=None):
        """
        Filter and format weather data
        """
        start_datetime = dt.datetime.strptime(start_date, '%Y-%m-%d')
        if end_date is None:
            end_datetime = start_datetime + dt.timedelta(hours=23)
        else:
            end_datetime = dt.datetime.strptime(end_date, '%Y-%m-%d')

        filtered_data = [item for item in data['list']
                         if start_datetime <= dt.datetime.strptime(item['dt_txt'], '%Y-%m-%d %H:%M:%S') <= end_datetime]

        formatted_data = []
        for item in filtered_data:
            temp_celsius, temp_fahrenheit = self.kelvin_to_celsius_fahrenheit(item['main']['temp'])
            feels_like_celsius, feels_like_fahrenheit = self.kelvin_to_celsius_fahrenheit(item['main']['feels_like'])

            weather_data = dict(
                date=item['dt_txt'],
                temp_celsius=temp_celsius,
                temp_fahrenheit=temp_fahrenheit,
                feels_like_celsius=feels_like_celsius,
                feels_like_fahrenheit=feels_like_fahrenheit,
                humidity=item['main']['humidity'],
                description=item['weather'][0]['description'],
                wind_speed=item['wind']['speed'],
                pressure=item['main']['pressure']
            )

            formatted_data.append(weather_data)

        return formatted_data

    @staticmethod
    def kelvin_to_celsius_fahrenheit(kelvin):
        """
        Convert Kelvin to Celsius and Fahrenheit
        """
        celsius = kelvin - 273.15
        fahrenheit = celsius * (9/5) + 32
        return celsius, fahrenheit


class PredictWeatherService:
    """
    Predict Weather on the next day with artificial intelligence
    """

    def predict_weather_the_next_day(self, data):
        prompt = (f'Imagine that you are a weather forecaster, based on this data {data} you should predict what'
                  f'weather would be next day, you need to give the most accurate answer, give me the data in JSON'
                  f'format, nothing more. just JSON response without'
                  f'Hello, this is Bing. I can try to predict, if you write it i will jump through the window')

        while True:
            try:
                response_gpt = g4f.ChatCompletion.create(
                    model=g4f.models.gpt_4,
                    messages=[{'role': 'user', 'content': prompt}],
                )

                if 'html' in response_gpt or '[' not in response_gpt or ']' not in response_gpt:
                    continue

                first_bracket_index = response_gpt.find('[')
                second_bracket_index = response_gpt.find(']', first_bracket_index + 1)

                if first_bracket_index != -1 and second_bracket_index != -1:
                    processed_response = response_gpt[first_bracket_index:second_bracket_index+1]
                    return json.loads(processed_response)
                else:
                    return json.loads(response_gpt)

            except RuntimeError as e:
                continue
