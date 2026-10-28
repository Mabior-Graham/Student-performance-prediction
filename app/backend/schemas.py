from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional, List
from datetime import datetime


# ---- Existing prediction schemas ----

class StudentProfile(BaseModel):
    age: int = Field(..., ge=10, le=100, description="Age of the student")
    gender: Literal['male', 'female', 'other']
    course: Literal['diploma', 'undergraduate', 'postgraduate', 'phd', 'certificate', 'professional', 'vocational']
    study_hours: float = Field(..., ge=0, le=24, description="Daily study hours")
    class_attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    internet_access: Literal['yes', 'no']
    sleep_hours: float = Field(..., ge=0, le=24, description="Daily sleep hours")
    sleep_quality: Literal['poor', 'average', 'good']
    study_method: Literal['coaching', 'self-study', 'group-study', 'online', 'tutoring']
    facility_rating: Literal['low', 'moderate', 'high']
    exam_difficulty: Literal['hard', 'moderate', 'easy']


class PredictionResponse(BaseModel):
    exam_score: float
    confidence_level: str = "High"
    pass_probability: float = 0.0


# ---- Auth schemas ----

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Minimum 6 characters")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class UserAdminCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Literal['instructor', 'admin'] = 'instructor'


class UserAdminOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    created_at: datetime
    student_count: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


# ---- Student schemas ----

class StudentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=10, le=100)
    gender: Literal['male', 'female', 'other']
    course: Literal['diploma', 'undergraduate', 'postgraduate', 'phd', 'certificate', 'professional', 'vocational']
    study_hours: float = Field(..., ge=0, le=24)
    class_attendance: float = Field(..., ge=0, le=100)
    internet_access: Literal['yes', 'no']
    sleep_hours: float = Field(..., ge=0, le=24)
    sleep_quality: Literal['poor', 'average', 'good']
    study_method: Literal['coaching', 'self-study', 'group-study', 'online', 'tutoring']
    facility_rating: Literal['low', 'moderate', 'high']
    exam_difficulty: Literal['hard', 'moderate', 'easy']


class StudentOut(StudentCreate):
    id: int
    instructor_id: Optional[int] = None
    instructor_name: Optional[str] = None
    pass_probability: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class StudentPrediction(BaseModel):
    student_id: int
    name: str
    exam_score: float
    confidence_level: str
    pass_probability: float


# ---- Intervention schemas ----

class InterventionCreate(BaseModel):
    note: str = Field(..., min_length=1, max_length=2000)


class InterventionOut(BaseModel):
    id: int
    student_id: int
    instructor_id: int
    note: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Admin schemas ----

class AssignStudent(BaseModel):
    instructor_id: int


class AdminStats(BaseModel):
    total_students: int
    total_instructors: int
    avg_predicted_score: Optional[float] = None
    at_risk_count: int