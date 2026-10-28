"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../../lib/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";

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

const STEPS = [
  { id: 1, title: "Identity", subtitle: "Basic student information" },
  { id: 2, title: "Study Habits", subtitle: "Learning patterns and access" },
  { id: 3, title: "Wellbeing", subtitle: "Sleep and environment factors" },
  { id: 4, title: "Review", subtitle: "Confirm before saving" },
];

export default function AddStudentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const next = () => {
    if (step === 1 && !form.name.trim()) {
      setError("Name is required to continue");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/dashboard/students");
    } catch (e: any) {
      setError(e.message || "Failed to add student");
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[step - 1];

  return (
    <ProtectedRoute>
      <div style={{ padding: "2.5rem 2rem", maxWidth: 780, margin: "0 auto" }}>
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

        <h1 style={{ fontSize: "1.7rem", margin: "1rem 0 0.3rem", letterSpacing: "-0.02em" }}>
          Add Student
        </h1>
        <p style={{ opacity: 0.6, fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          {currentStep.subtitle}
        </p>

        {/* Stepper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      background: done
                        ? "#10b981"
                        : active
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(128,128,128,0.12)",
                      color: done || active ? "#fff" : "inherit",
                      opacity: active || done ? 1 : 0.55,
                      boxShadow: active ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {done ? "✓" : s.id}
                  </div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: active ? 600 : 400,
                      opacity: active ? 1 : 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      margin: "0 0.75rem",
                      background: done ? "#10b981" : "rgba(128,128,128,0.15)",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
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

        {/* Card */}
        <div
          style={{
            border: "1px solid rgba(128,128,128,0.18)",
            borderRadius: 14,
            padding: "2.25rem 2rem",
            marginBottom: "1.75rem",
            background: "rgba(255,255,255,0.02)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {step === 1 && <StepIdentity form={form} set={set} />}
          {step === 2 && <StepStudy form={form} set={set} />}
          {step === 3 && <StepWellbeing form={form} set={set} />}
          {step === 4 && <StepReview form={form} />}
        </div>

        {/* Nav buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <div>
            {step > 1 && (
              <button
                onClick={back}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: 8,
                  border: "1px solid rgba(128,128,128,0.3)",
                  background: "transparent",
                  color: "inherit",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <Link
              href="/dashboard/students"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.3)",
                color: "inherit",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Cancel
            </Link>
            {step < 4 ? (
              <button
                onClick={next}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: saving ? "wait" : "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Student"}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Step 1 ---------- */

function StepIdentity({ form, set }: { form: Form; set: Setter }) {
  return (
    <div style={{ display: "grid", gap: "1.75rem" }}>
      <Field label="Full name" hint="The student's full name as it appears on the record">
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. John Doe"
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
  );
}

/* ---------- Step 2 ---------- */

function StepStudy({ form, set }: { form: Form; set: Setter }) {
  return (
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
  );
}

/* ---------- Step 3 ---------- */

function StepWellbeing({ form, set }: { form: Form; set: Setter }) {
  return (
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
  );
}

/* ---------- Step 4 ---------- */

function StepReview({ form }: { form: Form }) {
  const sections = [
    {
      title: "Identity",
      items: [
        ["Full name", form.name],
        ["Age", form.age],
        ["Gender", form.gender],
        ["Course", form.course],
      ],
    },
    {
      title: "Study Habits",
      items: [
        ["Study hours / day", form.study_hours],
        ["Class attendance", `${form.class_attendance}%`],
        ["Internet access", form.internet_access],
        ["Study method", form.study_method],
      ],
    },
    {
      title: "Wellbeing",
      items: [
        ["Sleep hours / day", form.sleep_hours],
        ["Sleep quality", form.sleep_quality],
        ["Facility rating", form.facility_rating],
        ["Exam difficulty", form.exam_difficulty],
      ],
    },
  ];

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      {sections.map((sec) => (
        <div key={sec.title}>
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700,
              opacity: 0.5,
              marginBottom: "0.85rem",
            }}
          >
            {sec.title}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              fontSize: "0.88rem",
            }}
          >
            {sec.items.map(([label, value]) => (
              <div
                key={String(label)}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: 10,
                  background: "rgba(128,128,128,0.06)",
                  border: "1px solid rgba(128,128,128,0.1)",
                }}
              >
                <div style={{ fontSize: "0.72rem", opacity: 0.55, marginBottom: "0.3rem" }}>
                  {label}
                </div>
                <div style={{ fontWeight: 600 }}>{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Shared ---------- */

type Setter = <K extends keyof Form>(key: K, value: Form[K]) => void;

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