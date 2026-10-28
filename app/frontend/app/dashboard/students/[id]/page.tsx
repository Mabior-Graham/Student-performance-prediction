"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import ProtectedRoute from "../../../../components/ProtectedRoute";

type Student = {
  id: number;
  name: string;
  age: number;
  gender: string;
  course: string;
  study_hours: number;
  class_attendance: number;
  internet_access: string;
  sleep_hours: number;
  sleep_quality: string;
  study_method: string;
  facility_rating: string;
  exam_difficulty: string;
  instructor_id: number | null;
  instructor_name: string | null;
  pass_probability: number | null;
};

type Prediction = {
  student_id: number;
  name: string;
  exam_score: number;
  confidence_level: string;
  pass_probability: number;
};

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { isAdmin } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStudent = () => {
    if (!id || isNaN(id)) return;
    setLoading(true);
    apiFetch<Student>(`/students/${id}`)
      .then(setStudent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePredict = async () => {
    setPredicting(true);
    setError(null);
    try {
      const p = await apiFetch<Prediction>(`/students/${id}/predict`, {
        method: "POST",
      });
      setPrediction(p);
    } catch (e: any) {
      setError(e.message || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    if (!confirm(`Delete "${student.name}"?`)) return;
    try {
      await apiFetch(`/students/${id}`, { method: "DELETE" });
      router.push("/dashboard/students");
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ padding: "3rem", opacity: 0.6 }}>Loading student...</div>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute>
        <div style={{ padding: "3rem" }}>
          <p style={{ color: "#b91c1c" }}>{error || "Student not found"}</p>
          <Link href="/dashboard/students" style={{ color: "#4f46e5" }}>
            ← Back to students
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  // Prefer live prediction result over cached value
  const effectiveProb =
    prediction?.pass_probability ?? student.pass_probability ?? null;

  const passPercent =
    effectiveProb != null ? Math.round(effectiveProb * 100) : null;

  const risk = computeRisk(passPercent);

  return (
    <ProtectedRoute>
      <div style={{ padding: "2.5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <Link
          href="/dashboard/students"
          style={{
            fontSize: "0.85rem",
            color: "#4f46e5",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back to students
        </Link>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            margin: "1rem 0 2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Avatar name={student.name} />
            <div>
              <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                {student.name}
              </h1>
              <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
                {student.course} · Age {student.age} · {capitalize(student.gender)}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={handlePredict}
              disabled={predicting}
              style={{
                padding: "0.6rem 1.15rem",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: predicting ? "wait" : "pointer",
              }}
            >
              {predicting ? "Predicting..." : "Run Prediction"}
            </button>
            <Link
              href={`/dashboard/students/${id}/edit`}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.3)",
                color: "inherit",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.88rem",
              }}
            >
              Edit
            </Link>
            {isAdmin && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(220,38,38,0.3)",
                  background: "transparent",
                  color: "#b91c1c",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(220,38,38,0.08)",
              color: "#b91c1c",
              borderRadius: 8,
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(220,38,38,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Hero: pass probability + risk */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <BigStat
            label="Pass Probability"
            value={passPercent != null ? `${passPercent}%` : "—"}
            hint={
              student.pass_probability == null
                ? "Run a prediction to compute"
                : "Precomputed from current profile"
            }
            color={risk.color}
            highlight={risk.level === "high"}
            progress={passPercent}
          />
          <BigStat
            label="Class Attendance"
            value={`${student.class_attendance}%`}
            hint="Snapshot from student record"
            color={attendanceColor(student.class_attendance)}
            progress={student.class_attendance}
          />
          <BigStat
            label="Study Hours / Day"
            value={`${student.study_hours}h`}
            hint="Average reported daily study time"
            color="#0ea5e9"
          />
        </div>

        {/* Risk callout */}
        <div
          style={{
            border: `1px solid ${risk.color}33`,
            background: `${risk.color}08`,
            borderRadius: 14,
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>{risk.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.15rem" }}>
              {risk.title}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>{risk.message}</div>
          </div>
        </div>

        {/* Live prediction result (if user clicked Run Prediction) */}
        {prediction && (
          <div
            style={{
              border: "1px solid rgba(99,102,241,0.3)",
              background: "rgba(99,102,241,0.04)",
              borderRadius: 14,
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.6,
                marginBottom: "0.75rem",
                fontWeight: 700,
              }}
            >
              Live Prediction Result
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1.5rem",
                flexWrap: "wrap",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: risk.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {prediction.exam_score.toFixed(1)}
              </div>
              <div style={{ opacity: 0.75, fontSize: "0.88rem" }}>
                Predicted exam score out of 100
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                fontSize: "0.85rem",
                opacity: 0.8,
                flexWrap: "wrap",
              }}
            >
              <span>
                Pass probability:{" "}
                <strong>{(prediction.pass_probability * 100).toFixed(0)}%</strong>
              </span>
              <span>
                Confidence: <strong>{prediction.confidence_level}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Profile section */}
        <div
          style={{
            border: "1px solid rgba(128,128,128,0.18)",
            borderRadius: 14,
            padding: "1.75rem 2rem",
            background: "rgba(255,255,255,0.02)",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            Profile
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <Item label="Internet access" value={capitalize(student.internet_access)} />
            <Item label="Sleep hours / day" value={`${student.sleep_hours}h`} />
            <Item label="Sleep quality" value={capitalize(student.sleep_quality)} />
            <Item label="Study method" value={humanize(student.study_method)} />
            <Item label="Facility rating" value={capitalize(student.facility_rating)} />
            <Item label="Exam difficulty" value={capitalize(student.exam_difficulty)} />
            <Item label="Instructor" value={student.instructor_name ?? "Unassigned"} />
            <Item label="Student ID" value={`#${student.id}`} />
          </div>
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: "1.5rem",
            fontSize: "0.82rem",
            opacity: 0.55,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Predictions are generated by the ForeSight model and are a decision aid,
          not a final grade. Use them to guide interventions, not as outcome.
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Components ---------- */

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 14,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "1.4rem",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function BigStat({
  label,
  value,
  hint,
  color,
  highlight = false,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  color: string;
  highlight?: boolean;
  progress?: number | null;
}) {
  return (
    <div
      style={{
        border: `1px solid ${highlight ? `${color}66` : "rgba(128,128,128,0.18)"}`,
        background: highlight ? `${color}08` : "rgba(255,255,255,0.02)",
        borderRadius: 14,
        padding: "1.25rem 1.4rem",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: 0.6,
          fontWeight: 600,
          marginBottom: "0.6rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color,
          lineHeight: 1.1,
          marginBottom: "0.6rem",
        }}
      >
        {value}
      </div>
      {progress != null && (
        <div
          style={{
            width: "100%",
            height: 6,
            borderRadius: 999,
            background: "rgba(128,128,128,0.15)",
            marginBottom: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: "100%",
              background: color,
              borderRadius: 999,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}
      <div style={{ fontSize: "0.72rem", opacity: 0.55, lineHeight: 1.4 }}>{hint}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        paddingBottom: "0.75rem",
        borderBottom: "1px solid rgba(128,128,128,0.08)",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          opacity: 0.55,
          marginBottom: "0.3rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{value}</div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function computeRisk(passPercent: number | null) {
  if (passPercent == null) {
    return {
      level: "unknown" as const,
      color: "#6366f1",
      icon: "○",
      title: "No prediction yet",
      message: "Click 'Run Prediction' to compute the current risk for this student.",
    };
  }
  if (passPercent < 40) {
    return {
      level: "high" as const,
      color: "#b91c1c",
      icon: "⚠️",
      title: "High risk",
      message:
        "This student is unlikely to pass based on the current profile. Consider scheduling an intervention.",
    };
  }
  if (passPercent < 60) {
    return {
      level: "medium" as const,
      color: "#d97706",
      icon: "◔",
      title: "Moderate risk",
      message:
        "This student is on the edge. Monitor progress over the next few weeks.",
    };
  }
  return {
    level: "low" as const,
    color: "#059669",
    icon: "✓",
    title: "On track",
    message:
      "Current profile suggests a strong likelihood of passing. No immediate action needed.",
  };
}

function attendanceColor(attendance: number) {
  if (attendance < 50) return "#b91c1c";
  if (attendance < 75) return "#d97706";
  return "#059669";
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(s: string) {
  return s
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}