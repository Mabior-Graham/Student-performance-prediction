"""
Compute pass_probability for all students where it's currently NULL.
Run from `app/` directory:  python -m backend.backfill_predictions
"""

import os
import sys

# Make sure the project root is on sys.path so src.* imports work
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from sqlalchemy.orm import Session

from .db import SessionLocal
from .models import Student


def student_to_profile(s: Student) -> dict:
    return {
        "age": s.age,
        "gender": s.gender,
        "course": s.course,
        "study_hours": s.study_hours,
        "class_attendance": s.class_attendance,
        "internet_access": s.internet_access,
        "sleep_hours": s.sleep_hours,
        "sleep_quality": s.sleep_quality,
        "study_method": s.study_method,
        "facility_rating": s.facility_rating,
        "exam_difficulty": s.exam_difficulty,
    }


def backfill() -> None:
    # Load the model ONCE — independent of uvicorn
    from src.predict_pipeline import PredictPipeline

    model_dir = os.path.join(_PROJECT_ROOT, "models")
    print(f"Loading pipeline from {model_dir}...")
    pipeline = PredictPipeline(model_dir=model_dir)
    print("Pipeline loaded.")

    db: Session = SessionLocal()
    try:
        students = db.query(Student).filter(Student.pass_probability.is_(None)).all()
        print(f"Backfilling {len(students)} students...")

        if not students:
            print("Nothing to backfill — all students already have pass_probability.")
            return

        for i, s in enumerate(students, 1):
            profile = student_to_profile(s)
            score = pipeline.predict(profile)
            pass_prob = min(1.0, max(0.0, (score - 20) / 80))
            s.pass_probability = round(pass_prob, 4)

            if i % 100 == 0:
                print(f"  processed {i}/{len(students)}")
                db.commit()

        db.commit()
        print(f"Done. {len(students)} students updated.")
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    backfill()