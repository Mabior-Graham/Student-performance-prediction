"""
Seed the ForeSight database with realistic South Sudanese demo data.

Usage:
    python -m backend.seed            # normal seed (requires empty instructors/students)
    python -m backend.seed --force    # wipe non-admin users + all students, then reseed

Run from the `app/` directory so that `backend` is importable as a package.
"""

import argparse
import random
import sys
from datetime import datetime

from sqlalchemy.orm import Session

from .db import SessionLocal, Base, engine
from . import models
from .models import User, Student
from .auth import hash_password


# ---- Constants ----
NUM_INSTRUCTORS = 10
NUM_STUDENTS = 1200
INSTRUCTOR_PASSWORD = "instructor123"
INSTRUCTOR_DOMAIN = "foresight.ss"  # South Sudan domain convention

COURSES = [
    "diploma", "undergraduate", "postgraduate",
    "phd", "certificate", "professional", "vocational",
]
GENDERS = ["male", "female", "other"]
SLEEP_QUALITIES = ["poor", "average", "good"]
STUDY_METHODS = ["coaching", "self-study", "group-study", "online", "tutoring"]
FACILITY_RATINGS = ["low", "moderate", "high"]
EXAM_DIFFICULTIES = ["easy", "moderate", "hard"]
INTERNET = ["yes", "no"]

# ---- South Sudanese names ----
# First names: mix of South Sudanese given names + common English/Christian names
# widely used across South Sudan (especially among younger generations).
FIRST_NAMES = [
    # Dinka
    "Deng", "Akol", "Ajak", "Bol", "Chol", "Garang", "Kuol", "Majak",
    "Manyang", "Mabior", "Malual", "Ngong", "Riek", "Thon", "Wol",
    "Achol", "Adut", "Ayen", "Akuol", "Abuk", "Nyakuoth", "Nyibol",
    # Nuer
    "Gatluak", "Gatwech", "Biel", "Duop", "Gatdet", "Kun", "Lual",
    "Nyachar", "Nyaluak", "Nyamal", "Nyaruot", "Nyawal", "Reth",
    # Bari / Equatorian
    "Lado", "Wani", "Taban", "Ladu", "Kenyi", "Juma", "Moga", "Pitia",
    "Nakiru", "Poni", "Keji", "Grace", "Joyce",
    # Zande / Western Equatoria
    "Gbudue", "Bakindo", "Zangabeyo", "Ngere", "Ringo",
    # Shilluk / Upper Nile
    "Reth", "Nyikang", "Akoc", "Ajak", "Othow",
    # Common English / Christian names widely used
    "James", "John", "Peter", "Paul", "Joseph", "Daniel", "Samuel",
    "Michael", "Emmanuel", "Gabriel", "David", "Moses", "Isaac",
    "Mary", "Sarah", "Rebecca", "Esther", "Elizabeth", "Martha",
    "Cecilia", "Angelina", "Josephine", "Christine", "Rose",
]

LAST_NAMES = [
    # Dinka
    "Deng", "Akol", "Ajak", "Bol", "Chol", "Garang", "Kuol", "Majak",
    "Manyang", "Mabior", "Malual", "Ngong", "Riek", "Thon", "Wol",
    "Aguer", "Arou", "Ater", "Dut", "Kuc", "Lual",
    # Nuer
    "Gatluak", "Gatwech", "Biel", "Duop", "Gatdet", "Kun", "Lual",
    "Reth", "Tut", "Nyak", "Pal", "Chuol", "Dak",
    # Bari / Equatorian
    "Lado", "Wani", "Taban", "Ladu", "Kenyi", "Juma", "Moga", "Pitia",
    "Loro", "Logali", "Lokwang", "Lotim",
    # Zande
    "Gbudue", "Bakindo", "Zangabeyo", "Ngere", "Ringo", "Bagayo",
    # Shilluk
    "Nyikang", "Akoc", "Othow", "Ojullu", "Okiech",
    # Common English / Christian surnames
    "Johnson", "Jackson", "Peter", "Paul", "Joseph", "Daniel",
    "Michael", "Emmanuel", "Gabriel", "David", "Moses", "Isaac",
    "Akech", "Aleu", "Atem", "Ayuel", "Biar", "Dau", "Gai", "Makuach",
]


