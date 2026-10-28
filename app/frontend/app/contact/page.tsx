"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    institution: "",
    role: "administrator",
    students: "500-2000",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    // In a real deployment this would POST to a backend endpoint.
    // For the FYP prototype, we simulate success and show a confirmation.
    setSubmitted(true);
  };

  return (
    <main style={{ padding: "4rem 1.5rem 5rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-block",
            padding: "0.35rem 0.9rem",
            borderRadius: 999,
            background: "rgba(99,102,241,0.1)",
            color: "#4f46e5",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          Get in touch
        </div>
        <h1
          style={{
            fontSize: "2.5rem",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            marginBottom: "1rem",
          }}
        >
          Let's talk about your institution.
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.65,
            opacity: 0.7,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          Whether you're evaluating ForeSight for a department, a faculty, or an
          entire institution, we're happy to walk you through it — no sales
          pitch, no pressure.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)",
          gap: "2.5rem",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* Left column — contact channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <ContactCard
            icon="💬"
            title="Talk to us"
            description="For evaluations, pricing, or deployment questions."
          >
            <a
              href="mailto:hello@foresight.ss"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              hello@foresight.ss
            </a>
          </ContactCard>

          <ContactCard
            icon="🎓"
            title="Academic partnerships"
            description="For research collaborations and university pilots."
          >
            <a
              href="mailto:research@foresight.ss"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              research@foresight.ss
            </a>
          </ContactCard>

          <ContactCard
            icon="🔒"
            title="Privacy & data protection"
            description="For data protection requests and institutional agreements."
          >
            <a
              href="mailto:privacy@foresight.ss"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              privacy@foresight.ss
            </a>
          </ContactCard>

          <div
            style={{
              padding: "1.25rem 1.4rem",
              borderRadius: 12,
              background: "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#4f46e5",
              }}
            >
              Response time
            </div>
            <p style={{ fontSize: "0.88rem", opacity: 0.75, lineHeight: 1.6 }}>
              We reply to every inquiry within <strong>two business days</strong>.
              Institutional pilots usually get a response within 24 hours.
            </p>
          </div>
        </div>

        {/* Right column — form or success message */}
        <div>
          {submitted ? (
            <div
              style={{
                padding: "3rem 2.5rem",
                borderRadius: 16,
                border: "1px solid rgba(5,150,105,0.25)",
                background: "rgba(5,150,105,0.04)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(5,150,105,0.15)",
                  fontSize: "1.6rem",
                  marginBottom: "1rem",
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                }}
              >
                Message received
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  opacity: 0.75,
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                  maxWidth: 420,
                  margin: "0 auto 1.75rem",
                }}
              >
                Thanks, {form.name}. We'll be in touch within two business days
                at <strong>{form.email}</strong>.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "0.7rem 1.5rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "2.25rem 2rem",
                borderRadius: 16,
                border: "1px solid rgba(128,128,128,0.18)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    marginBottom: "0.4rem",
                  }}
                >
                  Send us a message
                </h2>
                <p style={{ fontSize: "0.88rem", opacity: 0.6 }}>
                  Fields marked * are required.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <Field label="Your name *">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Doe"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Work email *">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="jane@institution.edu"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Institution">
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
                  placeholder="University of Juba"
                  style={inputStyle}
                />
              </Field>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <Field label="Your role">
                  <select
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="administrator">Administrator / Dean</option>
                    <option value="instructor">Instructor / Advisor</option>
                    <option value="it">IT / Infrastructure</option>
                    <option value="researcher">Researcher</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                <Field label="Cohort size">
                  <select
                    value={form.students}
                    onChange={(e) => set("students", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="under-500">Under 500 students</option>
                    <option value="500-2000">500 – 2,000 students</option>
                    <option value="2000-10000">2,000 – 10,000 students</option>
                    <option value="over-10000">Over 10,000 students</option>
                  </select>
                </Field>
              </div>

              <Field label="How can we help? *">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Tell us a bit about your institution and what you're evaluating..."
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </Field>

              {error && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(220,38,38,0.08)",
                    color: "#b91c1c",
                    border: "1px solid rgba(220,38,38,0.2)",
                    borderRadius: 8,
                    fontSize: "0.85rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                  marginTop: "0.5rem",
                }}
              >
                Send message →
              </button>

              <p
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.55,
                  lineHeight: 1.6,
                  textAlign: "center",
                  marginTop: "0.5rem",
                }}
              >
                We'll only use your information to respond to this inquiry.
                See our{" "}
                <Link
                  href="/about"
                  style={{ color: "#4f46e5", textDecoration: "none" }}
                >
                  about page
                </Link>{" "}
                for data handling details.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <section style={{ marginTop: "4.5rem" }}>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Frequently asked questions
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: 780,
            margin: "0 auto",
          }}
        >
          <FAQItem
            question="Is ForeSight free for institutions?"
            answer="ForeSight is an academic research project. Institutional pilots are offered free of charge in exchange for feedback and (where appropriate) anonymised usage data. Commercial licensing terms are available on request."
          />
          <FAQItem
            question="Do we need a learning management system to use ForeSight?"
            answer="No. ForeSight does not require an LMS integration. Student records can be created manually or imported via CSV. If your institution has an LMS and wants to integrate in future, that extension is possible but not required for initial use."
          />
          <FAQItem
            question="Where is student data stored?"
            answer="All data is stored on the institution's own infrastructure — either on-premises or on a VPS you control. No data is sent to any third-party service. See the About page for details on encryption and access controls."
          />
          <FAQItem
            question="How accurate are the predictions?"
            answer="The model achieves R² = 0.73 on held-out test data, meaning it explains about 73% of the variance in exam scores. Predictions are a decision aid, not a final grade — we recommend that institutions use them to guide intervention, not as authoritative assessments."
          />
          <FAQItem
            question="What happens after a student is flagged?"
            answer="ForeSight shows the advisor the student's full profile and the factors driving the prediction — attendance, study hours, sleep quality, and so on. The advisor decides the intervention, and the system records it. The goal is to make the right action obvious, not to automate decisions."
          />
          <FAQItem
            question="Can ForeSight be deployed in a low-resource environment?"
            answer="Yes — that's exactly what it's designed for. ForeSight runs on a single laptop, a modest local server, or a small cloud instance. It has no external cloud dependencies, no proprietary licences, and no LMS integration requirement."
          />
        </div>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: 10,
  border: "1px solid rgba(128,128,128,0.25)",
  fontSize: "0.92rem",
  background: "rgba(255,255,255,0.5)",
  color: "inherit",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.85 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.25rem 1.4rem",
        borderRadius: 12,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          marginBottom: "0.6rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "rgba(99,102,241,0.1)",
            fontSize: "1rem",
          }}
        >
          {icon}
        </span>
        <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{title}</span>
      </div>
      <p
        style={{
          fontSize: "0.83rem",
          opacity: 0.65,
          lineHeight: 1.5,
          marginBottom: "0.5rem",
        }}
      >
        {description}
      </p>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details
      style={{
        padding: "1.15rem 1.4rem",
        borderRadius: 12,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
        cursor: "pointer",
      }}
    >
      <summary
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {question}
        <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>▾</span>
      </summary>
      <p
        style={{
          fontSize: "0.88rem",
          opacity: 0.75,
          lineHeight: 1.7,
          marginTop: "0.75rem",
        }}
      >
        {answer}
      </p>
    </details>
  );
}