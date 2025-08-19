from django.urls import path
from . import views

urlpatterns = [
    path('destinations/', views.get_destinations, name='get_destinations'),
    path('district/<str:district_name>/', views.get_single_district, name='get_single_district'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
]
