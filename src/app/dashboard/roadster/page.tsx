"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarArt } from "@/components/CarArt";
import { useTeslaX } from "@/context/TeslaXContext";

export default function DashboardRoadsterPage() {
  const router = useRouter();
  const { user, createOrder } = useTeslaX();
  const [submitting, setSubmitting] = useState(false);
  const [selectedTrim, setSelectedTrim] = useState<"standard" | "flying">("flying");

  const isFlying = selectedTrim === "flying";
  const slug = isFlying ? "roadster-flying" : "roadster-2";

  const handlePreorder = async () => {
    setSubmitting(true);
    const orderId = await createOrder({
      slug,
      kind: "purchase",
      split: 4,
      date: isFlying ? "2028-06-01" : "2026-12-01",
      customerName: user?.fullName || "Member",
      customerEmail: user?.email || "member@teslax.io",
      customerPhone: user?.phone || "",
      preferredContact: "email",
      notes: isFlying
        ? "Roadster SpaceX Flying Thruster Package (Rocket Model) priority allocation request"
        : "Roadster 2026 standard pre-order allocation request",
    });
    router.push(`/dashboard/orders/${orderId}`);
  };

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Pre-order the Roadster</h1>
            <p>Priority member allocation for the fastest accelerating production vehicle and the new SpaceX flight package.</p>
          </div>
        </div>
      </header>

      {/* Trim Switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button
          className={`chip ${isFlying ? "on" : ""}`}
          onClick={() => setSelectedTrim("flying")}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          🚀 SpaceX Flying Package (10 Thrusters)
        </button>
        <button
          className={`chip ${!isFlying ? "on" : ""}`}
          onClick={() => setSelectedTrim("standard")}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          🏁 Standard Supercar (1.9s)
        </button>
      </div>

      <div className="roadster-hero">
        <div className="roadster-visual" style={{ position: "relative" }}>
          <CarArt slug={slug} glow={true} />
          {isFlying && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(56,189,248,0.4)",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#38bdf8",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ✦ Cold-Gas Hover Active
            </div>
          )}
        </div>

        <div>
          <span className={`badge ${isFlying ? "badge-accent" : "badge-outline"}`}>
            {isFlying ? "SPACEX FLIGHT PACKAGE · 2028" : "GEN 2 PRE-ORDER · 2026"}
          </span>
          <h2 style={{ fontSize: "2.4rem", marginTop: "14px" }}>
            {isFlying ? "Roadster SpaceX (Flying Model)" : "Roadster"}
          </h2>
          <p className="lede" style={{ marginTop: "14px" }}>
            {isFlying
              ? "10 directional cold-gas thrusters fed by composite overwrapped pressure vessels (COPV). Sub-1 second 0—60 launch, mid-air hops, pitch/yaw rotation control, and short-range hovering."
              : "0—60 mph in 1.9 seconds, top speed over 250 mph, and 620 miles of range per charge. Available to TeslaX members on a 4-cycle split deposit."}
          </p>

          <div className="specs" style={{ margin: "22px 0" }}>
            <div className="spec">
              <span className="spec-k">0—60</span>
              <span className="spec-v" style={{ color: isFlying ? "#38bdf8" : "inherit" }}>
                {isFlying ? "0.8 s" : "1.9 s"}
              </span>
            </div>
            <div className="spec">
              <span className="spec-k">{isFlying ? "Flight System" : "Top speed"}</span>
              <span className="spec-v">{isFlying ? "10 Thrusters" : "250+ mph"}</span>
            </div>
            <div className="spec">
              <span className="spec-k">Range</span>
              <span className="spec-v">620 mi</span>
            </div>
            <div className="spec">
              <span className="spec-k">{isFlying ? "Air Supply" : "Seats"}</span>
              <span className="spec-v">{isFlying ? "600L @ 10k PSI" : "4"}</span>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Link
              href={`/shop/${slug}`}
              className="btn btn-quiet"
              style={{ fontSize: "12.5px", padding: "8px 16px" }}
            >
              Inspect in 3D WebGL Studio →
            </Link>
          </div>

          <div className="card card-glow" style={{ marginTop: "14px" }}>
            <div className="row-between">
              <div>
                <span className="price-lbl">Member Reservation Deposit</span>
                <div style={{ fontSize: "2rem", fontWeight: 300 }}>
                  {isFlying ? "$7,500" : "$5,000"}
                </div>
                <div className="tiny dim">
                  4 payments of {isFlying ? "$1,875" : "$1,250"} at 0% interest
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={handlePreorder}
                disabled={submitting}
              >
                {submitting ? "Sending to Customer Care…" : "Reserve Allocation"} <span className="arrow">→</span>
              </button>
            </div>
            <p className="tiny dim" style={{ marginTop: "12px", lineHeight: 1.5 }}>
              Your cart details are dispatched directly to <strong>support@teslax.io</strong>. Customer Care will coordinate your priority production slot.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
