"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { isLoggedIn, role, email, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const initials = email ? email.charAt(0).toUpperCase() : "?";
  const dashboardHref =
    role === "admin" ? "/dashboard/admin" : "/dashboard/instructor";

  // Hide marketing nav links while inside the dashboard shell
  const onDashboard = pathname?.startsWith("/dashboard");

  const navLinkStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    textDecoration: "none",
    color: "inherit",
    opacity: 0.8,
    fontWeight: 500,
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: 60,
        borderBottom: "1px solid rgba(128,128,128,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.75)",
      }}
    >
      {/* Left — Brand + Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
        <Link
          href={isLoggedIn ? dashboardHref : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            color: "inherit",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 800,
            }}
          >
            F
          </span>
          Fore<span style={{ color: "#6366f1" }}>Sight</span>
        </Link>

        {/* Public links — hidden on dashboard pages (sidebar takes over) */}
        {!onDashboard && (
          <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link href="/about" style={navLinkStyle}>
              About
            </Link>
            <Link href="/contact" style={navLinkStyle}>
              Contact
            </Link>
            {isLoggedIn && (
              <Link href={dashboardHref} style={navLinkStyle}>
                Dashboard
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Right — Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />

        {isLoggedIn ? (
          <>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0.25rem 0.6rem",
                borderRadius: 999,
                background:
                  role === "admin"
                    ? "rgba(99,102,241,0.12)"
                    : "rgba(16,185,129,0.12)",
                color: role === "admin" ? "#4f46e5" : "#059669",
              }}
            >
              {role}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.75rem 0.25rem 0.25rem",
                borderRadius: 999,
                border: "1px solid rgba(128,128,128,0.2)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {initials}
              </span>
              <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>{email}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.25)",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 500,
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(128,128,128,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                fontSize: "0.85rem",
                textDecoration: "none",
                color: "inherit",
                opacity: 0.75,
                padding: "0.4rem 0.6rem",
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: "0.85rem",
                textDecoration: "none",
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                padding: "0.45rem 1rem",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}