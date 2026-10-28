# ForeSight

> **An early-warning student performance prediction system with explainable AI and role-based access control.**

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## About

**ForeSight** is a full-stack early-warning system designed to help educational institutions identify at-risk students before failure becomes final. It combines a trained machine learning model with role-scoped dashboards for instructors and administrators, delivering prediction, explanation, and intervention guidance in a single deployable system.

The project was developed as a Final Year Project in the Department of Computer Science, College of Computer Science and Information Technology, University of Juba.

### Why it exists

Most learning analytics systems stop at prediction. They tell an instructor *"this student has a 62% chance of failing"* — and leave them to figure out what to do next. In practice, most predictions never translate into action. The gap between **prediction** and **intervention** is the central challenge in early-warning systems, and closing that gap is the design goal of ForeSight.

---

## Features

### Predictive Modelling
- Trained on **16,000 samples** with 31 encoded features
- Achieves **R² = 0.733** and **RMSE = 9.77** on held-out test data
- Linear Regression **outperformed** Random Forest (0.700) and Gradient Boosting (0.728) on this dataset

### Prediction Caching
- Every student record carries a cached pass-probability
- List views of 1,200+ students load in **under 300 ms** — no model invocation per request

### Role-Based Access Control
- **Instructor** sees only their own advisees
- **Administrator** sees institution-wide trends
- Enforced at three levels: JWT resolution, route dependency, and frontend guard

### Explainable Predictions
- Feature-importance analysis reveals which factors (attendance, study hours, sleep) drive scores
- Colour-coded risk bands (red / amber / green) make the priority list obvious at a glance

### Intervention-Oriented Dashboard
- Instructors see their cohort sorted by risk
- "Needs your attention" section surfaces the most at-risk students immediately
- Administrators see aggregate risk distribution and institution-wide statistics

### Security
- JWT authentication with HMAC-SHA256
- Bcrypt password hashing
- Role-scoped data access enforced end-to-end

### Deployable Anywhere
- No cloud dependencies
- Runs on SQLite — single file, zero configuration
- No LMS integration required
- No specialised IT staff needed

---

## Architecture
┌────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER │
│ Next.js 16 (App Router) + TypeScript + Tailwind CSS │
└──────────────────────┬─────────────────────────────────────┘
│ HTTPS (JSON, JWT Bearer)
┌──────────────────────▼─────────────────────────────────────┐
│ API LAYER │
│ FastAPI + Pydantic + SQLAlchemy + python-jose │
└────────┬──────────────────────────────────┬────────────────┘
│ │
┌────────▼────────┐ ┌──────────▼────────────────┐
│ PERSISTENCE │ │ ML LAYER │
│ SQLite │ │ scikit-learn pipeline │
│ users │ │ best_model.pkl │
│ students │ │ preprocessing_pipeline │
│ interventions │ │ .pkl │
└─────────────────┘ └───────────────────────────┘

text

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), passlib (bcrypt) |
| **Database** | SQLite (PostgreSQL-ready schema) |
| **ML** | scikit-learn 1.8, LinearRegression, ColumnTransformer, joblib |
| **Development** | uvicorn, npm, Git |

---

## Getting Started

### Prerequisites

- **Python 3.11+** (3.14 recommended — see note below)
- **Node.js 18+** (20 recommended)
- **npm** or **yarn**

> **Note:** The model was trained with scikit-learn 1.8.0 which requires Python 3.11+. If you install scikit-learn 1.7.x on Python 3.10, you will see `InconsistentVersionWarning` messages on startup. The model still works, but the warnings are noisy. Use Python 3.11+ to avoid them.

### Backend Setup

