"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

type Student = {
  id: number;
  name: string;
  course: string;
  class_attendance: number;
  study_hours: number;
  pass_probability: number | null;
};

export default function InstructorDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Student[]>("/students")
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = students.length;
  const atRisk = students.filter(
    (s) => s.pass_probability != null && s.pass_probability < 0.4
  );
  const onTrack = students.filter(
    (s) => s.pass_probability != null && s.pass_probability >= 0.6
  );
  const pending = students.filter((s) => s.pass_probability == null);
  const moderate = students.filter(
    (s) =>
      s.pass_probability != null &&
      s.pass_probability >= 0.4 &&
      s.pass_probability < 0.6
  );

  const atRiskPct = total > 0 ? Math.round((atRisk.length / total) * 100) : 0;
  const avgProb =
    students.filter((s) => s.pass_probability != null).length > 0
      ? Math.round(
          (students
            .filter((s) => s.pass_probability != null)
            .reduce((sum, s) => sum + (s.pass_probability ?? 0), 0) /
            students.filter((s) => s.pass_probability != null).length) *
            100
        )
      : null;

  // Sort: most at-risk first
  const sortedStudents = [...students].sort((a, b) => {
    const pa = a.pass_probability ?? 1;
    const pb = b.pass_probability ?? 1;
    return pa - pb;
  });

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
            My Cohort
          </div>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "0.4rem",
              letterSpacing: "-0.03em",
              fontWeight: 800,
            }}
          >
            Instructor Dashboard
          </h1>
          <p style={{ opacity: 0.6, fontSize: "0.92rem" }}>
            Your advisees and their current risk profile.
          </p>
        </div>
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
          View My Students →
        </Link>
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
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="My Students"
          value={loading ? "..." : total.toLocaleString()}
          icon="👥"
          accent="#6366f1"
          sub="Assigned to you"
        />
        <StatCard
          label="Avg Pass Probability"
          value={
            avgProb != null
              ? `${avgProb}%`
              : loading
              ? "..."
              : "—"
          }
          icon="📊"
          accent={
            avgProb == null
              ? "#0ea5e9"
              : avgProb < 40
              ? "#b91c1c"
              : avgProb < 60
              ? "#d97706"
              : "#059669"
          }
          sub={
            avgProb == null
              ? "No predictions yet"
              : avgProb < 60
              ? "Below healthy threshold"
              : "Cohort on track"
          }
          progress={avgProb ?? undefined}
          progressColor={
            avgProb == null
              ? "#0ea5e9"
              : avgProb < 40
              ? "#b91c1c"
              : avgProb < 60
              ? "#d97706"
              : "#059669"
          }
        />
        <StatCard
          label="At Risk"
          value={loading ? "..." : atRisk.length.toLocaleString()}
          icon="⚠️"
          accent={atRisk.length > 0 ? "#f59e0b" : "#10b981"}
          highlight={atRisk.length > 0}
          sub={
            total > 0
              ? `${atRiskPct}% of your cohort`
              : "No students yet"
          }
        />
        <StatCard
          label="On Track"
          value={loading ? "..." : onTrack.length.toLocaleString()}
          icon="✓"
          accent="#10b981"
          sub={
            total > 0
              ? `${Math.round((onTrack.length / total) * 100)}% likely to pass`
              : "—"
          }
        />
      </div>

      {/* Risk distribution */}
      {total > 0 && !loading && (
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
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Cohort risk breakdown
              </div>
              <div
                style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.15rem" }}
              >
                Based on cached pass probability
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem" }}>
              <LegendDot color="#b91c1c" label={`High (${atRisk.length})`} />
              <LegendDot color="#d97706" label={`Moderate (${moderate.length})`} />
              <LegendDot color="#059669" label={`Low (${onTrack.length})`} />
              {pending.length > 0 && (
                <LegendDot
                  color="#94a3b8"
                  label={`Pending (${pending.length})`}
                />
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 12,
              borderRadius: 999,
              background: "rgba(128,128,128,0.12)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <Segment
              width={
                total > 0 ? (atRisk.length / total) * 100 : 0
              }
              color="#b91c1c"
            />
            <Segment
              width={
                total > 0 ? (moderate.length / total) * 100 : 0
              }
              color="#d97706"
            />
            <Segment
              width={
                total > 0 ? (onTrack.length / total) * 100 : 0
              }
              color="#059669"
            />
            <Segment
              width={
                total > 0 ? (pending.length / total) * 100 : 0
              }
              color="#94a3b8"
            />
          </div>
        </div>
      )}

      {/* At-risk students list */}
      {atRisk.length > 0 && (
        <div
          style={{
            border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: 14,
            padding: "1.5rem 1.75rem",
            marginBottom: "2rem",
            background: "rgba(245,158,11,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>
                Needs your attention
              </h2>
              <p
                style={{
                  fontSize: "0.82rem",
                  opacity: 0.7,
                  marginTop: "0.15rem",
                }}
              >
                {atRisk.length} students likely to fail — reach out soon
              </p>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {atRisk.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/students/${s.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0.9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(245,158,11,0.25)",
                  background: "rgba(255,255,255,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.6)";
                  e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                    {s.course} · {s.class_attendance}% attendance
                  </div>
                </div>
                <ProbBadge value={s.pass_probability} />
              </Link>
            ))}
          </div>
          {atRisk.length > 6 && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Link
                href="/dashboard/students"
                style={{
                  fontSize: "0.85rem",
                  color: "#d97706",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View all {atRisk.length} at-risk students →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Full student table */}
      <div
        style={{
          border: "1px solid rgba(128,128,128,0.18)",
          borderRadius: 14,
          padding: "1.75rem 2rem",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
            All my students
          </h2>
          <Link
            href="/dashboard/students"
            style={{
              fontSize: "0.82rem",
              color: "#4f46e5",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Manage →
          </Link>
        </div>
        {loading ? (
          <p style={{ opacity: 0.6 }}>Loading students...</p>
        ) : students.length === 0 ? (
          <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
            No students assigned to you yet. Contact your administrator.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                fontSize: "0.88rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid rgba(128,128,128,0.2)",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    opacity: 0.6,
                  }}
                >
                  <th style={{ padding: "0.75rem 0.5rem" }}>Name</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Course</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Attendance</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Pass Probability</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((s) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: "1px solid rgba(128,128,128,0.1)",
                    }}
                  >
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>
                      <Link
                        href={`/dashboard/students/${s.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", opacity: 0.75 }}>
                      {s.course}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", opacity: 0.75 }}>
                      {s.class_attendance}%
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <ProbBadge value={s.pass_probability} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

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
        border: `1px solid ${
          highlight ? `${accent}55` : "rgba(128,128,128,0.18)"
        }`,
        borderRadius: 14,
        padding: "1.3rem 1.5rem",
        background: highlight ? `${accent}0a` : "rgba(255,255,255,0.02)",
        position: "relative",
        overflow: "hidden",
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
        <div style={{ fontSize: "0.75rem", opacity: 0.55, lineHeight: 1.4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function ProbBadge({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span style={{ fontSize: "0.78rem", opacity: 0.45, fontWeight: 600 }}>
        Pending
      </span>
    );
  }
  const pct = Math.round(value * 100);
  const color =
    pct < 40 ? "#b91c1c" : pct < 60 ? "#d97706" : "#059669";
  const bg =
    pct < 40
      ? "rgba(185,28,28,0.1)"
      : pct < 60
      ? "rgba(217,119,6,0.1)"
      : "rgba(5,150,105,0.1)";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: 999,
        background: bg,
        color,
        fontSize: "0.78rem",
        fontWeight: 700,
      }}
    >
      {pct}%
    </span>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ opacity: 0.65 }}>{label}</span>
    </span>
  );
}

function Segment({ width, color }: { width: number; color: string }) {
  if (width <= 0) return null;
  return (
    <div
      style={{
        width: `${width}%`,
        height: "100%",
        background: color,
        transition: "width 0.5s ease",
      }}
    />
  );
}