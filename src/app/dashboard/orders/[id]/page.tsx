"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeslaX } from "@/context/TeslaXContext";
import { formatCurrency } from "@/data/vehicles";

function OrderDetailContent() {
  const params = useParams();
  const orderId = typeof params?.id === "string" ? params.id : "";
  const { orders } = useTeslaX();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="empty" style={{ margin: "40px 0" }}>
        <p className="empty-title">Order not found</p>
        <Link className="btn btn-primary btn-sm" href="/dashboard/orders" style={{ marginTop: "16px" }}>
          View all orders
        </Link>
      </div>
    );
  }

  const remaining = order.totalAmount - order.paidAmount;
  const pct = Math.round((order.paidAmount / order.totalAmount) * 100);

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>{order.modelName}</h1>
            <p>{order.kindLabel} · {order.id}</p>
          </div>
          <Link className="btn btn-ghost btn-sm" href="/dashboard/orders">
            ← All orders
          </Link>
        </div>
      </header>

      <div className="order-detail">
        <div>
          {/* CUSTOMER CARE DISPATCH NOTICE */}
          <div className="card" style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.03)", marginBottom: "16px" }}>
            <div className="row-between" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="eyebrow no-rule" style={{ color: "#34d399", marginBottom: "6px" }}>
                  <span className="dot" style={{ background: "#34d399", color: "#34d399" }}></span> Customer Care Status
                </div>
                <h4>Dispatched to Customer Care</h4>
                <p className="dim" style={{ fontSize: "13px", marginTop: "6px", maxWidth: "60ch" }}>
                  Your cart details and contact preferences have been delivered to <strong>support@teslax.io</strong>. A dedicated concierge specialist will reach out to you via <strong>{order.preferredContact || "email"}</strong> to discuss your vehicle allocation and finalize your handover.
                </p>
              </div>
              <span className="badge badge-ok">Sent</span>
            </div>
          </div>

          {/* OVERVIEW CARD */}
          <div className="card">
            <div className="row-between" style={{ alignItems: "flex-start" }}>
              <div>
                <span className="price-lbl">Estimated Total</span>
                <div style={{ fontSize: "2rem", fontWeight: 300, letterSpacing: "-0.04em" }}>
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="tiny dim" style={{ marginTop: "4px" }}>
                  {formatCurrency(order.paidAmount)} paid · {formatCurrency(remaining)} remaining
                </div>
              </div>
              <span className="badge badge-accent">
                {order.status}
              </span>
            </div>

            <div className="progress" style={{ marginTop: "20px", height: "4px" }}>
              <i style={{ width: `${pct}%` }}></i>
            </div>

            <div className="divider"></div>

            <div className="kv">
              <span className="k">Vehicle</span>
              <span className="v">{order.modelName}</span>
            </div>
            <div className="kv">
              <span className="k">Plan Type</span>
              <span className="v">{order.kindLabel}</span>
            </div>
            <div className="kv">
              <span className="k">Preferred Handover</span>
              <span className="v">{order.preferredDate || "Nov 1, 2026"}</span>
            </div>
            <div className="kv">
              <span className="k">Client Name</span>
              <span className="v">{order.customerName || "Member"}</span>
            </div>
            <div className="kv">
              <span className="k">Client Email</span>
              <span className="v mono" style={{ color: "#6ee7b7" }}>{order.customerEmail || "client@example.com"}</span>
            </div>
            {order.customerPhone && (
              <div className="kv">
                <span className="k">Client Phone</span>
                <span className="v">{order.customerPhone}</span>
              </div>
            )}
            <div className="kv">
              <span className="k">Preferred Channel</span>
              <span className="v" style={{ textTransform: "capitalize" }}>{order.preferredContact || "Email"}</span>
            </div>
            <div className="kv">
              <span className="k">Submitted On</span>
              <span className="v">{order.createdDate}</span>
            </div>
          </div>

          {/* PAYMENT SCHEDULE */}
          {order.schedule && order.schedule.length > 0 && (
            <div className="card" style={{ marginTop: "14px" }}>
              <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
                Proposed Payment Schedule
              </div>
              <div className="split">
                {order.schedule.map((item) => (
                  <div
                    key={item.index}
                    className={`split-row ${item.status === "paid" ? "done" : ""}`}
                  >
                    <div className="row" style={{ gap: "10px" }}>
                      <span className="i">{item.label}</span>
                      <span>
                        {item.status === "paid"
                          ? `Paid ${item.paidAt || "Oct 24"}`
                          : item.status === "due"
                          ? "Due next"
                          : "Scheduled"}
                      </span>
                    </div>
                    <div className="row" style={{ gap: "10px" }}>
                      <span className="mono">{formatCurrency(item.amount)}</span>
                      <span
                        className={`badge ${
                          item.status === "paid"
                            ? "badge-ok"
                            : item.status === "due"
                            ? "badge-warn"
                            : "badge-muted"
                        }`}
                      >
                        {item.status === "paid"
                          ? "Paid"
                          : item.status === "due"
                          ? "Due"
                          : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMER CARE ASIDE */}
        <aside>
          <div className="card card-glow" style={{ position: "sticky", top: "80px" }}>
            <span className="price-lbl">Customer Care Desk</span>
            <div style={{ fontSize: "1.3rem", fontWeight: 400, marginTop: "6px" }}>
              support@teslax.io
            </div>
            <p className="tiny dim" style={{ marginTop: "4px" }}>
              Dedicated Concierge Assigned
            </p>

            <div className="divider"></div>

            <p className="dim" style={{ fontSize: "13px", lineHeight: 1.6 }}>
              Instead of automated payment gateway charges, Customer Care reviews your configuration and coordinates directly with you.
            </p>

            <div className="stack" style={{ gap: "10px", marginTop: "16px" }}>
              <a
                className="btn btn-primary btn-block"
                href={`mailto:support@teslax.io?subject=Follow-up%20on%20TeslaX%20Order%20${order.id}&body=Hello%20Customer%20Care,%0A%0AI%20am%20following%20up%20on%20my%20order%20${order.id}%20for%20the%20${encodeURIComponent(order.modelName)}.%0A%0AName:%20${encodeURIComponent(order.customerName || "")}%0APhone:%20${encodeURIComponent(order.customerPhone || "")}`}
              >
                Email Customer Care <span className="arrow">→</span>
              </a>

              <a
                className="btn btn-quiet btn-block"
                href="mailto:support@teslax.io"
              >
                Request Priority Call
              </a>
            </div>

            <p className="tiny dim" style={{ marginTop: "14px", lineHeight: 1.6, textAlign: "center" }}>
              Expected response time: Under 24 hours.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: "60px" }}>Loading order...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
