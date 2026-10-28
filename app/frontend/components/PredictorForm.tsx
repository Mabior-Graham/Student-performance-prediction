"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { apiFetch } from "../lib/api";

type Form = {
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
};

type Prediction = {
  exam_score: number;
  confidence_level: string;
  pass_probability: number;
};

type FeatureImportance = { feature: string; importance: number };

const DEFAULT_FORM: Form = {
  age: 20,
  gender: "male",
  course: "undergraduate",
  study_hours: 5.0,
  class_attendance: 80.0,
  internet_access: "yes",
  sleep_hours: 7.0,
  sleep_quality: "average",
  study_method: "self-study",
  facility_rating: "moderate",
  exam_difficulty: "moderate",
};

export default function PredictorForm() {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [result, setResult] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);

  useEffect(() => {
    apiFetch<FeatureImportance[]>("/feature_importance")
      .then(setFeatureImportance)
      .catch((err) => console.error("Failed to load insights", err));
  }, []);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiFetch<Prediction>("/predict", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.exam_score < 40
      ? "#b91c1c"
      : result.exam_score < 60
      ? "#d97706"
      : "#059669"
    : "#6366f1";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid rgba(128,128,128,0.2)",
          borderRadius: 14,
          padding: "2rem",
          background: "rgba(255,255,255,0.02)",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.15rem", marginBottom: "1.5rem", fontWeight: 700 }}>
          Student Details
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem 1.75rem",
            marginBottom: "2rem",
          }}
        >
          <Field label="Age">
            <input
              type="number"
              min={10}
              max={100}
              value={form.age}
              onChange={(e) => set("age", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="Study hours / day">
            <input
              type="number"
              step="0.5"
              min={0}
              max={24}
              value={form.study_hours}
              onChange={(e) => set("study_hours", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="Class attendance %">
            <input
              type="number"
              step="1"
              min={0}
              max={100}
              value={form.class_attendance}
              onChange={(e) => set("class_attendance", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="Sleep hours / day">
            <input
              type="number"
              step="0.5"
              min={0}
              max={24}
              value={form.sleep_hours}
              onChange={(e) => set("sleep_hours", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)} style={inputStyle}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Course level">
            <select value={form.course} onChange={(e) => set("course", e.target.value)} style={inputStyle}>
              {["diploma","undergraduate","postgraduate","phd","certificate","professional","vocational"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Internet access">
            <select value={form.internet_access} onChange={(e) => set("internet_access", e.target.value)} style={inputStyle}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Sleep quality">
            <select value={form.sleep_quality} onChange={(e) => set("sleep_quality", e.target.value)} style={inputStyle}>
              <option value="poor">Poor</option>
              <option value="average">Average</option>
              <option value="good">Good</option>
            </select>
          </Field>
          <Field label="Study method">
            <select value={form.study_method} onChange={(e) => set("study_method", e.target.value)} style={inputStyle}>
              {["coaching","self-study","group-study","online","tutoring"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Facility rating">
            <select value={form.facility_rating} onChange={(e) => set("facility_rating", e.target.value)} style={inputStyle}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Exam difficulty">
            <select value={form.exam_difficulty} onChange={(e) => set("exam_difficulty", e.target.value)} style={inputStyle}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Calculating..." : "Predict Score"}
        </button>
      </form>

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

      {result && (
        <div
          style={{
            border: `1px solid ${scoreColor}33`,
            background: `${scoreColor}08`,
            borderRadius: 14,
            padding: "1.75rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              opacity: 0.6,
              marginBottom: "0.5rem",
            }}
          >
            Predicted Exam Score
          </div>
          <div style={{ fontSize: "3.5rem", fontWeight: 800, color: scoreColor, lineHeight: 1.1 }}>
            {result.exam_score.toFixed(1)}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "0.85rem",
              fontSize: "0.85rem",
              opacity: 0.8,
              flexWrap: "wrap",
            }}
          >
            <span>Confidence: <strong>{result.confidence_level}</strong></span>
            <span>Pass probability: <strong>{(result.pass_probability * 100).toFixed(0)}%</strong></span>
          </div>
        </div>
      )}

      {featureImportance.length > 0 && (
        <div
          style={{
            border: "1px solid rgba(128,128,128,0.2)",
            borderRadius: 14,
            padding: "1.75rem",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem", fontWeight: 700 }}>
            What drives higher scores?
          </h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={featureImportance}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={170}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                    borderRadius: 8,
                  }}
                  itemStyle={{ color: "#a5b4fc" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {featureImportance.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? "#6366f1" : "#475569"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  borderRadius: 8,
  border: "1px solid rgba(128,128,128,0.25)",
  fontSize: "0.88rem",
  background: "rgba(255,255,255,0.5)",
  color: "inherit",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.85 }}>{label}</label>
      {children}
    </div>
  );
}