"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

type AdminStats = {
  total_students: number;
  total_instructors: number;
  avg_predicted_score: number | null;
  at_risk_count: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<AdminStats>("/admin/stats")
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = stats?.total_students ?? 0;
  const atRisk = stats?.at_risk_count ?? 0;
  const safeCount = Math.max(0, totalStudents - atRisk);
  const atRiskPct =
    totalStudents > 0 ? Math.round((atRisk / totalStudents) * 100) : 0;

  const avg = stats?.avg_predicted_score;
  const avgColor =
    avg == null
      ? "#0ea5e9"
      : avg < 40
      ? "#b91c1c"
      : avg < 60
      ? "#d97706"
      : "#059669";

  const loadingOr = (v: string | number) => (loading ? "..." : v);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.25rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700,
              opacity: 0.5,
              marginBottom: "0.4rem",
            }}
          >
            Overview
          </div>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "0.4rem",
              letterSpacing: "-0.03em",
              fontWeight: 800,
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.92rem" }}>
            Institutional health across all students and instructors.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link
            href="/dashboard/users"
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: 8,
              border: "1px solid rgba(128,128,128,0.25)",
              color: "inherit",
              fontWeight: 600,
              fontSize: "0.86rem",
              textDecoration: "none",
            }}
          >
            Manage Users
          </Link>
          <Link
            href="/dashboard/students"
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.86rem",
              textDecoration: "none",
            }}
          >
            View All Students →
          </Link>
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
            marginBottom: "1.5rem",
            border: "1px solid rgba(220,38,38,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* Hero stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Total Students"
          value={loadingOr(totalStudents.toLocaleString())}
          icon="👥"
          accent="#6366f1"
          sub={`Across ${loading ? "…" : stats?.total_instructors ?? 0} instructors`}
        />
        <StatCard
          label="Avg Pass Probability"
          value={
            avg != null ? `${avg.toFixed(1)}%` : loading ? "..." : "—"
          }
          icon="📊"
          accent={avgColor}
          sub={
            avg == null
              ? "Run predictions to compute"
              : avg < 60
              ? "Below healthy threshold"
              : "Institution on track"
          }
          progress={avg ?? undefined}
          progressColor={avgColor}
        />
        <StatCard
          label="At-Risk Students"
          value={loadingOr(atRisk.toLocaleString())}
          icon="⚠️"
          accent={atRisk > 0 ? "#f59e0b" : "#10b981"}
          highlight={atRisk > 0}
          sub={
            totalStudents > 0
              ? `${atRiskPct}% of student body`
              : "No students yet"
          }
        />
        <StatCard
          label="Safe Students"
          value={loadingOr(safeCount.toLocaleString())}
          icon="✓"
          accent="#10b981"
          sub={
            totalStudents > 0
              ? `${100 - atRiskPct}% passing threshold`
              : "—"
          }
        />
      </div>

      {/* Risk split bar */}
      {totalStudents > 0 && !loading && (
        <div
          style={{
            border: "1px solid rgba(128,128,128,0.18)",
            borderRadius: 14,
            padding: "1.5rem 1.75rem",
            marginBottom: "2rem",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.85rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Student risk distribution
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.15rem" }}>
                Based on cached pass probability
              </div>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.55,
                fontWeight: 600,
              }}
            >
              {atRisk.toLocaleString()} at-risk / {safeCount.toLocaleString()} safe
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 12,
              borderRadius: 999,
              background: "rgba(16,185,129,0.15)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${100 - atRiskPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #059669)",
                transition: "width 0.5s ease",
              }}
            />
            <div
              style={{
                width: `${atRiskPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #f59e0b, #d97706)",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.5rem",
              fontSize: "0.72rem",
              opacity: 0.55,
            }}
          >
            <span>✓ Safe</span>
            <span>⚠️ At risk</span>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            marginBottom: "1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Quick actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          <ActionCard
            title="Manage Students"
            description="Browse, add, edit, or remove student records."
            href="/dashboard/students"
            icon="👥"
            accent="#6366f1"
          />
          <ActionCard
            title="Manage Users"
            description="Create instructor accounts, adjust roles."
            href="/dashboard/users"
            icon="⚙"
            accent="#0ea5e9"
          />
          <ActionCard
            title="Quick Prediction"
            description="Try the model with arbitrary values."
            href="/"
            icon="◎"
            accent="#8b5cf6"
          />
        </div>
      </div>

      {/* Coming soon */}
      <div
        style={{
          border: "1px solid rgba(128,128,128,0.18)",
          borderRadius: 14,
          padding: "1.75rem 2rem",
          background: "rgba(128,128,128,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(99,102,241,0.12)",
              color: "#4f46e5",
              fontSize: "1rem",
            }}
          >
            📈
          </span>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Coming soon</h3>
        </div>
        <p style={{ fontSize: "0.88rem", opacity: 0.65, lineHeight: 1.6 }}>
          Institution-wide trend chart, at-risk drill-down by instructor,
          bulk CSV upload, and intervention tracking with outcome logging.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  highlight = false,
  progress,
  progressColor,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent: string;
  sub?: string;
  highlight?: boolean;
  progress?: number;
  progressColor?: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${highlight ? `${accent}55` : "rgba(128,128,128,0.18)"}`,
        borderRadius: 14,
        padding: "1.3rem 1.5rem",
        background: highlight ? `${accent}0a` : "rgba(255,255,255,0.02)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "1.2rem",
          right: "1.3rem",
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${accent}1a`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          opacity: 0.55,
          marginBottom: "0.65rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "2.1rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: highlight ? accent : "inherit",
          lineHeight: 1.1,
          marginBottom: "0.4rem",
        }}
      >
        {value}
      </div>
      {progress != null && (
        <div
          style={{
            width: "100%",
            height: 5,
            borderRadius: 999,
            background: "rgba(128,128,128,0.12)",
            marginBottom: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: "100%",
              background: progressColor ?? accent,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      )}
      {sub && (
        <div
          style={{
            fontSize: "0.75rem",
            opacity: 0.55,
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "1.3rem 1.5rem",
        border: "1px solid rgba(128,128,128,0.18)",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s, background 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}66`;
        e.currentTarget.style.background = `${accent}08`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(128,128,128,0.18)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.55rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${accent}18`,
            color: accent,
            fontSize: "1.05rem",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{title}</span>
      </div>
      <p style={{ fontSize: "0.83rem", opacity: 0.65, lineHeight: 1.5, marginLeft: "0.1rem" }}>
        {description}
      </p>
    </Link>
  );
}