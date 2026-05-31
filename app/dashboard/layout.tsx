"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth/login");
      } else {
        setChecking(false);
      }
    });

    // Listen for auth changes (logout, token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Show loading spinner while checking auth
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#F8FAFC",
        flexDirection: "column", gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "3px solid #E2E8F0",
          borderTopColor: "#2563EB",
          animation: "spin 0.7s linear infinite",
        }} />
        <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500, fontFamily: "sans-serif" }}>
          Checking authentication…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}