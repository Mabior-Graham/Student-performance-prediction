"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getRole, type Role } from "../lib/auth";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

type State = "checking" | "allowed" | "redirecting";

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      const token = getToken();
      const role: Role | null = getRole();

      if (!token) {
        if (!cancelled) {
          setState("redirecting");
          // Preserve current path so login can send them back
          const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
          router.replace(`/login${next}`);
        }
        return;
      }

      if (requireAdmin && role !== "admin") {
        if (!cancelled) {
          setState("redirecting");
          router.replace("/dashboard");
        }
        return;
      }

      if (!cancelled) setState("allowed");
    };

    check();

    // Re-check when auth state changes in this tab (login/logout)
    // or in another tab (storage event)
    const onAuthChange = () => check();
    window.addEventListener("auth-change", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-change", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [router, pathname, requireAdmin]);

  if (state === "checking" || state === "redirecting") {
    return (
      <div
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          opacity: 0.6,
          fontSize: "0.9rem",
        }}
      >
        {state === "checking" ? "Checking authentication..." : "Redirecting..."}
      </div>
    );
  }

  return <>{children}</>;
}