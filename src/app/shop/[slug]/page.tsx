"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { VEHICLES, getVehicleBySlug, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { Tesla3DViewer } from "@/components/Tesla3DViewer";
import { Footer } from "@/components/Footer";
import { useTeslaX } from "@/context/TeslaXContext";

function VehicleDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = typeof params?.slug === "string" ? params.slug : "model-3";
  const vehicle = getVehicleBySlug(slug) || VEHICLES[0];
  const { user, walletBalance, createOrder } = useTeslaX();

  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const tradeInCredit = Number(searchParams.get("credit") || 0);
  const tradeInCar = searchParams.get("car") || "";
  const tradeInValId = searchParams.get("tradein") || "";

  const [kind, setKind] = useState<"purchase" | "lease" | "hire" | "driving">("purchase");
  const [split, setSplit] = useState<number>(4);
  const [leaseMonths, setLeaseMonths] = useState<number>(6);
  const [hireDays, setHireDays] = useState<number>(3);
  const [drivingPackage, setDrivingPackage] = useState<string>("express");
  const [preferredDate, setPreferredDate] = useState<string>("2026-11-01");

  // Checkout modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [preferredContact, setPreferredContact] = useState<string>("email");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const discount = vehicle.listPrice - vehicle.memberPrice;

  let calculatedTotal = vehicle.memberPrice;
  if (kind === "lease") calculatedTotal = vehicle.leaseMonthly * leaseMonths;
  else if (kind === "hire") calculatedTotal = vehicle.hireDaily * hireDays;
  else if (kind === "driving") {
    const rates: Record<string, number> = { express: 99, extended: 179, halfday: 299, fullday: 499 };
    calculatedTotal = rates[drivingPackage] || 99;
  }

  const effectiveTotal = Math.max(0, calculatedTotal - tradeInCredit);
  const eachSplitAmount = Math.ceil(effectiveTotal / split);

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail && user?.email) setCustomerEmail(user.email);
    if (!customerName && user?.fullName) setCustomerName(user.fullName);
    if (!customerPhone && user?.phone) setCustomerPhone(user.phone);
    setIsModalOpen(true);
  };

  const handleSendToCustomerCare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        slug: vehicle.slug,
        kind,
        split,
        months: leaseMonths,
        days: hireDays,
        packageType: drivingPackage,
        date: preferredDate,
        customerName: customerName || "Prospective Buyer",
        customerEmail,
        customerPhone,
        preferredContact,
        notes,
        tradeIn: tradeInCredit > 0 ? {
          carName: tradeInCar,
          creditAmount: tradeInCredit,
          valuationId: tradeInValId,
        } : undefined,
      });

      setSubmittedInquiryId(orderId);
    } catch (err) {
      console.error("Order dispatch error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const otherVehicles = VEHICLES.filter((v) => v.slug !== vehicle.slug).slice(0, 3);

  return (
    <>
      <main id="main">
        <div className="wrap" style={{ paddingTop: "104px" }}>
          <Link href="/shop" className="tiny dim" style={{ display: "inline-block", marginBottom: "18px" }}>
            ← Back to shop
          </Link>

          <div className="detail-grid">
            <div>
              {/* 3D vs 2D MODE TOGGLE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    padding: "3px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: viewMode === "3d" ? "var(--accent)" : "transparent",
                      color: viewMode === "3d" ? "#fff" : "var(--dim)",
                      border: 0,
                      borderRadius: "6px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: viewMode === "3d" ? "#fff" : "#34d399",
                      }}
                    ></span>
                    3D Interactive Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("2d")}
                    style={{
                      background: viewMode === "2d" ? "rgba(255,255,255,0.12)" : "transparent",
                      color: viewMode === "2d" ? "#fff" : "var(--dim)",
                      border: 0,
                      borderRadius: "6px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    2D Blueprint
                  </button>
                </div>

                <span className="tiny dim">
                  {viewMode === "3d" ? "360° turntable · Paint swatches" : "Vector blueprint"}
                </span>
              </div>

              {viewMode === "3d" ? (
                <Tesla3DViewer slug={vehicle.slug} name={vehicle.name} />
              ) : (
                <div className="detail-visual">
                  <CarArt slug={vehicle.slug} glow={true} />
                </div>
              )}

              <div className="row-between" style={{ marginTop: "22px" }}>
                <div>
                  <div className="eyebrow">{vehicle.bodyLabel} · {vehicle.era}</div>
                  <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 2.9rem)", marginTop: "12px" }}>{vehicle.name}</h1>
                  <p className="lede" style={{ marginTop: "10px" }}>{vehicle.tagline}</p>
                </div>
                {vehicle.badge && <span className="badge badge-accent">{vehicle.badge}</span>}
              </div>

              <p className="lede" style={{ marginTop: "22px" }}>{vehicle.description}</p>

              <div className="specs">
                {vehicle.specs.map((spec, i) => (
                  <div className="spec" key={i}>
                    <span className="spec-k">{spec.label}</span>
                    <span className="spec-v">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: "26px" }}>
                <div className="eyebrow no-rule">What membership includes</div>
                <ul className="ticks" style={{ marginTop: "14px" }}>
                  <li>Direct concierge handover &amp; transparent communication</li>
                  <li>0% interest instalments — up to {split || 4} payments</li>
                  <li>Battery health report and 24-month pack guarantee</li>
                  <li>Free delivery within 50 miles</li>
                  <li>Trade-in credit applied instantly</li>
                  <li>Cancel before delivery for a full refund</li>
                </ul>
              </div>
            </div>

            {/* ASIDE RESERVATION PANEL */}
            <aside>
              <div className="card card-glow" style={{ position: "sticky", top: "80px" }}>
                <div className="row-between" style={{ alignItems: "flex-start" }}>
                  <div>
                    <span className="price-lbl">Member price</span>
                    <div style={{ fontSize: "2rem", fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                      {formatCurrency(vehicle.memberPrice)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="price-lbl">List price</span>
                    <div className="price-was" style={{ fontSize: "13px" }}>
                      {formatCurrency(vehicle.listPrice)}
                    </div>
                    <div className="badge badge-ok" style={{ marginTop: "6px" }}>
                      save {formatCurrency(discount)}
                    </div>
                  </div>
                </div>

                {tradeInCredit > 0 && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "10px 12px",
                      background: "rgba(52,211,153,0.08)",
                      border: "1px solid rgba(52,211,153,0.25)",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399", fontWeight: 600 }}>
                      ✓ Trade-In Credit Applied
                    </div>
                    <div className="row-between" style={{ marginTop: "4px", fontSize: "13px" }}>
                      <span>{tradeInCar || "Appraised car"}</span>
                      <span style={{ color: "#6ee7b7", fontWeight: 600 }}>−{formatCurrency(tradeInCredit)}</span>
                    </div>
                    <div className="row-between" style={{ marginTop: "4px", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "4px" }}>
                      <span className="dim">Net Member Due</span>
                      <strong style={{ color: "#fff" }}>{formatCurrency(effectiveTotal)}</strong>
                    </div>
                  </div>
                )}

                <form onSubmit={handleOpenCheckout} style={{ marginTop: "20px" }}>
                  <label className="field">
                    <span className="label">What do you want to do?</span>
                    <select
                      className="input"
                      name="kind"
                      value={kind}
                      onChange={(e) => setKind(e.target.value as any)}
                    >
                      <option value="purchase">Buy it — {formatCurrency(vehicle.memberPrice)}</option>
                      <option value="lease">Lease it — ${vehicle.leaseMonthly}/mo</option>
                      <option value="hire">Hire it — ${vehicle.hireDaily}/day</option>
                      <option value="driving">Book a self-driving session</option>
                    </select>
                  </label>

                  {kind === "purchase" && (
                    <div>
                      <label className="field">
                        <span className="label">Instalments</span>
                        <select
                          className="input"
                          value={split}
                          onChange={(e) => setSplit(Number(e.target.value))}
                        >
                          <option value="1">Pay in full</option>
                          <option value="2">2 × {formatCurrency(Math.ceil(vehicle.memberPrice / 2))}</option>
                          <option value="3">3 × {formatCurrency(Math.ceil(vehicle.memberPrice / 3))}</option>
                          <option value="4">4 × {formatCurrency(Math.ceil(vehicle.memberPrice / 4))}</option>
                          <option value="6">6 × {formatCurrency(Math.ceil(vehicle.memberPrice / 6))}</option>
                          <option value="12">12 × {formatCurrency(Math.ceil(vehicle.memberPrice / 12))}</option>
                        </select>
                      </label>
                      <div className="split-note">
                        <span className="dim">{split} instalments of </span>
                        <strong>{formatCurrency(eachSplitAmount)}</strong>
                      </div>
                    </div>
                  )}

                  {kind === "lease" && (
                    <div>
                      <label className="field">
                        <span className="label">Lease term</span>
                        <select
                          className="input"
                          value={leaseMonths}
                          onChange={(e) => setLeaseMonths(Number(e.target.value))}
                        >
                          <option value="3">3 months (${vehicle.leaseMonthly}/mo)</option>
                          <option value="6">6 months (${vehicle.leaseMonthly}/mo)</option>
                          <option value="12">12 months (${vehicle.leaseMonthly}/mo)</option>
                        </select>
                      </label>
                    </div>
                  )}

                  {kind === "hire" && (
                    <div>
                      <label className="field">
                        <span className="label">Duration</span>
                        <select
                          className="input"
                          value={hireDays}
                          onChange={(e) => setHireDays(Number(e.target.value))}
                        >
                          <option value="1">1 day (${vehicle.hireDaily})</option>
                          <option value="3">3 days (${vehicle.hireDaily * 3})</option>
                          <option value="7">7 days (${vehicle.hireDaily * 7})</option>
                        </select>
                      </label>
                    </div>
                  )}

                  {kind === "driving" && (
                    <div>
                      <label className="field">
                        <span className="label">Session</span>
                        <select
                          className="input"
                          value={drivingPackage}
                          onChange={(e) => setDrivingPackage(e.target.value)}
                        >
                          <option value="express">Express — $99 · 60 min</option>
                          <option value="extended">Extended — $179 · 120 min</option>
                          <option value="halfday">Half day — $299 · 240 min</option>
                          <option value="fullday">Full day — $499 · 480 min</option>
                        </select>
                      </label>
                    </div>
                  )}

                  <label className="field" style={{ marginTop: "4px" }}>
                    <span className="label">Preferred handover date</span>
                    <input
                      className="input"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </label>

                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    style={{ marginTop: "12px" }}
                  >
                    Send Cart to Customer Care <span className="arrow">→</span>
                  </button>
                  <p className="tiny dim" style={{ marginTop: "10px", textAlign: "center", lineHeight: 1.5 }}>
                    Your cart details will be emailed to Customer Care. Our concierge will reach out directly to confirm.
                  </p>
                </form>

                <div className="divider"></div>
                <div className="kv">
                  <span className="k">Customer Care email</span>
                  <span className="v mono" style={{ fontSize: "12px" }}>support@teslax.io</span>
                </div>
                <div className="kv">
                  <span className="k">Lease from</span>
                  <span className="v">${vehicle.leaseMonthly}/mo</span>
                </div>
                <div className="kv">
                  <span className="k">Hire from</span>
                  <span className="v">${vehicle.hireDaily}/day</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* CUSTOMER CARE CHECKOUT MODAL */}
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
                  <h2 style={{ textAlign: "center", fontSize: "1.6rem" }}>Cart Sent to Customer Care!</h2>
                  <p className="dim center" style={{ marginTop: "8px", fontSize: "13.5px" }}>
                    Reference Number: <strong className="mono" style={{ color: "#fff" }}>{submittedInquiryId}</strong>
                  </p>

                  <div className="alert alert-ok" style={{ marginTop: "20px", fontSize: "13px" }}>
                    Your vehicle configuration and contact details have been sent to{" "}
                    <strong>support@teslax.io</strong>. A dedicated customer care representative will contact you at{" "}
                    <strong>{customerEmail}</strong> to review your cart and arrange payment details.
                  </div>

                  <div className="kv" style={{ marginTop: "14px" }}>
                    <span className="k">Selected Vehicle</span>
                    <span className="v">{vehicle.name}</span>
                  </div>
                  <div className="kv">
                    <span className="k">Option</span>
                    <span className="v" style={{ textTransform: "capitalize" }}>{kind}</span>
                  </div>
                  {tradeInCredit > 0 && (
                    <div className="kv">
                      <span className="k">Trade-In Credit ({tradeInCar})</span>
                      <span className="v" style={{ color: "#6ee7b7" }}>−{formatCurrency(tradeInCredit)}</span>
                    </div>
                  )}
                  <div className="kv">
                    <span className="k">Estimated Net Total</span>
                    <span className="v" style={{ color: "#6ee7b7" }}>{formatCurrency(effectiveTotal)}</span>
                  </div>
                  <div className="kv">
                    <span className="k">Preferred Channel</span>
                    <span className="v" style={{ textTransform: "capitalize" }}>{preferredContact}</span>
                  </div>

                  <div className="stack" style={{ marginTop: "24px", gap: "10px" }}>
                    <Link
                      className="btn btn-primary btn-block"
                      href={`/dashboard/orders/${submittedInquiryId}`}
                    >
                      View Order in Dashboard <span className="arrow">→</span>
                    </Link>
                    <button
                      className="btn btn-ghost btn-block"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubmittedInquiryId(null);
                      }}
                    >
                      Close &amp; Continue Browsing
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="row-between" style={{ alignItems: "center", marginBottom: "18px" }}>
                    <div>
                      <div className="eyebrow no-rule">Direct Concierge Order</div>
                      <h3 style={{ fontSize: "1.4rem", marginTop: "4px" }}>Send Cart to Customer Care</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{ background: "none", border: 0, color: "#8b9199", fontSize: "20px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* CART SUMMARY PREVIEW */}
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
                      <span style={{ fontWeight: 500, fontSize: "14px" }}>{vehicle.name}</span>
                      <span className="mono" style={{ color: "#6ee7b7", fontWeight: 500 }}>
                        {formatCurrency(effectiveTotal)}
                      </span>
                    </div>
                    {tradeInCredit > 0 && (
                      <div className="row-between" style={{ color: "#6ee7b7", fontSize: "12px", marginTop: "4px" }}>
                        <span>Trade-In Credit ({tradeInCar})</span>
                        <span>−{formatCurrency(tradeInCredit)}</span>
                      </div>
                    )}
                    <div className="tiny dim" style={{ marginTop: "4px" }}>
                      Plan: <span style={{ textTransform: "capitalize" }}>{kind}</span>
                      {kind === "purchase" && ` · ${split} instalments of ${formatCurrency(eachSplitAmount)}`}
                      {kind === "lease" && ` · ${leaseMonths} months term`}
                      {kind === "hire" && ` · ${hireDays} days rental`}
                    </div>
                  </div>

                  <form onSubmit={handleSendToCustomerCare}>
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
                      <span className="label">How should Customer Care reach you?</span>
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

                    <label className="field">
                      <span className="label">Delivery notes / questions (optional)</span>
                      <textarea
                        className="input"
                        placeholder="State preferences, location, or trade-in requests..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ minHeight: "72px" }}
                      ></textarea>
                    </label>

                    <button
                      className="btn btn-primary btn-block btn-lg"
                      type="submit"
                      disabled={isSubmitting}
                      style={{ marginTop: "10px" }}
                    >
                      {isSubmitting ? "Dispatching to Customer Care…" : "Confirm & Send to Customer Care"} <span className="arrow">→</span>
                    </button>
                    <p className="tiny dim" style={{ marginTop: "10px", textAlign: "center", lineHeight: 1.5 }}>
                      Dispatches your configuration to <strong>support@teslax.io</strong>. No upfront charge.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALSO CONSIDER */}
        <section className="section" style={{ paddingBottom: "80px" }}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow">Also consider</div>
                <h2 style={{ fontSize: "1.6rem" }}>Others in the lineup</h2>
              </div>
              <Link className="btn btn-ghost btn-sm" href="/shop">
                All models
              </Link>
            </div>
            <div className="grid g3">
              {otherVehicles.map((other) => (
                <Link key={other.slug} className="model-card" href={`/shop/${other.slug}`}>
                  <div className="model-visual">
                    <CarArt slug={other.slug} />
                  </div>
                  <div className="model-body">
                    <div className="model-name">{other.name}</div>
                    <div className="model-era">{other.era}</div>
                    <div className="model-foot">
                      <div>
                        <span className="price-lbl">Member price</span>
                        <div className="price-now">{formatCurrency(other.memberPrice)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function VehicleDetailPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: "120px" }}>Loading vehicle details...</div>}>
      <VehicleDetailContent />
    </Suspense>
  );
}
