import os
import json
import datetime
import requests

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.core.exceptions import MultipleObjectsReturned


# Load environment variables for Firebase
FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY", "YOUR_DEFAULT_API_KEY")
PROJECT_ID = os.environ.get("PROJECT_ID", "touristguidedb-tn")


# Helper to parse Firestore place data
def parse_place(place):
    fields = place.get("mapValue", {}).get("fields", {})
    return {
        "name": fields.get("name", {}).get("stringValue", ""),
        "description": fields.get("description", {}).get("stringValue", ""),
        "image": fields.get("image", {}).get("stringValue", "")
    }


@csrf_exempt
@require_GET
def get_destinations(request):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/districts?key={FIREBASE_API_KEY}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        documents = response.json().get("documents", [])
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": "Failed to fetch data from Firebase", "details": str(e)}, status=500)

    data = []
    for doc in documents:
        fields = doc.get("fields", {})
        popular_places = [
            parse_place(p) for p in fields.get("popular_places", {}).get("arrayValue", {}).get("values", [])
        ]
        hidden_places = [
            parse_place(p) for p in fields.get("hidden_places", {}).get("arrayValue", {}).get("values", [])
        ]
        data.append({
            "id": doc["name"].split("/")[-1],
            "name": fields.get("name", {}).get("stringValue", ""),
            "region": fields.get("region", {}).get("stringValue", ""),
            "image": fields.get("image", {}).get("stringValue", ""),
            "description": fields.get("description", {}).get("stringValue", ""),
            "popular_places": popular_places,
            "hidden_places": hidden_places
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
@require_GET
def get_single_district(request, district_name):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/districts?key={FIREBASE_API_KEY}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        documents = response.json().get("documents", [])
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": "Failed to fetch data from Firebase", "details": str(e)}, status=500)

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
                "popular_places": [
                    parse_place(p) for p in fields.get("popular_places", {}).get("arrayValue", {}).get("values", [])
                ],
                "hidden_places": [
                    parse_place(p) for p in fields.get("hidden_places", {}).get("arrayValue", {}).get("values", [])
                ],
            })
    return JsonResponse({"error": "District not found"}, status=404)


### Authentication APIs ###


@csrf_exempt
@require_POST
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return JsonResponse({"error": "username, email, and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        # Create Django user with hashed password
        user = User.objects.create_user(username=username, email=email, password=password)

        # Prepare Firestore document data
        firestore_body = {
            "fields": {
                "username": {"stringValue": username},
                "email": {"stringValue": email},
                "created_at": {"timestampValue": datetime.datetime.utcnow().isoformat() + "Z"}
            }
        }

        firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/users_details?key={FIREBASE_API_KEY}"

        # Send POST request to Firestore
        firestore_response = requests.post(firestore_url, json=firestore_body, timeout=10)
        firestore_response.raise_for_status()

        return JsonResponse({"message": "User registered successfully"})

    except requests.exceptions.RequestException as e:
        # Rollback Django user if Firestore save fails
        if 'user' in locals():
            user.delete()
        return JsonResponse({"error": "Failed to save user data to Firestore", "details": str(e)}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        # For production, avoid returning raw error details
        return JsonResponse({"error": "Server error"}, status=500)


@csrf_exempt
@require_POST
def user_login(request):
    try:
        data = json.loads(request.body)
        identifier = data.get("identifier")  # username or email
        password = data.get("password")

        if not identifier or not password:
            return JsonResponse({"error": "Identifier and password are required"}, status=400)

        user = None
        if "@" in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid credentials"}, status=401)
            except MultipleObjectsReturned:
                return JsonResponse({"error": "Multiple users found with this email"}, status=400)
        else:
            user = authenticate(request, username=identifier, password=password)

        if user is not None:
            login(request, user)  # sets session cookie
            return JsonResponse({"message": "Login successful", "username": user.username, "email": user.email})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        # For production, avoid leaking raw error details
        return JsonResponse({"error": "Server error"}, status=500)


@csrf_exempt
@require_POST
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})
