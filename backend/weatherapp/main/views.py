from rest_framework.response import Response

from main.serializers import GetWeatherByCityDateSerializer, GetWeatherByCityTodaySerializer
from main.services import GetWeatherService

from rest_framework import views, status


class GetWeatherByCityDate(views.APIView):
    """
    Get weather by params date, city
    """

    def post(self, request):

        serializer = GetWeatherByCityDateSerializer(data=request.data, context=dict(request=request))
        serializer.is_valid(raise_exception=True)
        result = GetWeatherService().get_weather_between_dates(serializer)

        return Response(data=result, status=status.HTTP_200_OK)


class GetWeatherByCityToday(views.APIView):
    """
    DOC
    """

    def post(self, request):

        serializer = GetWeatherByCityTodaySerializer(data=request.data, context=dict(request=request))
        serializer.is_valid(raise_exception=True)
        result = GetWeatherService().get_weather_by_date(serializer)

        return Response(data=result, status=status.HTTP_200_OK)