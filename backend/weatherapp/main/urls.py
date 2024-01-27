from django.urls import path

import main.views


app_name = 'main'

urlpatterns = [
    path('get-weather-by-city-date/', main.views.GetWeatherByCityDate.as_view(), name='get-weather-by-city-date'),
    path('get-predict-weather-by-city-date/', main.views.GetPredictWeatherByCityDate.as_view(),
         name='get-predict-weather-by-city-date'),

    path('get-weather-by-city-today/', main.views.GetWeatherByCityToday.as_view(), name='get-weather-by-city-today'),
]