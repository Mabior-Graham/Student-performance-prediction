from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..db import get_db
from ..models import Student, User
from ..schemas import StudentCreate, StudentOut, StudentPrediction
from ..auth import get_current_user

router = APIRouter(
    prefix="/students",
    tags=["students"],
)


def _student_to_profile_dict(student: Student) -> dict:
    """Convert a Student row into the dict shape pipeline.predict() expects."""
    return {
        "age": student.age,
        "gender": student.gender,
        "course": student.course,
        "study_hours": student.study_hours,
        "class_attendance": student.class_attendance,
        "internet_access": student.internet_access,
        "sleep_hours": student.sleep_hours,
        "sleep_quality": student.sleep_quality,
        "study_method": student.study_method,
        "facility_rating": student.facility_rating,
        "exam_difficulty": student.exam_difficulty,
    }


def _student_response(s: Student, db: Session) -> dict:
    """Build the API response for a student, including instructor email and pass_probability."""
    instructor_name = None
    if s.instructor_id:
        u = db.query(User).filter(User.id == s.instructor_id).first()
        if u:
            instructor_name = u.email

    return {
        "id": s.id,
        "name": s.name,
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
        "instructor_id": s.instructor_id,
        "instructor_name": instructor_name,
        "pass_probability": s.pass_probability,
        "created_at": s.created_at,
    }


def _compute_pass_probability(profile: dict) -> Optional[float]:
    """Run the model on a profile dict and return a pass probability, or None on failure."""
    try:
        from ..main import pipeline
        if not pipeline:
            return None
        score = pipeline.predict(profile)
        return round(min(1.0, max(0.0, (score - 20) / 80)), 4)
    except Exception as e:
        print(f"Could not compute pass_probability: {e}")
        return None


def _get_visible_student(
    student_id: int,
    db: Session,
    current_user: User,
) -> Student:
    """Fetch a student the current user is allowed to see."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Instructors can only see their own students
    if current_user.role != "admin" and student.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this student")

    return student


@router.post("", response_model=StudentOut)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin creates and assigns students. Instructors can add their own advisees."""
    instructor_id = None if current_user.role == "admin" else current_user.id

    profile = payload.model_dump()
    pass_prob = _compute_pass_probability(profile)

    student = Student(
        **profile,
        instructor_id=instructor_id,
        pass_probability=pass_prob,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return _student_response(student, db)


@router.get("", response_model=List[StudentOut])
def list_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Student)
    if current_user.role != "admin":
        query = query.filter(Student.instructor_id == current_user.id)

    students = query.order_by(Student.created_at.desc()).all()
    return [_student_response(s, db) for s in students]


@router.get("/{student_id}", response_model=StudentOut)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = _get_visible_student(student_id, db, current_user)
    return _student_response(student, db)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int,
    payload: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = _get_visible_student(student_id, db, current_user)

    profile = payload.model_dump()
    for field, value in profile.items():
        setattr(student, field, value)

    # Recompute pass_probability after edit
    student.pass_probability = _compute_pass_probability(profile)

    db.commit()
    db.refresh(student)
    return _student_response(student, db)


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin only — instructors cannot delete students."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete students")

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"detail": "Student deleted"}


@router.post("/{student_id}/predict", response_model=StudentPrediction)
def predict_for_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = _get_visible_student(student_id, db, current_user)

    # Lazy import to avoid circular import at startup
    from ..main import pipeline

    if not pipeline:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        profile = _student_to_profile_dict(student)
        score = pipeline.predict(profile)
        pass_prob = min(1.0, max(0.0, (score - 20) / 80))

        return {
            "student_id": student.id,
            "name": student.name,
            "exam_score": score,
            "confidence_level": "High" if 0 <= score <= 100 else "Low (Outlier)",
            "pass_probability": round(pass_prob, 2),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))