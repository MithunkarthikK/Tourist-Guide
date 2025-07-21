# guide/urls.py
from django.urls import path
from .views import get_destinations

urlpatterns = [
    path('destinations/', get_destinations),
]
