"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import ProtectedRoute from "../../../components/ProtectedRoute";

type Student = {
  id: number;
  name: string;
  age: number;
  gender: string;
  course: string;
  class_attendance: number;
  instructor_id: number | null;
  instructor_name: string | null;
  pass_probability: number | null;
};

export default function StudentsPage() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Student[]>("/students");
      setStudents(data);
    } catch (e: any) {
      setError(e.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/students/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete student");
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "2.5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.7rem", marginBottom: "0.3rem", letterSpacing: "-0.02em" }}>
              {isAdmin ? "All Students" : "My Students"}
            </h1>
            <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
              {isAdmin ? "Institution-wide student roster." : "Your assigned advisees."}
            </p>
          </div>
          <Link
            href="/dashboard/students/add"
            style={{
              padding: "0.6rem 1.15rem",
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            + Add Student
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
              marginBottom: "1.25rem",
              border: "1px solid rgba(220,38,38,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ opacity: 0.6 }}>Loading students...</p>
        ) : students.length === 0 ? (
          <div
            style={{
              border: "1px dashed rgba(128,128,128,0.3)",
              borderRadius: 12,
              padding: "3rem 1rem",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              {isAdmin ? "No students yet." : "No students assigned to you yet."}
            </p>
            <Link
              href="/dashboard/students/add"
              style={{
                display: "inline-block",
                padding: "0.55rem 1rem",
                borderRadius: 8,
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#4f46e5",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              + Add your first student
            </Link>
          </div>
        ) : (
          <div
            style={{
              border: "1px solid rgba(128,128,128,0.18)",
              borderRadius: 14,
              overflow: "hidden",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
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
                  <th style={{ padding: "0.9rem 0.75rem" }}>Name</th>
                  <th style={{ padding: "0.9rem 0.75rem" }}>Course</th>
                  <th style={{ padding: "0.9rem 0.75rem" }}>Age</th>
                  <th style={{ padding: "0.9rem 0.75rem" }}>Attendance</th>
                  {isAdmin && <th style={{ padding: "0.9rem 0.75rem" }}>Instructor</th>}
                  <th style={{ padding: "0.9rem 0.75rem" }}>Pass Probability</th>
                  <th style={{ padding: "0.9rem 0.75rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: "1px solid rgba(128,128,128,0.1)" }}
                  >
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>
                      <Link
                        href={`/dashboard/students/${s.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem", opacity: 0.75 }}>{s.course}</td>
                    <td style={{ padding: "0.75rem", opacity: 0.75 }}>{s.age}</td>
                    <td style={{ padding: "0.75rem", opacity: 0.75 }}>
                      {s.class_attendance}%
                    </td>
                    {isAdmin && (
                      <td style={{ padding: "0.75rem", opacity: 0.75, fontSize: "0.82rem" }}>
                        {s.instructor_name ?? <span style={{ opacity: 0.4 }}>Unassigned</span>}
                      </td>
                    )}
                    <td style={{ padding: "0.75rem" }}>
                      <PassProbBadge value={s.pass_probability} />
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Link
                        href={`/dashboard/students/${s.id}`}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: 6,
                          background: "rgba(99,102,241,0.1)",
                          color: "#4f46e5",
                          textDecoration: "none",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          marginRight: "0.4rem",
                        }}
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/students/${s.id}/edit`}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: 6,
                          border: "1px solid rgba(128,128,128,0.3)",
                          color: "inherit",
                          textDecoration: "none",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          marginRight: "0.4rem",
                        }}
                      >
                        Edit
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: 6,
                            border: "1px solid rgba(220,38,38,0.3)",
                            background: "transparent",
                            color: "#b91c1c",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function PassProbBadge({ value }: { value: number | null }) {
  if (value == null) {
    return <span style={{ opacity: 0.4, fontSize: "0.82rem" }}>—</span>;
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