"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StockChart } from "@/components/StockChart";
import { Footer } from "@/components/Footer";
import { useTeslaX } from "@/context/TeslaXContext";

const PRESET_AMOUNTS = [5000, 15000, 50000, 100000, 250000, 500000];

export default function InvestPage() {
  const { user } = useTeslaX();
  const [livePrice, setLivePrice] = useState<number>(284.5);
  const [allocationAmount, setAllocationAmount] = useState<number>(25000);

  // Form states
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>("");
  const [investorTier, setInvestorTier] = useState<string>("Accredited Individual");
  const [preferredContact, setPreferredContact] = useState<string>("email");
  const [notes, setNotes] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    inquiryId: string;
    adminEmail: string;
    emailSent: boolean;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculations
  const shareCount = useMemo(() => {
    return Math.max(1, Math.floor(allocationAmount / (livePrice || 284.5)));
  }, [allocationAmount, livePrice]);

  const estimatedQuarterlyYield = useMemo(() => {
    // 4.2% annual dividend distribution based on fleet mileage revenue
    return ((allocationAmount * 0.042) / 4).toFixed(2);
  }, [allocationAmount]);

  const perkTier = useMemo(() => {
    if (allocationAmount >= 250000) {
      return {
        name: "Founder's Board Circle",
        badge: "Tier 4",
        perks: [
          "Exclusive Board Observer access & quarterly executive briefing",
          "Gigafactory & Starbase private annual pass",
          "Dedicated Private Banker Concierge 24/7",
          "Guaranteed priority delivery on all Cybercab & Roadster allocations",
        ],
      };
    } else if (allocationAmount >= 100000) {
      return {
        name: "Private Investor Syndicate",
        badge: "Tier 3",
        perks: [
          "Roadster SpaceX Package delivery queue priority #1-100",
          "Lifetime zero-fee Supercharging network wide",
          "Direct access to TeslaX engineering team webinars",
          "Quarterly capital yield disbursement in USD or BTC",
        ],
      };
    } else if (allocationAmount >= 25000) {
      return {
        name: "Fleet Equity Partner",
        badge: "Tier 2",
        perks: [
          "VIP priority allocation across all Tesla models",
          "Annual 12,000 Supercharging kWh credits",
          "Voting rights on secondary vehicle refurbishing routes",
        ],
      };
    } else {
      return {
        name: "Community Equity Member",
        badge: "Tier 1",
        perks: [
          "Annual 2,500 Supercharging kWh credits",
          "TeslaX Annual Shareholder Meeting voting rights",
          "Member-only access to equity buyback liquidity windows",
        ],
      };
    }
  }, [allocationAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName || (user?.fullName ?? ""),
          email,
          phone,
          shareCount,
          totalAmount: allocationAmount,
          investorTier,
          preferredContact,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmissionResult({
        inquiryId: data.inquiryId,
        adminEmail: data.adminEmail || "support@teslax.io",
        emailSent: data.emailSent,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit investment inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main id="main">
        {/* Hero Section */}
        <div
          className="wrap"
          style={{ paddingTop: "112px", paddingBottom: "48px" }}
        >
          <div className="sec-head" style={{ marginBottom: "24px" }}>
            <div>
              <div className="eyebrow">Equity &amp; Capital Markets</div>
              <h1
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  marginTop: "8px",
                }}
              >
                Invest in Tesla<i style={{ color: "#34d399", fontStyle: "normal" }}>X</i> Stock
              </h1>
              <p
                className="lede"
                style={{
                  marginTop: "16px",
                  maxWidth: "58ch",
                  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                }}
              >
                Direct equity in the world&apos;s first circular electric fleet, automated
                supercharging grid, and autonomous transport network. Track realtime market pricing and request an allocation.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <a href="#allocate-form" className="btn btn-primary">
                Request Equity Allocation
              </a>
              <a
                href="mailto:support@teslax.io?subject=Direct%20TeslaX%20Stock%20Inquiry&body=Hello%20TeslaX%20Customer%20Service,%0A%0AI%20would%20like%20to%20discuss%20a%20private%20equity%20allocation%20in%20TeslaX.%0A%0ABest%20regards,"
                className="btn btn-ghost"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "6px", display: "inline" }}
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Customer Service Mail
              </a>
            </div>
          </div>

          {/* Real-Time Stock Chart Section */}
          <div style={{ marginTop: "16px" }}>
            <StockChart onPriceUpdate={(p) => setLivePrice(p)} />
          </div>

          {/* Key Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                background: "#0a0b0e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#717782",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Market Capitalization
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#fff",
                  marginTop: "6px",
                }}
              >
                $924.8B
              </div>
              <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>
                +14.2% YoY growth
              </div>
            </div>

            <div
              style={{
                background: "#0a0b0e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#717782",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Active Fleet Scale
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#fff",
                  marginTop: "6px",
                }}
              >
                142,500+
              </div>
              <div style={{ fontSize: "12px", color: "#8b9199", marginTop: "4px" }}>
                Vehicles in circular leasing
              </div>
            </div>

            <div
              style={{
                background: "#0a0b0e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#717782",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Projected Fleet Yield
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#34d399",
                  marginTop: "6px",
                }}
              >
                18.4%
              </div>
              <div style={{ fontSize: "12px", color: "#8b9199", marginTop: "4px" }}>
                Annualized asset return
              </div>
            </div>

            <div
              style={{
                background: "#0a0b0e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#717782",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Institutional Backing
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#fff",
                  marginTop: "6px",
                }}
              >
                Tier-1 Funds
              </div>
              <div style={{ fontSize: "12px", color: "#8b9199", marginTop: "4px" }}>
                SEC Reg D &amp; S compliant
              </div>
            </div>
          </div>
        </div>

        {/* Section: Calculator & Form Grid */}
        <section
          className="section"
          id="allocate-form"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "#030406",
          }}
        >
          <div className="wrap">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: "36px",
                alignItems: "start",
              }}
            >
              {/* LEFT COLUMN: Interactive Equity Calculator */}
              <div>
                <div className="eyebrow">Allocation Calculator</div>
                <h3
                  style={{
                    fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                    marginTop: "8px",
                  }}
                >
                  Model your participation
                </h3>
                <p className="lede" style={{ marginTop: "8px", fontSize: "14px" }}>
                  Adjust your planned capital commitment to view allocated shares,
                  estimated quarterly returns, and unlocked shareholder perks.
                </p>

                {/* Amount presets */}
                <div style={{ marginTop: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#8b9199",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Quick Allocation Preset:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAllocationAmount(amt)}
                        className={`btn btn-sm ${
                          allocationAmount === amt ? "btn-primary" : "btn-quiet"
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        ${amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider and input */}
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#8b9199" }}>
                      Target Commitment (USD):
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#34d399",
                        fontFamily: "var(--mono, monospace)",
                      }}
                    >
                      ${allocationAmount.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={allocationAmount}
                    onChange={(e) => setAllocationAmount(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#34d399",
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "#5d636b",
                      marginTop: "4px",
                    }}
                  >
                    <span>$1,000 min</span>
                    <span>$1,000,000+</span>
                  </div>
                </div>

                {/* Summary calculation card */}
                <div
                  style={{
                    background: "#0c0d11",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      paddingBottom: "10px",
                    }}
                  >
                    <span style={{ color: "#8b9199", fontSize: "13px" }}>
                      TSLAX Live Reference Price:
                    </span>
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "var(--mono, monospace)",
                      }}
                    >
                      ${livePrice.toFixed(2)} USD
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      padding: "10px 0",
                    }}
                  >
                    <span style={{ color: "#8b9199", fontSize: "13px" }}>
                      Allocated Common Shares:
                    </span>
                    <span
                      style={{
                        color: "#34d399",
                        fontWeight: 600,
                        fontSize: "16px",
                        fontFamily: "var(--mono, monospace)",
                      }}
                    >
                      {shareCount.toLocaleString()} shares
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      padding: "10px 0",
                    }}
                  >
                    <span style={{ color: "#8b9199", fontSize: "13px" }}>
                      Est. Quarterly Fleet Dividend:
                    </span>
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 500,
                        fontFamily: "var(--mono, monospace)",
                      }}
                    >
                      ~${estimatedQuarterlyYield} / quarter
                    </span>
                  </div>

                  {/* Unlocked Tier */}
                  <div style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(52,211,153,0.12)",
                          color: "#34d399",
                          border: "1px solid rgba(52,211,153,0.3)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {perkTier.badge}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {perkTier.name} Unlocked
                      </span>
                    </div>

                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "18px",
                        fontSize: "12.5px",
                        color: "#9ca3af",
                        lineHeight: "1.7",
                      }}
                    >
                      {perkTier.perks.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Customer Service Help Box */}
                <div
                  style={{
                    background: "rgba(232, 33, 39, 0.05)",
                    border: "1px solid rgba(232, 33, 39, 0.2)",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(232, 33, 39, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f87171",
                      flexShrink: 0,
                    }}
                  >
                    ✉
                  </div>
                  <div style={{ fontSize: "13px", color: "#d1d5db" }}>
                    Prefer bespoke family-office or institutional terms? Reach out
                    directly to our customer service desk at{" "}
                    <a
                      href="mailto:support@teslax.io?subject=Private%20Institutional%20Equity%20Inquiry"
                      style={{
                        color: "#34d399",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      support@teslax.io
                    </a>
                    .
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Allocation Form & Direct Customer Service Dispatch */}
              <div
                style={{
                  background: "#08090c",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "14px",
                  padding: "30px",
                }}
              >
                {submissionResult ? (
                  /* Success State Confirmation Card */
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(52, 211, 153, 0.15)",
                        border: "2px solid #34d399",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 18px",
                        color: "#34d399",
                        fontSize: "26px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        background: "rgba(52,211,153,0.12)",
                        border: "1px solid rgba(52,211,153,0.3)",
                        borderRadius: "4px",
                        color: "#34d399",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Inquiry Dispatched
                    </span>
                    <h3
                      style={{
                        fontSize: "22px",
                        color: "#fff",
                        margin: "12px 0 8px",
                      }}
                    >
                      Equity Allocation Logged
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#8b9199",
                        maxWidth: "40ch",
                        margin: "0 auto 20px",
                      }}
                    >
                      Your allocation request has been routed to our Customer
                      Service &amp; Investor Relations desk. An official confirmation
                      has been dispatched to <strong>{email}</strong>.
                    </p>

                    <div
                      style={{
                        background: "#101217",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "left",
                        fontSize: "13px",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span style={{ color: "#8b9199" }}>Reference ID:</span>
                        <span
                          style={{
                            color: "#fff",
                            fontFamily: "var(--mono, monospace)",
                            fontWeight: 600,
                          }}
                        >
                          {submissionResult.inquiryId}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span style={{ color: "#8b9199" }}>Target Allocation:</span>
                        <span
                          style={{
                            color: "#34d399",
                            fontWeight: 600,
                            fontFamily: "var(--mono, monospace)",
                          }}
                        >
                          ${allocationAmount.toLocaleString()} ({shareCount} shares)
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                        }}
                      >
                        <span style={{ color: "#8b9199" }}>
                          Concierge Mail Destination:
                        </span>
                        <span style={{ color: "#9ca3af" }}>
                          {submissionResult.adminEmail}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <a
                        href={`mailto:${submissionResult.adminEmail}?subject=Inquiry%20Update%20[${submissionResult.inquiryId}]&body=Hello%20TeslaX%20Investor%20Support,%0A%0AFollowing%20up%20on%20my%20stock%20allocation%20inquiry%20${submissionResult.inquiryId}%20for%20$${allocationAmount}.%0A%0ABest%20regards,%0A${encodeURIComponent(fullName || email)}`}
                        className="btn btn-primary"
                      >
                        Email Customer Service Directly →
                      </a>
                      <button
                        type="button"
                        onClick={() => setSubmissionResult(null)}
                        className="btn btn-quiet"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form Input State */
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          background: "rgba(52,211,153,0.12)",
                          border: "1px solid rgba(52,211,153,0.25)",
                          borderRadius: "4px",
                          color: "#34d399",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Formal Allocation Request
                      </span>
                      <h3
                        style={{
                          fontSize: "20px",
                          color: "#fff",
                          margin: "8px 0 4px",
                        }}
                      >
                        Connect with Customer Service
                      </h3>
                      <p style={{ fontSize: "13px", color: "#8b9199" }}>
                        Submit your proposed allocation. Our IR concierge will
                        dispatch subscription documentation and confirm payment rails.
                      </p>
                    </div>

                    {submitError && (
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: "6px",
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#fca5a5",
                          fontSize: "13px",
                          marginBottom: "16px",
                        }}
                      >
                        {submitError}
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                          }}
                        >
                          Full Legal Name:
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Elena Rostova"
                          className="input"
                          style={{ width: "100%", height: "40px" }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                          }}
                        >
                          Email Address:
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@domain.com"
                          className="input"
                          style={{ width: "100%", height: "40px" }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "14px",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                          }}
                        >
                          Phone / WhatsApp:
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="input"
                          style={{ width: "100%", height: "40px" }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#9ca3af",
                            marginBottom: "6px",
                          }}
                        >
                          Investor Profile:
                        </label>
                        <select
                          value={investorTier}
                          onChange={(e) => setInvestorTier(e.target.value)}
                          className="input"
                          style={{
                            width: "100%",
                            height: "40px",
                            background: "#12141a",
                            color: "#fff",
                          }}
                        >
                          <option value="Accredited Individual">
                            Accredited Individual ($1M+ Net Worth)
                          </option>
                          <option value="Retail Member">
                            Retail Member Investor
                          </option>
                          <option value="Family Office / Fund">
                            Family Office / Wealth Manager
                          </option>
                          <option value="Corporate Treasury">
                            Corporate Treasury / Institution
                          </option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginBottom: "6px",
                        }}
                      >
                        Preferred Concierge Contact Method:
                      </label>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "8px",
                        }}
                      >
                        {[
                          { id: "email", label: "Email Desk" },
                          { id: "phone", label: "Phone Call" },
                          { id: "whatsapp", label: "WhatsApp" },
                        ].map((m) => (
                          <label
                            key={m.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              background:
                                preferredContact === m.id
                                  ? "#191c24"
                                  : "#101116",
                              border: `1px solid ${
                                preferredContact === m.id
                                  ? "#34d399"
                                  : "rgba(255,255,255,0.08)"
                              }`,
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: preferredContact === m.id ? "#fff" : "#8b9199",
                            }}
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              checked={preferredContact === m.id}
                              onChange={() => setPreferredContact(m.id)}
                              style={{ accentColor: "#34d399" }}
                            />
                            {m.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#9ca3af",
                          marginBottom: "6px",
                        }}
                      >
                        Special Instructions / Questions for Customer Service:
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Looking to pay via wire transfer or discuss secondary liquidity schedules..."
                        className="input"
                        style={{
                          width: "100%",
                          padding: "10px",
                          height: "auto",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        background: "#111319",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "11px", color: "#717782" }}>
                          TOTAL PROPOSED COMMITMENT
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#34d399",
                            fontFamily: "var(--mono, monospace)",
                          }}
                        >
                          ${allocationAmount.toLocaleString()} USD
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "#717782" }}>
                          EQUITY ALLOCATION
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#fff",
                            fontFamily: "var(--mono, monospace)",
                          }}
                        >
                          {shareCount.toLocaleString()} Shares
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary btn-block"
                      style={{
                        height: "46px",
                        fontSize: "14px",
                        fontWeight: 600,
                        position: "relative",
                      }}
                    >
                      {submitting ? "Transmitting to Customer Care..." : "Submit Allocation to Customer Service →"}
                    </button>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "12px",
                      }}
                    >
                      
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Direct Customer Service / IR Concierge Strip */}
        <section
          style={{
            padding: "60px 0",
            background: "#08090d",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="wrap">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              <div
                style={{
                  background: "#0e1015",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "rgba(52,211,153,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#34d399",
                      fontSize: "16px",
                    }}
                  >
                    ✉
                  </span>
                  <h4 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
                    Customer Service Mail
                  </h4>
                </div>
                <p style={{ fontSize: "13px", color: "#8b9199", marginBottom: "14px" }}>
                  Direct institutional &amp; retail investor inquiry inbox with
                  guaranteed response within 2 hours during market hours.
                </p>
                <a
                  href="mailto:support@teslax.io?subject=Direct%20TeslaX%20Investor%20Relations%20Inquiry&body=Hello%20TeslaX%20Team,%0A%0AI%20would%20like%20to%20learn%20more%20about%20investing%20in%20TeslaX%20equity.%0A%0AInvestor%20Name:%20%0APreferred%20Allocation:%20%0A%0ABest%20regards,"
                  style={{
                    color: "#34d399",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  support@teslax.io →
                </a>
              </div>

              <div
                style={{
                  background: "#0e1015",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "rgba(59,130,246,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#60a5fa",
                      fontSize: "16px",
                    }}
                  >
                    ☎
                  </span>
                  <h4 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
                    IR Concierge Hotline
                  </h4>
                </div>
                <p style={{ fontSize: "13px", color: "#8b9199", marginBottom: "14px" }}>
                  Speak directly with an equity relations associate regarding
                  accredited eligibility, wire instructions, or custodian transfers.
                </p>
                <span
                  style={{
                    color: "#60a5fa",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "var(--mono, monospace)",
                  }}
                >
                  +1 (800) 837-5299 · ext. 4
                </span>
              </div>

              <div
                style={{
                  background: "#0e1015",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "rgba(251,191,36,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fbbf24",
                      fontSize: "16px",
                    }}
                  >
                    📄
                  </span>
                  <h4 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
                    Prospectus &amp; SEC Filing
                  </h4>
                </div>
                <p style={{ fontSize: "13px", color: "#8b9199", marginBottom: "14px" }}>
                  Download the comprehensive Q3 TeslaX Circular Fleet &amp; Energy
                  prospectus, cap table distribution, and revenue audit.
                </p>
                <a
                  href="#prospectus"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("TeslaX Prospectus & Cap Table Summary (PDF) will be dispatched to your email along with your allocation term sheet.");
                  }}
                  style={{
                    color: "#fbbf24",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  Request Official Prospectus (PDF) →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Why TeslaX Equity */}
        <section className="section">
          <div className="wrap">
            <div className="sec-head" style={{ marginBottom: "36px" }}>
              <div>
                <div className="eyebrow">Strategic Moat</div>
                <h2 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
                  Why hold TeslaX stock?
                </h2>
                <p className="lede" style={{ marginTop: "12px" }}>
                  A hedge against traditional automotive obsolescence backed by
                  continuous recurring fleet revenues.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              <div
                style={{
                  background: "#090a0d",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#34d399",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  01 · CIRCULAR RESIDUAL HEDGE
                </div>
                <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "18px" }}>
                  Guaranteed 60% Asset Buyback
                </h4>
                <p style={{ fontSize: "13.5px", color: "#8b9199", lineHeight: "1.6" }}>
                  Unlike conventional dealerships where vehicles lose 40% in year one,
                  TeslaX vehicles are recycled across 3 leasing tiers (New → Certified Pre-Owned → Robotaxi Autonomous Fleet), sustaining high residual equity.
                </p>
              </div>

              <div
                style={{
                  background: "#090a0d",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#34d399",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  02 · AUTONOMOUS MILEAGE DIVIDEND
                </div>
                <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "18px" }}>
                  Cybercab Network Revenue Sharing
                </h4>
                <p style={{ fontSize: "13.5px", color: "#8b9199", lineHeight: "1.6" }}>
                  Every commercial kilometre driven by our commercial fleet and
                  autonomous Cybercab fleet yields direct revenue deposited into the
                  shareholder dividend pool.
                </p>
              </div>

              <div
                style={{
                  background: "#090a0d",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#34d399",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  03 · GRID ARBITRAGE
                </div>
                <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "18px" }}>
                  V4 Supercharger Megapack Energy
                </h4>
                <p style={{ fontSize: "13.5px", color: "#8b9199", lineHeight: "1.6" }}>
                  TeslaX Supercharging hubs act as grid stabilization power banks,
                  arbitraging off-peak electricity pricing and generating steady secondary cash flows.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
