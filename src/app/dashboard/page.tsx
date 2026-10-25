"use client";

import React from "react";
import Link from "next/link";
import { useTeslaX } from "@/context/TeslaXContext";
import { VEHICLES, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";

export default function DashboardOverviewPage() {
  const { user, walletBalance, orders } = useTeslaX();

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Member";
  const totalInvested = orders.reduce((sum, o) => sum + o.paidAmount, 0);

  // Calculate approximate savings
  const totalSaved = orders.reduce((sum, o) => {
    const v = VEHICLES.find((veh) => veh.slug === o.slug);
    if (!v) return sum;
    return sum + (v.listPrice - v.memberPrice);
  }, 0);

  const pickedVehicles = VEHICLES.slice(0, 4);

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Welcome back, {firstName}</h1>
            <p>Your membership, wallet and vehicles in one place.</p>
          </div>
          <Link className="btn btn-primary btn-sm" href="/dashboard/shop">
            Browse the lineup <span className="arrow">→</span>
          </Link>
        </div>
      </header>

      {/* ANNOUNCEMENT */}
      <div className="card" style={{ marginBottom: "14px", borderColor: "rgba(255, 255, 255, 0.16)" }}>
        <div className="row-between" style={{ gap: "16px", alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow no-rule" style={{ marginBottom: "8px" }}>
              <span className="dot" style={{ background: "var(--accent)", color: "var(--accent)" }}></span> Announcement
            </div>
            <h4>Welcome to TeslaX</h4>
            <p className="dim" style={{ fontSize: "13px", marginTop: "6px", maxWidth: "70ch" }}>
              Member pricing is live. Split any vehicle across instalments — no interest, no credit check. Reserve your allocation from the dashboard.
            </p>
          </div>
          <span className="tiny dim nowrap">Active now</span>
        </div>
      </div>

      {/* TOP DASH CARDS */}
      <div className="dash-top">
        <div className="balance">
          <div className="eyebrow no-rule">
            <span className="dot" style={{ background: "#34d399", color: "#34d399" }}></span> Wallet balance
          </div>
          <div className="amt">{formatCurrency(walletBalance)}</div>
          <div className="hint">Instalments are deducted from this balance. Top up from the wallet page.</div>
          <div className="row" style={{ marginTop: "18px", gap: "8px" }}>
            <Link className="btn btn-primary btn-sm" href="/dashboard/wallet">
              Top up
            </Link>
            <Link className="btn btn-ghost btn-sm" href="/dashboard/orders">
              View orders
            </Link>
          </div>
        </div>

        <div className="stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="stat">
            <div className="k">Total orders</div>
            <div className="v">{orders.length}</div>
            <div className="m">{orders.filter((o) => o.status !== "Completed").length} in progress</div>
          </div>
          <div className="stat">
            <div className="k">Invested</div>
            <div className="v">{formatCurrency(totalInvested)}</div>
            <div className="m">across all vehicles</div>
          </div>
          <div className="stat">
            <div className="k">Saved vs list</div>
            <div className="v" style={{ color: "#6ee7b7" }}>
              {formatCurrency(totalSaved)}
            </div>
            <div className="m">member pricing</div>
          </div>
          <div className="stat">
            <div className="k">Status</div>
            <div className="v" style={{ fontSize: "1.1rem", marginTop: "12px" }}>
              <span className={`badge ${user?.isVip ? "badge-accent" : "badge-ok"}`}>
                {user?.isVip ? "VIP" : "Active"}
              </span>
            </div>
            <div className="m">{user?.memberId || "TXJJVZ4"}</div>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUTS */}
      <div className="grid g4" style={{ marginTop: "16px" }}>
        <Link className="quick" href="/dashboard/lease">
          <svg className="q-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9.5a3 3 0 1 1 2.6 3L11 15l2-.4.5 1.6 2-.4"></path>
          </svg>
          <div>
            <div className="q-t">Lease a Tesla</div>
            <div className="q-d">From $199/mo</div>
          </div>
        </Link>
        <Link className="quick" href="/dashboard/hire">
          <svg className="q-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 8.8 9 3l6.5 5.8V16H2.5z"></path>
          </svg>
          <div>
            <div className="q-t">Hire a Tesla</div>
            <div className="q-d">Any model, by the day</div>
          </div>
        </Link>
        <Link className="quick" href="/dashboard/driving">
          <svg className="q-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 2.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM9 2.5v6.5h6.2"></path>
          </svg>
          <div>
            <div className="q-t">Self-driving</div>
            <div className="q-d">Book a session</div>
          </div>
        </Link>
        <Link className="quick" href="/dashboard/roadster">
          <svg className="q-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 2.5 6 15.5M9 2.5l3 13M3.5 12h11"></path>
          </svg>
          <div>
            <div className="q-t">Roadster</div>
            <div className="q-d">Pre-order now</div>
          </div>
        </Link>
      </div>

      {/* RECENT ORDERS */}
      <div className="row-between" style={{ marginTop: "34px", marginBottom: "14px" }}>
        <h3 style={{ fontSize: "1.12rem" }}>Recent orders</h3>
        <Link className="tiny dim" href="/dashboard/orders">
          View all →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No orders yet</p>
          <p className="dim" style={{ fontSize: "13.5px", maxWidth: "44ch", margin: "0 auto" }}>
            Reserve a vehicle and your split-payment plan will appear here.
          </p>
          <Link className="btn btn-ghost btn-sm" href="/dashboard/shop" style={{ marginTop: "16px" }}>
            Browse the lineup
          </Link>
        </div>
      ) : (
        <div className="stack">
          {orders.slice(0, 3).map((order) => {
            const pct = Math.round((order.paidAmount / order.totalAmount) * 100);
            return (
              <Link key={order.id} className="order-row" href={`/dashboard/orders/${order.id}`}>
                <div className="order-thumb">
                  <CarArt slug={order.slug} />
                </div>
                <div className="order-main">
                  <div className="row-between" style={{ gap: "10px", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14.5px", fontWeight: 500 }}>
                        {order.modelName} <span className="tiny dim" style={{ fontWeight: 400 }}>· {order.kindLabel}</span>
                      </div>
                      <div className="tiny dim" style={{ marginTop: "3px" }}>
                        {order.id} · created {order.createdDate}
                      </div>
                    </div>
                    <span className={`badge ${order.status === "Completed" ? "badge-ok" : order.status === "Active" ? "badge-warn" : ""}`}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <div className="row-between tiny" style={{ marginBottom: "6px" }}>
                      <span className="dim">
                        {formatCurrency(order.paidAmount)} of {formatCurrency(order.totalAmount)} · {order.instalmentsPaid}/{order.instalmentsCount} paid
                      </span>
                      <span className="dim">{pct}%</span>
                    </div>
                    <div className="progress">
                      <i style={{ width: `${pct}%` }}></i>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* PICKED FOR YOU */}
      <div className="row-between" style={{ marginTop: "34px", marginBottom: "14px" }}>
        <h3 style={{ fontSize: "1.12rem" }}>Picked for you</h3>
        <Link className="tiny dim" href="/dashboard/shop">
          Shop all →
        </Link>
      </div>

      <div className="grid g4">
        {pickedVehicles.map((car) => (
          <Link key={car.slug} className="model-card" href={`/shop/${car.slug}`}>
            <div className="model-visual">
              <CarArt slug={car.slug} />
            </div>
            <div className="model-body" style={{ padding: "14px 16px 16px" }}>
              <div className="model-name" style={{ fontSize: "0.96rem" }}>
                {car.name}
              </div>
              <div className="price-now" style={{ fontSize: "1.04rem", marginTop: "4px" }}>
                {formatCurrency(car.memberPrice)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
