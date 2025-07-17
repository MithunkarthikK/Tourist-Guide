import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate("guide/firebase_key.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load JSON data
with open("districts.json", "r") as f:
    districts = json.load(f)

# Upload to Firestore
for district in districts:
    doc_ref = db.collection("districts").document(district["name"])
    doc_ref.set(district)

print("✅ All districts uploaded successfully to Firebase Firestore.")
