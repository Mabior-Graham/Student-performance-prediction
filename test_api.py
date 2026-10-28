import requests
import json

url = "http://127.0.0.1:8000/predict"

payload = {
    "age": 20,
    "gender": "male",
    "course": "undergraduate",
    "study_hours": 6.0,
    "class_attendance": 85.0,
    "internet_access": "yes",
    "sleep_hours": 7.5,
    "sleep_quality": "good",
    "study_method": "self-study",
    "facility_rating": "moderate",
    "exam_difficulty": "moderate"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
