"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";
import { useTeslaX } from "@/context/TeslaXContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useTeslaX();
  const router = useRouter();

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="wrap" style={{ paddingTop: "120px", textAlign: "center" }}>
        <p className="dim">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <>
      <main id="main">
        <div className="app">
          <AppSidebar />
          <div className="main-pad">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
