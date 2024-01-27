from rest_framework import serializers


class GetWeatherByCityDateSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=True)
    end_date = serializers.DateField()
    city = serializers.CharField(required=True, max_length=256)


class GetWeatherByCityTodaySerializer(serializers.Serializer):
    date = serializers.DateField(required=True)
    city = serializers.CharField(required=True, max_length=256)
