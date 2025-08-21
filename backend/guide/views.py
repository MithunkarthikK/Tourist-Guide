import os
import json
import datetime
import requests
import logging
import traceback

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.core.exceptions import MultipleObjectsReturned

logger = logging.getLogger(__name__)

# Environment variables
FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY", "AIzaSyAVkBZq2KWGvXdcO9trZvhansc2wRvQQec")
PROJECT_ID = os.environ.get("PROJECT_ID", "touristguidedb-tn")

# ------------------------
# Utility Helpers
# ------------------------
def firestore_request(method, endpoint, body=None):
    """Helper to interact with Firestore REST API"""
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{endpoint}?key={FIREBASE_API_KEY}"
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=body, timeout=10)
        else:
            raise ValueError("Unsupported HTTP method")

        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Firestore {method} error for {endpoint}: {traceback.format_exc()}")
        raise

def parse_place(place):
    """Parse Firestore place object"""
    fields = place.get("mapValue", {}).get("fields", {})
    return {
        "name": fields.get("name", {}).get("stringValue", ""),
        "description": fields.get("description", {}).get("stringValue", ""),
        "image": fields.get("image", {}).get("stringValue", ""),
    }

# ------------------------
# Views
# ------------------------
@csrf_exempt
@require_GET
def get_destinations(request):
    try:
        result = firestore_request("GET", "districts")
        documents = result.get("documents", [])
    except Exception as e:
        return JsonResponse({"error": "Failed to fetch destinations", "details": str(e)}, status=500)

    data = []
    for doc in documents:
        fields = doc.get("fields", {})
        data.append({
            "id": doc["name"].split("/")[-1],
            "name": fields.get("name", {}).get("stringValue", ""),
            "region": fields.get("region", {}).get("stringValue", ""),
            "image": fields.get("image", {}).get("stringValue", ""),
            "description": fields.get("description", {}).get("stringValue", ""),
            "popular_places": [parse_place(p) for p in fields.get("popular_places", {}).get("arrayValue", {}).get("values", [])],
            "hidden_places": [parse_place(p) for p in fields.get("hidden_places", {}).get("arrayValue", {}).get("values", [])],
        })
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_GET
def get_single_district(request, district_name):
    try:
        result = firestore_request("GET", "districts")
        documents = result.get("documents", [])
    except Exception as e:
        return JsonResponse({"error": "Failed to fetch district data", "details": str(e)}, status=500)

    for doc in documents:
        fields = doc.get("fields", {})
        name = fields.get("name", {}).get("stringValue", "")
        if name.strip().lower() == district_name.strip().lower():
            return JsonResponse({
                "id": doc["name"].split("/")[-1],
                "name": name,
                "region": fields.get("region", {}).get("stringValue", ""),
                "image": fields.get("image", {}).get("stringValue", ""),
                "description": fields.get("description", {}).get("stringValue", ""),
                "popular_places": [parse_place(p) for p in fields.get("popular_places", {}).get("arrayValue", {}).get("values", [])],
                "hidden_places": [parse_place(p) for p in fields.get("hidden_places", {}).get("arrayValue", {}).get("values", [])],
            })
    return JsonResponse({"error": "District not found"}, status=404)

@csrf_exempt
@require_POST
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not all([username, email, password]):
            return JsonResponse({"error": "username, email, and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)

        firestore_body = {
            "fields": {
                "username": {"stringValue": username},
                "email": {"stringValue": email},
                "created_at": {"timestampValue": datetime.datetime.utcnow().isoformat() + "Z"},
            }
        }

        firestore_request("POST", "users_details", firestore_body)
        return JsonResponse({"message": "User registered successfully"})

    except Exception as e:
        if 'user' in locals():
            user.delete()
        return JsonResponse({"error": "Registration failed", "details": str(e)}, status=500)

@csrf_exempt
@require_POST
def user_login(request):
    try:
        data = json.loads(request.body)
        identifier = data.get("identifier")
        password = data.get("password")

        if not identifier or not password:
            return JsonResponse({"error": "Identifier and password are required"}, status=400)

        user = None
        if "@" in identifier:  # Login with email
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid credentials"}, status=401)
            except MultipleObjectsReturned:
                return JsonResponse({"error": "Multiple accounts with this email"}, status=400)
        else:  # Login with username
            user = authenticate(request, username=identifier, password=password)

        if user:
            login(request, user)
            return JsonResponse({"message": "Login successful", "username": user.username, "email": user.email})
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    except Exception as e:
        logger.error(f"Login error: {traceback.format_exc()}")
        return JsonResponse({"error": "Login failed", "details": str(e)}, status=500)

@csrf_exempt
@require_POST
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})
