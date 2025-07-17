import firebase_admin
from firebase_admin import credentials, firestore
from django.http import JsonResponse

# Initialize Firebase app once
if not firebase_admin._apps:
    cred = credentials.Certificate('guide/firebase_key.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_destinations(request):
    destinations_ref = db.collection('districts')  
    docs = destinations_ref.stream()

    data = []
    for doc in docs:
        item = doc.to_dict()
        item['id'] = doc.id
        data.append(item)

    return JsonResponse(data, safe=False)