```bash
# From project root
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy "passlib[bcrypt]" \
    "python-jose[cryptography]" python-multipart email-validator \
    scikit-learn==1.8.0 joblib pandas numpy matplotlib seaborn

# Run the backend
cd app
python -m uvicorn backend.main:app --reload
The backend runs at http://localhost:8000. Interactive API documentation at http://localhost:8000/docs.

Frontend Setup
In a second terminal:

bash
cd app/frontend
npm install
npm run dev
The frontend runs at http://localhost:3000.

First-Time Setup
Open http://localhost:3000/register

Register an admin account — the first registered user becomes administrator

Log in and go to /dashboard/admin

(Optional) Populate demo data — 10 instructors, 1,200 students:

bash
cd app
python -m backend.seed
python -m backend.backfill_predictions
All seeded instructors use password instructor123. Their emails appear in the seed output.

Project Structure
text
.
├── app/
│   ├── backend/                  FastAPI application
│   │   ├── main.py               App entry point, router registration
│   │   ├── auth.py               JWT + bcrypt authentication
│   │   ├── models.py             SQLAlchemy ORM models
│   │   ├── schemas.py            Pydantic request/response models
│   │   ├── db.py                 Database session management
│   │   ├── seed.py               Demo data generation
│   │   ├── backfill_predictions.py  Compute cached pass probabilities
│   │   └── routes/
│   │       ├── students.py       Student CRUD + prediction
│   │       └── admin.py          Aggregate statistics
│   └── frontend/                 Next.js application
│       ├── app/                  App Router pages
│       │   ├── page.js           Landing page
│       │   ├── about/            About page
│       │   ├── contact/          Contact page
│       │   ├── login/            Split-screen login
│       │   ├── register/         Split-screen registration
│       │   ├── predict/          Standalone demo predictor
│       │   └── dashboard/        Protected dashboards
│       │       ├── admin/        Administrator overview
│       │       ├── instructor/   Instructor overview
│       │       ├── students/     Student list, add, edit, detail
│       │       └── users/        User management
│       ├── components/           Shared React components
│       └── lib/                  API client, auth helpers
├── src/
│   ├── predict_pipeline.py       ML inference wrapper
│   ├── explainability.py         Feature importance extraction
│   └── preprocessing.py          Feature engineering
├── models/                       Trained model artifacts
├── data/                         Training data
└── README.md
Model Performance
The prediction model is a scikit-learn pipeline that standardises numeric features, one-hot encodes categorical features, and fits a Linear Regression estimator to predict exam scores on a 0–100 scale.

Table 1 — Comparison of candidate models

Model	CV R²	Test R²	RMSE	MAE
Linear Regression	0.7310	0.7330	9.7724	7.8637
Random Forest	0.7030	0.6995	10.3668	9.2333
Gradient Boosting	0.7250	0.7282	9.8600	7.9517
Selected model: Linear Regression — the most interpretable model was also the most accurate on this dataset. This favourable result suggests the feature-target relationship is largely linear and that the additional flexibility of tree ensembles was not needed.

On limitations
The model was trained on synthetic data with plausible distributions — not on real institutional records

Predictions are a decision aid, not a final grade — a student predicted at 75 has a real probability of scoring anywhere from 65 to 85

No probability calibration, no fairness audit, no temporal features

These limitations are documented in Chapter Four of the accompanying thesis.

API Endpoints
Method	Endpoint	Auth	Purpose
POST	/auth/register	—	Register (first user = admin)
POST	/auth/login	—	Authenticate, returns JWT + role
GET	/auth/me	JWT	Current user
POST	/auth/admin/users	Admin	Create instructor or admin
GET	/auth/admin/users	Admin	List users with student counts
GET	/students	JWT	List students (scoped by role)
POST	/students	JWT	Create student (predictions computed)
GET	/students/{id}	JWT	Get single student
PUT	/students/{id}	JWT	Update student (predictions recomputed)
DELETE	/students/{id}	Admin	Delete student
POST	/students/{id}/predict	JWT	Live prediction
GET	/admin/stats	Admin	Aggregate statistics
POST	/predict	—	Standalone prediction
GET	/feature_importance	—	Model feature importance
Full interactive documentation available at http://localhost:8000/docs when the backend is running.

What Works (and What Doesn't)
Implemented
Machine learning model with R² = 0.733 on held-out test data

JWT authentication with bcrypt password hashing

Role-based access control (instructor vs. administrator)

Student CRUD with role-scoped visibility

Prediction caching on student records

Admin dashboard with aggregate statistics

Instructor dashboard with at-risk prioritisation

Feature-importance chart

Public landing, about, and contact pages

Seed script for demo data (1,200 students, 10 instructors)

Backfill script for cached predictions

Not Implemented (Future Work)
Per-student SHAP explanations (currently model-level only)

Intervention logging UI (schema exists, no routes/UI)

Bulk CSV upload

Temporal feature tracking (week-over-week trends)

Fairness audit by demographic group

LMS integration (Canvas, Moodle, Blackboard)

Probability calibration

Multi-institution support

These are documented as future work in Chapter Five of the thesis.

Known Limitations
This project was developed as an undergraduate final year project and should be interpreted accordingly:

Synthetic data — the model was validated on synthetic data designed to be plausible, not real institutional data

No LMS integration — features must be entered manually or via CSV

No intervention UI — the schema supports interventions, but the workflow is not yet exposed

No fairness audit — prediction accuracy is not disaggregated by demographic group

Single institution — no multi-tenancy

Local deployment only — no production deployment (Vercel, Railway, etc.) has been performed

Demo credentials — seeded instructors share a single password; production would require per-user credentials

Acknowledgements
Developed as a Final Year Project in the Department of Computer Science, College of Computer Science and Information Technology, University of Juba.

Supervisor: [Supervisor's Name]

Head of Department: Lodu B. JOHN KUYA

References
Key literature that informed this project:

W. Dai et al., "Learning analytics for early identification of at-risk students and feedback intervention," Journal of Learning Analytics, vol. 12, no. 3, 2025.

D. Rust and B. Motz, "The effect of LMS analytics on proactive advising: A randomized controlled trial," The Internet and Higher Education, vol. 56, 2023.

A. Angeioplastis et al., "Predicting student performance and enhancing learning outcomes: A data-driven approach using educational data mining techniques," Computers, vol. 14, no. 3, 2025.

K. Alalawi, R. Athauda, and R. Chiong, "Evaluating the student performance prediction and action framework through a learning analytics intervention study," Education and Information Technologies, vol. 30, no. 3, 2025.

Full reference list available in the accompanying thesis report.

License
This project is provided for academic evaluation and educational use. For commercial use, please contact the author.

<div align="center">
ForeSight — early warning, not late regret.

</div> ```