def random_student(name: str, instructor_id: int) -> Student:
    """Generate one realistic student record assigned to the given instructor."""

    # Correlated study habits: heavier studiers tend to attend more and sleep better
    base_effort = random.triangular(0.2, 1.0, 0.6)  # 0..1, skew toward middle
    study_hours = round(base_effort * 10 + random.uniform(-1, 1), 1)
    study_hours = max(0.0, min(24.0, study_hours))

    attendance = round(base_effort * 60 + random.uniform(20, 100) * 0.4, 1)
    attendance = max(0.0, min(100.0, attendance))

    sleep_hours = round(random.uniform(4.0, 9.5), 1)
    if base_effort > 0.7:
        sleep_hours = round(min(9.5, sleep_hours + 0.5), 1)

    # Sleep quality loosely follows sleep hours
    if sleep_hours >= 7.5:
        sleep_quality = random.choices(SLEEP_QUALITIES, weights=[1, 2, 7])[0]
    elif sleep_hours >= 6.0:
        sleep_quality = random.choices(SLEEP_QUALITIES, weights=[2, 6, 2])[0]
    else:
        sleep_quality = random.choices(SLEEP_QUALITIES, weights=[6, 3, 1])[0]

    age = random.randint(17, 35)

    return Student(
        name=name,
        age=age,
        gender=random.choice(GENDERS),
        course=random.choice(COURSES),
        study_hours=study_hours,
        class_attendance=attendance,
        internet_access=random.choices(INTERNET, weights=[6, 4])[0],  # SS context: less reliable internet
        sleep_hours=sleep_hours,
        sleep_quality=sleep_quality,
        study_method=random.choice(STUDY_METHODS),
        facility_rating=random.choices(FACILITY_RATINGS, weights=[4, 4, 2])[0],  # SS context: fewer "high" ratings
        exam_difficulty=random.choices(EXAM_DIFFICULTIES, weights=[2, 6, 2])[0],
        instructor_id=instructor_id,
    )


def make_full_name() -> str:
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def seed(force: bool = False) -> None:
    """Populate the database with demo instructors and students."""
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Verify admin exists
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            print("ERROR: No admin user found.")
            print("Register one first at http://localhost:3000/register")
            sys.exit(1)

        print(f"Found admin: {admin.email}")

        # 2. Safety check
        existing_instructors = db.query(User).filter(User.role == "instructor").count()
        existing_students = db.query(Student).count()
        if (existing_instructors > 0 or existing_students > 0) and not force:
            print(
                f"Database already has {existing_instructors} instructors "
                f"and {existing_students} students."
            )
            print("Re-run with --force to wipe and reseed.")
            sys.exit(1)

        if force:
            print(f"Wiping {existing_instructors} instructors and {existing_students} students...")
            db.query(Student).delete()
            db.query(User).filter(User.role == "instructor").delete()
            db.commit()

        # 3. Create instructors
        print(f"Creating {NUM_INSTRUCTORS} instructors...")
        instructors = []
        used_emails = {u.email for u in db.query(User).all()}
        for i in range(1, NUM_INSTRUCTORS + 1):
            full_name = make_full_name()
            slug = full_name.lower().replace(" ", ".")
            email = f"{slug}.{i}@{INSTRUCTOR_DOMAIN}"
            # Avoid collisions
            while email in used_emails:
                email = f"{slug}.{i}.{random.randint(100, 999)}@{INSTRUCTOR_DOMAIN}"
            used_emails.add(email)

            u = User(
                email=email,
                hashed_password=hash_password(INSTRUCTOR_PASSWORD),
                role="instructor",
            )
            db.add(u)
            instructors.append((u, full_name))
        db.commit()
        for u, _ in instructors:
            db.refresh(u)
        print(f"  ✓ Created {len(instructors)} instructors (password: {INSTRUCTOR_PASSWORD})")
        for u, full_name in instructors:
            print(f"    · {full_name} — {u.email}")

        # 4. Create students
        print(f"\nCreating {NUM_STUDENTS} students...")
        per_instructor = NUM_STUDENTS // NUM_INSTRUCTORS
        remainder = NUM_STUDENTS % NUM_INSTRUCTORS

        created = 0
        for idx, (instr_user, instr_name) in enumerate(instructors):
            count = per_instructor + (1 if idx < remainder else 0)
            batch = [random_student(make_full_name(), instr_user.id) for _ in range(count)]
            db.add_all(batch)
            created += count
            print(f"  → {instr_name}: {count} students")

        db.commit()
        print(f"  ✓ Created {created} students total")

        # 5. Summary
        print()
        print("=" * 60)
        print("Seed complete.")
        print("=" * 60)
        print(f"Admin:        {admin.email}")
        print(f"Instructors:  {NUM_INSTRUCTORS}  (see list above)")
        print(f"Password:     {INSTRUCTOR_PASSWORD}  (for all seeded instructors)")
        print(f"Students:     {created}")
        print()
        print("Login as any instructor and you'll see ~120 students.")
        print("Login as admin and you'll see all 1200.")

    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed ForeSight demo data (South Sudan)")
    parser.add_argument("--force", action="store_true", help="Wipe existing data first")
    args = parser.parse_args()
    seed(force=args.force)