from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient


class TestViews(TestCase):
    def setUp(self) -> None:
        client = APIClient()

    def test_api_response_city_date(self):
        """Test the 200 api response"""

        payload = {
            "start_date": "2024-01-25",
            "end_date": "2024-01-30",
            "city": "New York"
        }

        url = reverse('main:get-weather-by-city-date')
        res = self.client.post(url, payload)

        self.assertEquals(res.status_code, status.HTTP_200_OK)

    def test_api_response_city_today(self):
        """Test the 200 api response"""

        payload = {
            "date": "2024-01-27",
            "city": "New York"
        }

        url = reverse('main:get-weather-by-city-today')
        res = self.client.post(url, payload)

        self.assertEquals(res.status_code, status.HTTP_200_OK)
