from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..db import get_db
from ..models import User, Student
from ..schemas import AdminStats
from ..auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Aggregate stats for the admin dashboard."""

    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_instructors = (
        db.query(func.count(User.id)).filter(User.role == "instructor").scalar() or 0
    )

    # Average pass probability across all students who have a computed value.
    # We express it as a percentage (0–100) to match the UI's other scores.
    avg_pass_prob = (
        db.query(func.avg(Student.pass_probability))
        .filter(Student.pass_probability.isnot(None))
        .scalar()
    )
    avg_predicted_score = (
        round(float(avg_pass_prob) * 100, 1) if avg_pass_prob is not None else None
    )

    # At-risk: students whose cached pass probability is below 40%.
    at_risk_count = (
        db.query(func.count(Student.id))
        .filter(
            Student.pass_probability.isnot(None),
            Student.pass_probability < 0.4,
        )
        .scalar()
        or 0
    )

    return AdminStats(
        total_students=total_students,
        total_instructors=total_instructors,
        avg_predicted_score=avg_predicted_score,
        at_risk_count=at_risk_count,
    )