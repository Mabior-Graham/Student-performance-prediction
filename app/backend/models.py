from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="instructor")  # "admin" or "instructor"
    created_at = Column(DateTime, default=datetime.utcnow)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # These fields match StudentProfile in schemas.py exactly
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    course = Column(String, nullable=False)
    study_hours = Column(Float, nullable=False)
    class_attendance = Column(Float, nullable=False)
    internet_access = Column(String, nullable=False)
    sleep_hours = Column(Float, nullable=False)
    sleep_quality = Column(String, nullable=False)
    study_method = Column(String, nullable=False)
    facility_rating = Column(String, nullable=False)
    exam_difficulty = Column(String, nullable=False)

    # Which instructor manages this student (nullable = unassigned)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Cached prediction (0.0–1.0), precomputed to avoid recomputing on every list read
    pass_probability = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)