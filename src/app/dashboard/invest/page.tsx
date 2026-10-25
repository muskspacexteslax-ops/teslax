"use client";

import React, { useState } from "react";
import { useTeslaX } from "@/context/TeslaXContext";
import { StockChart } from "@/components/StockChart";

export default function DashboardInvestPage() {
  const { user } = useTeslaX();
  const [livePrice, setLivePrice] = useState<number>(284.5);
  const [allocationAmount, setAllocationAmount] = useState<number>(25000);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const shareCount = Math.max(1, Math.floor(allocationAmount / (livePrice || 284.5)));

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.fullName || "TeslaX Member",
          email: user?.email || "member@teslax.io",
          shareCount,
          totalAmount: allocationAmount,
          investorTier: user?.isVip ? "VIP Member Equity" : "Active Member Equity",
          preferredContact: "email",
          notes: notes || "Submitted via Member Dashboard portal",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request");
      setInquiryId(data.inquiryId);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow" style={{ color: "#34d399" }}>
              Capital &amp; Stock Markets
            </div>
            <h1>Invest in TeslaX (TSLAX)</h1>
            <p>
              Direct equity participation in the TeslaX circular fleet, charging
              infrastructure, and Robotaxi network. Track real-time market quotes and request capital allocation.
            </p>
          </div>
          <div className="row" style={{ gap: "10px" }}>
            <a
              href="mailto:support@teslax.io?subject=Dashboard%20Member%20Stock%20Inquiry&body=Hello%20TeslaX%20Customer%20Service,%0A%0AMember%20ID:%20TeslaX%20Dashboard%20User%0AI%20would%20like%20to%20discuss%20my%20equity%20allocation.%0A%0ABest%20regards,"
              className="btn btn-ghost btn-sm"
            >
              ✉ Customer Service Mail
            </a>
          </div>
        </div>
      </header>

      {/* Real-time chart */}
      <div style={{ marginBottom: "28px" }}>
        <StockChart compact onPriceUpdate={(p) => setLivePrice(p)} />
      </div>

      {/* Grid: Member Portfolio Snapshot & Direct Allocation Desk */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left: Allocation Request */}
        <div className="card">
          <div className="eyebrow no-rule" style={{ marginBottom: "12px" }}>
            New Stock Allocation Desk
          </div>
          <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>
            Acquire TSLAX Common Shares
          </h3>
          <p style={{ fontSize: "13px", color: "#8b9199", marginBottom: "18px" }}>
            As a registered TeslaX member, your allocation requests receive
            priority review from our customer care and capital relations desk.
          </p>

          {inquiryId ? (
            <div
              style={{
                background: "rgba(52, 211, 153, 0.08)",
                border: "1px solid rgba(52, 211, 153, 0.25)",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "rgba(52, 211, 153, 0.2)",
                  color: "#34d399",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                ✓
              </div>
              <h4 style={{ color: "#fff", marginBottom: "6px" }}>
                Request Dispatched to Customer Service
              </h4>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "14px" }}>
                Reference ID: <strong>{inquiryId}</strong>
                <br />
                Our IR desk will contact you at <strong>{user?.email || "your registered email"}</strong> with subscription documents.
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <a
                  href={`mailto:support@teslax.io?subject=Member%20Allocation%20[${inquiryId}]&body=Hello%20TeslaX%20Customer%20Service,%0A%0AReferencing%20my%20recent%20allocation%20inquiry%20${inquiryId}.%0A%0ABest%20regards,%0A${encodeURIComponent(user?.fullName || "")}`}
                  className="btn btn-primary btn-sm"
                >
                  Email Support Team
                </a>
                <button
                  type="button"
                  onClick={() => setInquiryId(null)}
                  className="btn btn-quiet btn-sm"
                >
                  New Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAllocate}>
              {errorMsg && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                    fontSize: "12px",
                    borderRadius: "6px",
                    marginBottom: "14px",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <label className="field">
                <span className="label">Allocation Amount (USD)</span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(Number(e.target.value))}
                  className="input"
                  required
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  margin: "8px 0 16px",
                  flexWrap: "wrap",
                }}
              >
                {[5000, 15000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAllocationAmount(amt)}
                    className={`btn btn-sm ${
                      allocationAmount === amt ? "btn-primary" : "btn-quiet"
                    }`}
                    style={{ fontSize: "11px", padding: "3px 8px" }}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div
                style={{
                  background: "#12141a",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ color: "#8b9199" }}>Live TSLAX Price:</span>
                  <span style={{ color: "#fff", fontFamily: "var(--mono, monospace)" }}>
                    ${livePrice.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ color: "#8b9199" }}>Calculated Shares:</span>
                  <span
                    style={{
                      color: "#34d399",
                      fontWeight: 600,
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
                  }}
                >
                  <span style={{ color: "#8b9199" }}>Est. Dividend Yield:</span>
                  <span style={{ color: "#fff" }}>4.2% annualized</span>
                </div>
              </div>

              <label className="field" style={{ marginBottom: "16px" }}>
                <span className="label">Note for Customer Service / IR Team (optional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Schedule call on Monday morning"
                  className="input"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-block"
              >
                {submitting
                  ? "Transmitting..."
                  : "Dispatch Allocation to Customer Care →"}
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Customer Service Concierge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card">
            <div className="eyebrow no-rule" style={{ marginBottom: "10px" }}>
              Concierge Contact
            </div>
            <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>
              Customer Service &amp; IR Desk
            </h3>
            <p style={{ fontSize: "13px", color: "#8b9199", marginBottom: "16px" }}>
              Have questions regarding wire rails, stock custody, or tax documentation?
              Our customer service team is on standby.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: "#101116",
                  borderRadius: "6px",
                }}
              >
                <span style={{ color: "#8b9199" }}>Direct Email:</span>
                <a
                  href="mailto:support@teslax.io?subject=TeslaX%20Dashboard%20Stock%20Support"
                  style={{ color: "#34d399", fontWeight: 500 }}
                >
                  support@teslax.io ↗
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: "#101116",
                  borderRadius: "6px",
                }}
              >
                <span style={{ color: "#8b9199" }}>Response Window:</span>
                <span style={{ color: "#fff" }}>&lt; 2 Hours</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: "#101116",
                  borderRadius: "6px",
                }}
              >
                <span style={{ color: "#8b9199" }}>Member Status:</span>
                <span style={{ color: "#34d399", fontWeight: 500 }}>
                  {user?.isVip ? "VIP Concierge Priority" : "Active Member"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #0e121a 0%, #07090d 100%)",
              border: "1px solid rgba(52, 211, 153, 0.18)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#34d399",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Member Shareholder Perk
            </div>
            <h4 style={{ color: "#fff", marginBottom: "8px", fontSize: "16px" }}>
              Zero-Fee Trading &amp; 100% Asset Liquidity
            </h4>
            <p style={{ fontSize: "12.5px", color: "#9ca3af", lineHeight: "1.6" }}>
              TeslaX offers bi-annual guaranteed liquidity windows allowing members
              to buy or redeem equity directly at fair market value with zero broker fees.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
