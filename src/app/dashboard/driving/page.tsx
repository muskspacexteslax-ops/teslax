"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VEHICLES } from "@/data/vehicles";
import { useTeslaX } from "@/context/TeslaXContext";
import { CarArt } from "@/components/CarArt";

export default function DashboardDrivingPage() {
  const router = useRouter();
  const { user, createOrder } = useTeslaX();

  const [selectedSlug, setSelectedSlug] = useState("model-3");
  const [selectedTier, setSelectedTier] = useState("extended");
  const [submitting, setSubmitting] = useState(false);

  const packages = [
    { id: "express", name: "Express", duration: "60 min", price: 99, desc: "Quick taste of autonomous driving and smart summon." },
    { id: "extended", name: "Extended", duration: "120 min", price: 179, desc: "Highway on-ramp to off-ramp navigate on autopilot plus urban maneuvers." },
    { id: "halfday", name: "Half day", duration: "240 min", price: 299, desc: "Comprehensive coastal or country route with FSD supervision." },
    { id: "fullday", name: "Full day", duration: "480 min", price: 499, desc: "Ultimate exploration session with curated waypoints and supercharging." },
  ];

  const handleBook = async () => {
    setSubmitting(true);
    const orderId = await createOrder({
      slug: selectedSlug,
      kind: "driving",
      packageType: selectedTier,
      date: new Date().toISOString().split("T")[0],
      customerName: user?.fullName || "Member",
      customerEmail: user?.email || "member@teslax.io",
      customerPhone: user?.phone || "",
      preferredContact: "email",
      notes: `Self-driving session booking: ${selectedTier}`,
    });
    router.push(`/dashboard/orders/${orderId}`);
  };

  const currentPkg = packages.find((p) => p.id === selectedTier) || packages[1];
  const vehicle = VEHICLES.find((v) => v.slug === selectedSlug) || VEHICLES[4];

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Book a self-driving session</h1>
            <p>Full Self-Driving (Supervised) on closed test tracks and scenic designated routes.</p>
          </div>
        </div>
      </header>

      <div className="sec-head" style={{ marginBottom: "16px" }}>
        <div>
          <div className="eyebrow">Step 1</div>
          <h2 style={{ fontSize: "1.4rem" }}>Choose a session tier</h2>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: "36px" }}>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedTier(pkg.id)}
            className={`card cursor-pointer transition-all ${
              selectedTier === pkg.id ? "border-white bg-white/10" : "hover:border-white/30"
            }`}
          >
            <div className="row-between">
              <span className="badge">{pkg.duration}</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>${pkg.price}</span>
            </div>
            <h4 style={{ marginTop: "14px" }}>{pkg.name}</h4>
            <p className="dim" style={{ fontSize: "12.5px", marginTop: "6px" }}>
              {pkg.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="sec-head" style={{ marginBottom: "16px" }}>
        <div>
          <div className="eyebrow">Step 2</div>
          <h2 style={{ fontSize: "1.4rem" }}>Choose your model</h2>
        </div>
      </div>

      <div className="grid g3" style={{ marginBottom: "36px" }}>
        {VEHICLES.slice(0, 6).map((car) => (
          <div
            key={car.slug}
            onClick={() => setSelectedSlug(car.slug)}
            className={`model-card cursor-pointer ${
              selectedSlug === car.slug ? "border-white bg-white/5" : ""
            }`}
          >
            <div className="model-visual" style={{ aspectRatio: "16/10" }}>
              <CarArt slug={car.slug} />
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div className="model-name" style={{ fontSize: "1rem" }}>
                {car.name}
              </div>
              <div className="tiny dim" style={{ marginTop: "2px" }}>
                {car.bodyLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-glow" style={{ padding: "26px" }}>
        <div className="row-between" style={{ alignItems: "center" }}>
          <div>
            <div className="eyebrow no-rule">Summary</div>
            <h3 style={{ fontSize: "1.3rem", marginTop: "4px" }}>
              {vehicle.name} · {currentPkg.name} ({currentPkg.duration})
            </h3>
            <p className="dim" style={{ fontSize: "13px", marginTop: "4px" }}>
              Includes instructor briefing, telemetry report, and complimentary coffee.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 300 }}>${currentPkg.price}</div>
            <button
              onClick={handleBook}
              disabled={submitting}
              className="btn btn-primary"
              style={{ marginTop: "8px" }}
            >
              {submitting ? "Sending to Customer Care…" : "Book session"} <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
