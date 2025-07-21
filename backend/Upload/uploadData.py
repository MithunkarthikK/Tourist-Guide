import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("key.json")  # Update path if needed
firebase_admin.initialize_app(cred)

db = firestore.client()

# Load district data
with open("districts.json", "r") as file:
    districts = json.load(file)

# 🔥 Step 1: Delete existing data in 'districts' collection
docs = db.collection("districts").stream()
for doc in docs:
    doc.reference.delete()
print("🗑️ Old district data cleared.")

# ✅ Step 2: Upload new data
for district in districts:
    doc_ref = db.collection("districts").document(district["name"])
    doc_ref.set(district)
    print(f"✅ Uploaded: {district['name']}")

print("\n🎉 All districts uploaded successfully.")
