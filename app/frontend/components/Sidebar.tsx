"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

type NavItem = { label: string; href: string; icon: string };

const INSTRUCTOR_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard/instructor", icon: "▦" },
  { label: "My Students", href: "/dashboard/students", icon: "👥" },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: "▦" },
  { label: "All Students", href: "/dashboard/students", icon: "👥" },
  { label: "Users", href: "/dashboard/users", icon: "⚙" },
];

export default function Sidebar() {
  const { role, email, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const items = role === "admin" ? ADMIN_ITEMS : INSTRUCTOR_ITEMS;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    return pathname === href || (pathname?.startsWith(href + "/") ?? false);
  };

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        width: 260,
        minWidth: 260,
        height: "100vh",
        position: "sticky",
        top: 0,
        padding: "1.5rem 1rem",
        background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        color: "#f8fafc",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.02em",
            color: "#f8fafc",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 800,
            }}
          >
            F
          </span>
          <span>
            Fore<span style={{ color: "#a5b4fc" }}>Sight</span>
          </span>
        </Link>
        <div
          style={{
            fontSize: "0.68rem",
            opacity: 0.5,
            marginTop: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
          }}
        >
          {role === "admin" ? "Administrator" : "Instructor"}
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          flex: 1,
        }}
      >
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.75rem",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: active ? 600 : 400,
                color: active ? "#ffffff" : "rgba(248,250,252,0.65)",
                background: active ? "rgba(129,140,248,0.18)" : "transparent",
                borderLeft: active ? "3px solid #818cf8" : "3px solid transparent",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "1rem", opacity: 0.9 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — user + logout */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "1rem",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {email ? email.charAt(0).toUpperCase() : "?"}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.55,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              Signed in
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                opacity: 0.85,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={email ?? ""}
            >
              {email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.55rem 0.75rem",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}