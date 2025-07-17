import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate("guide/firebase_key.json")
firebase_admin.initialize_app(cred)

# Get Firestore DB reference
db = firestore.client()
