# 🚀 Deployment Guide: Live Production Setup

Follow these exact steps to get your Student Exam Predictor live on the web.

## 📋 Prerequisites
*   **GitHub Account** (You have this)
*   **Vercel Account** (Free tier is fine) - For Frontend
*   **Render Account** (Free tier is fine) - For Backend

---

## 1️⃣ Part A: Deploy Backend (Render)
The backend needs a server to run Python code. We will use **Render**.

1.  **Login to [Render Dashboard](https://dashboard.render.com/).**
2.  Click **"New +"** and select **"Web Service"**.
3.  **Connect GitHub**: Select your repo `student-performance-predictor-ai`.
4.  **Configure Settings**:
    *   **Name:** `student-api-anish` (or similar)
    *   **Region:** Closest to you (e.g., Singapore or Oregon)
    *   **Root Directory:** `.` (Leave as is or ./ but we want the root context)
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn app.backend.main:app --host 0.0.0.0 --port 10000`
    *   **Instance Type:** Free
5.  Click **"Create Web Service"**.
6.  ⏳ **Wait**: It will take a few minutes.
7.  **Copy URL**: Once live, you will get a URL like `https://student-api-anish.onrender.com`. **Copy this.**

---

## 2️⃣ Part B: Deploy Frontend (Vercel)
The frontend allows users to interact with your API.

1.  **Login to [Vercel Dashboard](https://vercel.com/dashboard).**
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select `student-performance-predictor-ai`.
4.  **Configure Project**:
    *   **Framework Preset:** Next.js (Auto-detected)
    *   **Root Directory:** Click "Edit" and select `app/frontend`. **(Crucial Step!)**
    *   **Environment Variables:**
        *   Key: `NEXT_PUBLIC_API_URL`
        *   Value: `https://student-api-anish.onrender.com` (Paste the Render URL from Part A)
          *   *Note: Do not add a trailing slash `/` at the end.*
5.  Click **"Deploy"**.
6.  ⏳ **Wait**: It will build and assign a domain.
7.  **Done!** Your site is live at something like `student-performance-predictor-ai.vercel.app`.

---

## 🔍 Verification
1.  Open your **Vercel URL**.
2.  Fill in the form data.
3.  Click **"Predict"**.
4.  It should show the score and the "Feature Importance" chart.
    *   *If it fails, check the Console (F12) for CORS errors or 404s. Ensure the Render URL in Vercel env vars is correct.*

## 💡 Troubleshooting
*   **Render "Build Failed"**: Ensure `requirements.txt` is in the root. (It is).
*   **Vercel "404 on Predict"**: Check if `NEXT_PUBLIC_API_URL` is correct. You might need to Redeploy on Vercel after changing Env Vars.
*   **Slow First Request**: Render Free tier "spins down" after inactivity. The first request might take 50 seconds to wake up. This is normal for free hosting.
