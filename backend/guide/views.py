import os
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt

# Load environment variables
FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY", "YOUR_DEFAULT_API_KEY")
PROJECT_ID = os.environ.get("PROJECT_ID", "touristguidedb-tn")

# Utility to parse place fields from Firestore
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
