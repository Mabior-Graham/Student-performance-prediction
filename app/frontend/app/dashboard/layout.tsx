"use client";

import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "var(--content-bg, #f9fafb)",
          color: "var(--content-fg, #111827)",
        }}
      >
        <Sidebar />
        <main style={{ flex: 1, padding: "2rem 2.5rem", overflowX: "auto" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}