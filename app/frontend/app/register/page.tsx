"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, AuthError } from "../../lib/api";
import { saveAuth, type Role } from "../../lib/auth";

type LoginResponse = {
  access_token: string;
  token_type: string;
  role: Role;
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const res = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveAuth(res.access_token, res.role, email);
      router.replace("/dashboard");
    } catch (err: any) {
      if (err instanceof AuthError) {
        setError("Registration succeeded but login failed, please log in manually.");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        minHeight: "calc(100vh - 60px)",
      }}
      className="register-split"
    >
      {/* Left brand panel */}
      <div
        className="register-brand-panel"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
          color: "#f8fafc",
          padding: "3.5rem 3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
              color: "#f8fafc",
              fontWeight: 800,
              fontSize: "1.2rem",
              letterSpacing: "-0.02em",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                fontSize: "0.9rem",
                fontWeight: 800,
              }}
            >
              F
            </span>
            <span>
              Fore<span style={{ color: "#a5b4fc" }}>Sight</span>
            </span>
          </Link>

          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "3.5rem 0 1.25rem",
              maxWidth: 420,
            }}
          >
            Start identifying
            <br />
            <span style={{ color: "#a5b4fc" }}>at-risk students today.</span>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 400,
            }}
          >
            Create your account and get access to a complete early-warning
            system — no setup fees, no credit card, no waiting.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gap: "1rem", maxWidth: 420 }}>
            <Feature
              icon="🚀"
              title="Ready in seconds"
              description="Register and start managing students immediately."
            />
            <Feature
              icon="🛡"
              title="Secure from day one"
              description="Passwords are hashed with bcrypt. Tokens expire every 24 hours."
            />
            <Feature
              icon="📈"
              title="Built to grow"
              description="Handles small cohorts and 1,200+ students with the same performance."
            />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: "2.25rem" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Create your account
            </h2>
            <p style={{ fontSize: "0.92rem", opacity: 0.65 }}>
              The first account becomes administrator. Additional accounts are
              created as instructors.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <Field label="Email address">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                style={inputStyle}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={inputStyle}
              />
              {password.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 4,
                      borderRadius: 999,
                      background: "rgba(128,128,128,0.15)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${strength.pct}%`,
                        height: "100%",
                        background: strength.color,
                        transition: "width 0.2s, background 0.2s",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      opacity: 0.6,
                      marginTop: "0.35rem",
                    }}
                  >
                    Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </div>
                </div>
              )}
            </Field>

            <Field label="Confirm password">
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                style={inputStyle}
              />
              {confirm.length > 0 && password !== confirm && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#d97706",
                    marginTop: "0.35rem",
                  }}
                >
                  Passwords do not match
                </div>
              )}
              {confirm.length > 0 && password === confirm && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#059669",
                    marginTop: "0.35rem",
                  }}
                >
                  ✓ Passwords match
                </div>
              )}
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
              disabled={loading}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(128,128,128,0.15)",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ opacity: 0.65 }}>Already have an account? </span>
            <Link
              href="/login"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </div>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.8rem",
              opacity: 0.5,
            }}
          >
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .register-split {
            grid-template-columns: 1fr !important;
          }
          .register-brand-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------- Shared components ---------- */

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

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
      <div
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: 8,
          background: "rgba(165,180,252,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "0.15rem",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: "0.82rem", opacity: 0.65, lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </div>
  );
}

/* ---------- Password strength ---------- */

function getPasswordStrength(password: string): {
  pct: number;
  label: string;
  color: string;
} {
  if (password.length === 0) return { pct: 0, label: "", color: "#94a3b8" };
  if (password.length < 6) return { pct: 25, label: "Weak", color: "#b91c1c" };
  if (password.length < 10) return { pct: 50, label: "Moderate", color: "#d97706" };
  if (password.length < 14) return { pct: 75, label: "Strong", color: "#0ea5e9" };
  return { pct: 100, label: "Very strong", color: "#059669" };
}