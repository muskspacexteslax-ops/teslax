"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VEHICLES, getVehicleBySlug, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { Footer } from "@/components/Footer";
import { useTeslaX, TradeInValuation } from "@/context/TeslaXContext";

export default function SwapPage() {
  const { user, submitTradeIn, showToast } = useTeslaX();

  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("Corolla");
  const [year, setYear] = useState<number>(2016);
  const [mileage, setMileage] = useState<number>(90000);
  const [fuel, setFuel] = useState("petrol");
  const [condition, setCondition] = useState("good");
  const [targetSlug, setTargetSlug] = useState("model-3");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState("");
  const [valuationResult, setValuationResult] = useState<TradeInValuation | null>(null);

  // Modal state for dispatching valuation to Customer Care
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [preferredContact, setPreferredContact] = useState<string>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  // Live estimated value
  const base = Math.max(1200, 32000 - (2026 - year) * 2200 - (mileage / 10000) * 800);
  const condMult = condition === "excellent" ? 1.2 : condition === "good" ? 1.0 : condition === "fair" ? 0.8 : 0.6;
  const liveValuation = Math.round((base * condMult) / 100) * 100;

  const targetVehicle = getVehicleBySlug(targetSlug);
  const targetPrice = targetVehicle ? targetVehicle.memberPrice : 2900;
  const balance = liveValuation - targetPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitTradeIn({
      make,
      model,
      year,
      mileage,
      fuel,
      condition,
      targetSlug,
      notes,
      photos,
    });
    setValuationResult(result);
  };

  const handleSendTradeInToCustomerCare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !valuationResult) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customerName || "Prospective Trade-In Client",
            email: customerEmail,
            phone: customerPhone,
            preferredContact,
            notes: notes ? `Trade-in notes: ${notes}` : undefined,
          },
          cart: {
            modelName: targetVehicle ? targetVehicle.name : "TeslaX Lineup (Trade-In Offset)",
            slug: targetSlug || "model-3",
            kind: "purchase",
            kindLabel: "Trade-In Appraisal Inquiry",
            totalAmount: Math.max(0, targetPrice - valuationResult.estimatedValue),
            preferredDate: "As soon as evaluated",
            tradeIn: {
              carName: `${valuationResult.year} ${valuationResult.make} ${valuationResult.model}`,
              creditAmount: valuationResult.estimatedValue,
              valuationId: valuationResult.id,
              condition: valuationResult.condition,
              mileage: valuationResult.mileage,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.inquiryId) {
        setSubmittedInquiryId(data.inquiryId);
        showToast("Trade-in appraisal sent to Customer Care!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main id="main">
        <div className="wrap" style={{ paddingTop: "110px", paddingBottom: "80px" }}>
          <div className="eyebrow">Trade-in</div>
          <h1 style={{ marginTop: "16px", fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)", maxWidth: "20ch" }}>
            Your petrol car is a Tesla deposit.
          </h1>
          <p className="lede" style={{ marginTop: "16px" }}>
            Tell us what you drive today. We value it against any model in the lineup — the credit comes straight off your member price, or off your monthly lease. Most trade-ins cover a refurbished Tesla outright.
          </p>

          <div className="swap-page-grid" style={{ marginTop: "40px" }}>
            {/* VALUATION FORM */}
            <div className="card">
              {valuationResult ? (
                <div style={{ padding: "10px 0" }}>
                  <div className="alert alert-ok">
                    <strong>Valuation Generated!</strong> Reference: {valuationResult.id}
                  </div>
                  <h3 style={{ marginTop: "16px", fontSize: "1.5rem" }}>
                    {valuationResult.year} {valuationResult.make} {valuationResult.model}
                  </h3>
                  <div className="kv" style={{ marginTop: "16px" }}>
                    <span className="k">Estimated Trade-in Value</span>
                    <span className="v" style={{ fontSize: "1.2rem", color: "#6ee7b7" }}>
                      {formatCurrency(valuationResult.estimatedValue)}
                    </span>
                  </div>
                  <div className="kv">
                    <span className="k">Target Tesla</span>
                    <span className="v">{targetVehicle ? targetVehicle.name : "Model 3"}</span>
                  </div>
                  <div className="kv">
                    <span className="k">Member Price</span>
                    <span className="v">{formatCurrency(targetPrice)}</span>
                  </div>
                  <div className="kv" style={{ borderTop: "1px solid var(--line-strong)", marginTop: "8px", paddingTop: "14px" }}>
                    <span className="k">Net Balance</span>
                    <span className="v" style={{ color: balance >= 0 ? "#6ee7b7" : "var(--text)" }}>
                      {balance >= 0 ? `${formatCurrency(balance)} credit` : `${formatCurrency(Math.abs(balance))} due`}
                    </span>
                  </div>
                  <div className="stack" style={{ marginTop: "24px", gap: "10px" }}>
                    <Link
                      className="btn btn-primary btn-block"
                      href={`/shop/${targetSlug || "model-3"}?tradein=${valuationResult.id}&credit=${valuationResult.estimatedValue}&car=${encodeURIComponent(`${valuationResult.year} ${valuationResult.make} ${valuationResult.model}`)}`}
                    >
                      Apply credit to order ({targetVehicle ? targetVehicle.name : "Tesla"}) <span className="arrow">→</span>
                    </Link>

                    <button
                      className="btn btn-ghost btn-block"
                      type="button"
                      onClick={() => {
                        if (!customerEmail && user?.email) setCustomerEmail(user.email);
                        if (!customerName && user?.fullName) setCustomerName(user.fullName);
                        if (!customerPhone && user?.phone) setCustomerPhone(user.phone);
                        setIsModalOpen(true);
                      }}
                    >
                      Send Appraisal to Customer Care Directly
                    </button>

                    <button className="btn btn-quiet btn-sm btn-block" onClick={() => setValuationResult(null)}>
                      Recalculate
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
                    Your current vehicle
                  </div>
                  <div className="field-row">
                    <label className="field">
                      <span className="label">Make</span>
                      <input
                        className="input"
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="Toyota"
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="label">Model</span>
                      <input
                        className="input"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Corolla"
                        required
                      />
                    </label>
                  </div>

                  <div className="field-row">
                    <label className="field">
                      <span className="label">Year</span>
                      <input
                        className="input"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        placeholder="2016"
                        required
                        max={2026}
                        min={1950}
                      />
                    </label>
                    <label className="field">
                      <span className="label">Mileage</span>
                      <input
                        className="input"
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(Number(e.target.value))}
                        placeholder="90000"
                        required
                      />
                    </label>
                  </div>

                  <label className="field">
                    <span className="label">Fuel</span>
                    <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="plug-in hybrid">Plug-in hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </label>

                  <label className="field">
                    <span className="label">Condition</span>
                    <select className="input" value={condition} onChange={(e) => setCondition(e.target.value)}>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="needs work">Needs work</option>
                    </select>
                  </label>

                  <div className="divider"></div>

                  <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
                    The Tesla you want
                  </div>

                  <label className="field">
                    <span className="label">Target model</span>
                    <select className="input" value={targetSlug} onChange={(e) => setTargetSlug(e.target.value)}>
                      <option value="">Not sure yet</option>
                      {VEHICLES.map((v) => (
                        <option key={v.slug} value={v.slug}>
                          {v.name} — {formatCurrency(v.memberPrice)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span className="label">Anything else we should know?</span>
                    <textarea
                      className="input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Service history, damage, modifications, outstanding finance…"
                    ></textarea>
                  </label>

                  <label className="field">
                    <span className="label">Photos (optional)</span>
                    <input
                      className="input"
                      type="text"
                      value={photos}
                      onChange={(e) => setPhotos(e.target.value)}
                      placeholder="Paste a link to photos (Drive, Dropbox…)"
                    />
                    <span className="help">Upload is verified by our inspection team.</span>
                  </label>

                  <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: "10px" }}>
                    Get my valuation <span className="arrow">→</span>
                  </button>
                  <p className="tiny dim" style={{ marginTop: "12px", textAlign: "center" }}>
                    Free, no obligation. Most valuations are returned within 24 hours.
                  </p>
                </form>
              )}
            </div>

            {/* SIDEBAR INFO */}
            <aside>
              <div className="card card-glow">
                <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
                  How the credit works
                </div>
                <div style={{ display: "flex", gap: "12px", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: "11px", paddingTop: "2px", flex: "none", width: "16px" }}>
                    1
                  </span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>You submit your car</div>
                    <div className="tiny dim" style={{ marginTop: "2px", lineHeight: 1.55 }}>
                      Make, model, year, mileage and condition.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: "11px", paddingTop: "2px", flex: "none", width: "16px" }}>
                    2
                  </span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>We value it</div>
                    <div className="tiny dim" style={{ marginTop: "2px", lineHeight: 1.55 }}>
                      Real market data plus a refurbishment allowance.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: "11px", paddingTop: "2px", flex: "none", width: "16px" }}>
                    3
                  </span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>Apply the credit</div>
                    <div className="tiny dim" style={{ marginTop: "2px", lineHeight: 1.55 }}>
                      Off the member price, or spread across your lease.
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <div className="eyebrow no-rule" style={{ marginBottom: "10px" }}>
                    Live Preview Example
                  </div>
                  <div className="kv">
                    <span className="k">
                      {year} {make} {model}
                    </span>
                    <span className="v">{formatCurrency(liveValuation)}</span>
                  </div>
                  <div className="kv">
                    <span className="k">{targetVehicle ? targetVehicle.name : "Model 3"} member price</span>
                    <span className="v">−{formatCurrency(targetPrice)}</span>
                  </div>
                  <div className="kv" style={{ borderTop: "1px solid var(--line-strong)", marginTop: "6px", paddingTop: "12px" }}>
                    <span className="k">You receive</span>
                    <span className="v" style={{ color: balance >= 0 ? "#6ee7b7" : "var(--text)" }}>
                      {balance >= 0 ? `${formatCurrency(balance)} credit` : `${formatCurrency(Math.abs(balance))} due`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginTop: "14px" }}>
                <div className="eyebrow no-rule" style={{ marginBottom: "10px" }}>
                  Prefer to talk?
                </div>
                <div className="stack" style={{ gap: "7px" }}>
                  <a className="btn btn-quiet btn-sm btn-block" href="mailto:support@teslax.io">
                    support@teslax.io
                  </a>
                </div>
              </div>

              <div className="card" style={{ marginTop: "14px", borderColor: "rgba(255, 255, 255, 0.18)" }}>
                <p className="tiny dim" style={{ lineHeight: 1.65 }}>
                  You can submit a valuation without an account — but member pricing and instalments need one.
                </p>
                <Link className="btn btn-primary btn-block btn-sm" href="/signup" style={{ marginTop: "12px" }}>
                  Become a member
                </Link>
              </div>
            </aside>
          </div>

          {/* PICK A TARGET */}
          <div className="sec-head" style={{ marginTop: "64px" }}>
            <div>
              <div className="eyebrow">Pick a target</div>
              <h2 style={{ fontSize: "1.6rem" }}>What could you be driving?</h2>
            </div>
          </div>

          <div className="grid g4">
            {VEHICLES.slice(0, 4).map((car) => (
              <Link key={car.slug} className="model-card" href={`/shop/${car.slug}`}>
                <div className="model-visual">
                  <CarArt slug={car.slug} />
                </div>
                <div className="model-body" style={{ padding: "12px 14px 14px" }}>
                  <div className="model-name" style={{ fontSize: "0.94rem" }}>
                    {car.name}
                  </div>
                  <div className="price-now" style={{ fontSize: "1rem", marginTop: "3px" }}>
                    {formatCurrency(car.memberPrice)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CUSTOMER CARE TRADE-IN MODAL */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(12px)",
              display: "grid",
              placeItems: "center",
              padding: "20px",
            }}
          >
            <div
              className="card card-glow"
              style={{
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#08090c",
                borderColor: "rgba(255,255,255,0.22)",
                padding: "28px",
              }}
            >
              {submittedInquiryId ? (
                <div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "rgba(52,211,153,0.12)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      display: "grid",
                      placeItems: "center",
                      color: "#34d399",
                      fontSize: "24px",
                      margin: "0 auto 16px",
                    }}
                  >
                    ✓
                  </div>
                  <h2 style={{ textAlign: "center", fontSize: "1.6rem" }}>Appraisal Sent to Customer Care!</h2>
                  <p className="dim center" style={{ marginTop: "8px", fontSize: "13.5px" }}>
                    Reference Number: <strong className="mono" style={{ color: "#fff" }}>{submittedInquiryId}</strong>
                  </p>

                  <div className="alert alert-ok" style={{ marginTop: "20px", fontSize: "13px" }}>
                    Your vehicle valuation details and contact information have been delivered to{" "}
                    <strong>support@teslax.io</strong>. A dedicated customer care concierge will review your trade-in and reach out to you at{" "}
                    <strong>{customerEmail}</strong>.
                  </div>

                  <div className="kv" style={{ marginTop: "14px" }}>
                    <span className="k">Trade-In Vehicle</span>
                    <span className="v">
                      {valuationResult?.year} {valuationResult?.make} {valuationResult?.model}
                    </span>
                  </div>
                  <div className="kv">
                    <span className="k">Estimated Value</span>
                    <span className="v" style={{ color: "#6ee7b7" }}>
                      {formatCurrency(valuationResult?.estimatedValue || 0)}
                    </span>
                  </div>
                  <div className="kv">
                    <span className="k">Target Tesla</span>
                    <span className="v">{targetVehicle ? targetVehicle.name : "Model 3"}</span>
                  </div>
                  <div className="kv">
                    <span className="k">Preferred Channel</span>
                    <span className="v" style={{ textTransform: "capitalize" }}>{preferredContact}</span>
                  </div>

                  <div className="stack" style={{ marginTop: "24px", gap: "10px" }}>
                    <Link
                      className="btn btn-primary btn-block"
                      href={`/shop/${targetSlug || "model-3"}?tradein=${valuationResult?.id}&credit=${valuationResult?.estimatedValue}&car=${encodeURIComponent(`${valuationResult?.year} ${valuationResult?.make} ${valuationResult?.model}`)}`}
                    >
                      Browse Target Tesla With Credit Applied <span className="arrow">→</span>
                    </Link>
                    <button
                      className="btn btn-ghost btn-block"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubmittedInquiryId(null);
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="row-between" style={{ alignItems: "center", marginBottom: "18px" }}>
                    <div>
                      <div className="eyebrow no-rule">Trade-In Concierge</div>
                      <h3 style={{ fontSize: "1.4rem", marginTop: "4px" }}>Send Appraisal to Customer Care</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{ background: "none", border: 0, color: "#8b9199", fontSize: "20px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  {valuationResult && (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--line)",
                        borderRadius: "8px",
                        padding: "14px",
                        marginBottom: "18px",
                      }}
                    >
                      <div className="row-between">
                        <span style={{ fontWeight: 500, fontSize: "14px" }}>
                          {valuationResult.year} {valuationResult.make} {valuationResult.model}
                        </span>
                        <span className="mono" style={{ color: "#6ee7b7", fontWeight: 500 }}>
                          {formatCurrency(valuationResult.estimatedValue)}
                        </span>
                      </div>
                      <div className="tiny dim" style={{ marginTop: "4px" }}>
                        Condition: <span style={{ textTransform: "capitalize" }}>{valuationResult.condition}</span> ·{" "}
                        {valuationResult.mileage.toLocaleString()} miles · Offset against {targetVehicle?.name || "Model 3"}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSendTradeInToCustomerCare}>
                    <label className="field">
                      <span className="label">Your Name</span>
                      <input
                        className="input"
                        type="text"
                        placeholder="Ada Okafor"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </label>

                    <div className="field-row">
                      <label className="field">
                        <span className="label">Your Email</span>
                        <input
                          className="input"
                          type="email"
                          placeholder="client@example.com"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </label>
                      <label className="field">
                        <span className="label">Phone / WhatsApp</span>
                        <input
                          className="input"
                          type="tel"
                          placeholder="+1 555 000 1234"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span className="label">Preferred Contact Channel</span>
                      <select
                        className="input"
                        value={preferredContact}
                        onChange={(e) => setPreferredContact(e.target.value)}
                      >
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone call</option>
                        <option value="telegram">Telegram</option>
                      </select>
                    </label>

                    <button
                      className="btn btn-primary btn-block btn-lg"
                      type="submit"
                      disabled={isSubmitting}
                      style={{ marginTop: "12px" }}
                    >
                      {isSubmitting ? "Dispatching Appraisal…" : "Confirm & Send to Customer Care"} <span className="arrow">→</span>
                    </button>
                    <p className="tiny dim" style={{ marginTop: "10px", textAlign: "center", lineHeight: 1.5 }}>
                      Sends vehicle specs directly to <strong>support@teslax.io</strong>. Free &amp; no obligation.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
