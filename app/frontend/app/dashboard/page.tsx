"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole } from "../../lib/auth";

export default function DashboardEntry() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const role = getRole();
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/instructor");
    }
  }, [router]);

  return (
    <div style={{ padding: "3rem", textAlign: "center", opacity: 0.6 }}>
      Loading dashboard...
    </div>
  );
}