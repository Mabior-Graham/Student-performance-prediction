"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";

type User = {
  id: number;
  email: string;
  role: "admin" | "instructor";
  created_at: string;
  student_count: number;
};

const EMPTY_FORM = {
  email: "",
  password: "",
  role: "instructor" as "instructor" | "admin",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<User[]>("/auth/admin/users");
      setUsers(data);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/auth/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowAdd(false);
      setForm({ ...EMPTY_FORM });
      await loadUsers();
    } catch (e: any) {
      setError(e.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.7rem", marginBottom: "0.3rem", letterSpacing: "-0.02em" }}>
              Users
            </h1>
            <p style={{ opacity: 0.65, fontSize: "0.9rem" }}>
              Manage instructor accounts and admin access.
            </p>
          </div>
          <button
            onClick={() => setShowAdd((v) => !v)}
            style={{
              padding: "0.6rem 1.15rem",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {showAdd ? "Cancel" : "+ Create User"}
          </button>
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

        {/* Add form */}
        {showAdd && (
          <form
            onSubmit={handleCreate}
            style={{
              border: "1px solid rgba(128,128,128,0.18)",
              borderRadius: 14,
              padding: "1.75rem",
              marginBottom: "1.75rem",
              background: "rgba(255,255,255,0.02)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              alignItems: "end",
            }}
          >
            <Field label="Email">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="instructor@foresight.ss"
                style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="min 6 characters"
                style={inputStyle}
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as "instructor" | "admin" })
                }
                style={inputStyle}
              >
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.65rem 1.1rem",
                borderRadius: 8,
                border: "none",
                background: "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: saving ? "wait" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {saving ? "Creating..." : "Create User"}
            </button>
          </form>
        )}

        {/* Table */}
        {loading ? (
          <p style={{ opacity: 0.6 }}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No users found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  <th style={{ padding: "0.75rem 0.5rem" }}>Email</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Role</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Students</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: "1px solid rgba(128,128,128,0.1)" }}
                  >
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 500 }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          padding: "0.2rem 0.55rem",
                          borderRadius: 999,
                          background:
                            u.role === "admin"
                              ? "rgba(99,102,241,0.12)"
                              : "rgba(16,185,129,0.12)",
                          color: u.role === "admin" ? "#4f46e5" : "#059669",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", opacity: 0.75 }}>
                      {u.role === "instructor" ? u.student_count : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", opacity: 0.65, fontSize: "0.82rem" }}>
                      {new Date(u.created_at).toLocaleDateString()}
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

/* ---------- Shared ---------- */

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