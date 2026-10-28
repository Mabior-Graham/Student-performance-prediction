from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import StudentProfile, PredictionResponse
import sys
import os

# Add root to path to find src
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(PROJECT_ROOT)

from src.predict_pipeline import PredictPipeline

# ---- Database + auth ----
from .db import Base, engine
from . import models  # noqa: F401  (registers User + Student tables before create_all)
from .auth import router as auth_router
from .routes.students import router as students_router
from .routes.admin import router as admin_router

app = FastAPI(title="ForeSight API", version="1.0")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables (users, students, etc.) if they don't exist
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router)
app.include_router(students_router)
app.include_router(admin_router)

# Global Pipeline
pipeline = None


@app.on_event("startup")
def load_model():
    global pipeline
    try:
        model_dir = os.path.join(PROJECT_ROOT, "models")
        print(f"Looking for models in: {model_dir}")

        pipeline = PredictPipeline(model_dir=model_dir)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Failed to load model: {e}")
        # Don't crash, just fail requests later


@app.get("/")
def home():
    return {"message": "ForeSight API is running. Use /predict to get scores."}


@app.post("/predict", response_model=PredictionResponse)
def predict_score(profile: StudentProfile):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        input_data = profile.dict()
        score = pipeline.predict(input_data)

        pass_prob = min(1.0, max(0.0, (score - 20) / 80))

        return {
            "exam_score": score,
            "confidence_level": "High" if 0 <= score <= 100 else "Low (Outlier)",
            "pass_probability": round(pass_prob, 2),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/feature_importance")
def feature_importance():
    try:
        from src.explainability import get_feature_importance
        data = get_feature_importance(
            model_dir=os.path.join(PROJECT_ROOT, "models"),
            data_dir=os.path.join(PROJECT_ROOT, "data"),
        )
        return data
    except Exception as e:
        print(f"Error fetching importance: {e}")
        return []