"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../../../lib/api";
import ProtectedRoute from "../../../../../components/ProtectedRoute";

const EMPTY = {
  name: "",
  age: 20,
  gender: "male",
  course: "diploma",
  study_hours: 4,
  class_attendance: 80,
  internet_access: "yes",
  sleep_hours: 7,
  sleep_quality: "average",
  study_method: "self-study",
  facility_rating: "moderate",
  exam_difficulty: "moderate",
};

type Form = typeof EMPTY;

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [form, setForm] = useState<Form>({ ...EMPTY });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!id || isNaN(id)) return;
    apiFetch(`/students/${id}`)
      .then((s: any) => {
        setForm({
          name: s.name,
          age: s.age,
          gender: s.gender,
          course: s.course,
          study_hours: s.study_hours,
          class_attendance: s.class_attendance,
          internet_access: s.internet_access,
          sleep_hours: s.sleep_hours,
          sleep_quality: s.sleep_quality,
          study_method: s.study_method,
          facility_rating: s.facility_rating,
          exam_difficulty: s.exam_difficulty,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      router.push(`/dashboard/students/${id}`);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ padding: "3rem", opacity: 0.6 }}>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ padding: "2.5rem 2rem", maxWidth: 820, margin: "0 auto" }}>
        <Link
          href={`/dashboard/students/${id}`}
          style={{
            fontSize: "0.85rem",
            color: "#4f46e5",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back to student
        </Link>

        <h1 style={{ fontSize: "1.7rem", margin: "1rem 0 0.3rem", letterSpacing: "-0.02em" }}>
          Edit Student
        </h1>
        <p style={{ opacity: 0.6, fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          Update profile information. Changes are saved immediately.
        </p>

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

        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid rgba(128,128,128,0.18)",
            borderRadius: 14,
            padding: "2.25rem 2rem",
            background: "rgba(255,255,255,0.02)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Section: Identity */}
          <Section title="Identity">
            <div style={{ display: "grid", gap: "1.75rem" }}>
              <Field label="Full name" hint="The student's full name as it appears on the record">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  style={inputStyle}
                />
              </Field>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.75rem",
                }}
              >
                <Field label="Age" hint="Between 10 and 100">
                  <input
                    type="number"
                    min={10}
                    max={100}
                    required
                    value={form.age}
                    onChange={(e) => set("age", Number(e.target.value))}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Course level" hint="Their current academic programme">
                <select
                  value={form.course}
                  onChange={(e) => set("course", e.target.value)}
                  style={inputStyle}
                >
                  {["diploma","undergraduate","postgraduate","phd","certificate","professional","vocational"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {/* Section: Study Habits */}
          <Section title="Study Habits">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.75rem",
              }}
            >
              <Field label="Study hours / day" hint="Average hours spent studying per day (0–24)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={24}
                  value={form.study_hours}
                  onChange={(e) => set("study_hours", Number(e.target.value))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Class attendance %" hint="Percentage of classes attended (0–100)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={form.class_attendance}
                  onChange={(e) => set("class_attendance", Number(e.target.value))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Internet access" hint="Reliable internet at home or study space">
                <select
                  value={form.internet_access}
                  onChange={(e) => set("internet_access", e.target.value)}
                  style={inputStyle}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="Study method" hint="Primary learning approach">
                <select
                  value={form.study_method}
                  onChange={(e) => set("study_method", e.target.value)}
                  style={inputStyle}
                >
                  {["coaching","self-study","group-study","online","tutoring"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {/* Section: Wellbeing */}
          <Section title="Wellbeing" last>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.75rem",
              }}
            >
              <Field label="Sleep hours / day" hint="Average nightly sleep (0–24)">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={24}
                  value={form.sleep_hours}
                  onChange={(e) => set("sleep_hours", Number(e.target.value))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Sleep quality" hint="Self-reported sleep quality">
                <select
                  value={form.sleep_quality}
                  onChange={(e) => set("sleep_quality", e.target.value)}
                  style={inputStyle}
                >
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                </select>
              </Field>
              <Field label="Facility rating" hint="Quality of study facilities available">
                <select
                  value={form.facility_rating}
                  onChange={(e) => set("facility_rating", e.target.value)}
                  style={inputStyle}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Exam difficulty" hint="Expected difficulty of the upcoming exam">
                <select
                  value={form.exam_difficulty}
                  onChange={(e) => set("exam_difficulty", e.target.value)}
                  style={inputStyle}
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(128,128,128,0.15)",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/dashboard/students/${id}`}
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.25)",
                color: "inherit",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Shared components ---------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.8rem",
  borderRadius: 8,
  border: "1px solid rgba(128,128,128,0.25)",
  fontSize: "0.88rem",
  background: "rgba(255,255,255,0.5)",
  color: "inherit",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.85 }}>
        {label}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: "0.72rem", opacity: 0.55, lineHeight: 1.4 }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        paddingBottom: last ? 0 : "2rem",
        marginBottom: last ? 0 : "2rem",
        borderBottom: last ? "none" : "1px solid rgba(128,128,128,0.12)",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 700,
          opacity: 0.5,
          marginBottom: "1.25rem",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}