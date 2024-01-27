from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient


class TestViews(TestCase):
    def setUp(self) -> None:
        client = APIClient()

    def test_api_response(self):
        """Test the 200 api response"""

        payload = {
            "start_date": "2024-01-01",
            "end_date": "2024-01-15",
            "city": "New York"
        }

        url = reverse('main:get-weather-by-city-date')
        res = self.client.post(url, payload)

        self.assertEquals(res.status_code, status.HTTP_200_OK)
