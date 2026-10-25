"use client";

import React from "react";
import Link from "next/link";
import { useTeslaX } from "@/context/TeslaXContext";
import { formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";

export default function DashboardOrdersPage() {
  const { orders } = useTeslaX();

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>My orders</h1>
            <p>Every reservation, lease and pre-order you have placed.</p>
          </div>
          <Link className="btn btn-primary btn-sm" href="/dashboard/shop">
            New reservation <span className="arrow">→</span>
          </Link>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No orders yet</p>
          <p className="dim" style={{ fontSize: "13.5px", maxWidth: "44ch", margin: "0 auto" }}>
            Explore the lineup and reserve any model with split instalments.
          </p>
          <Link className="btn btn-ghost btn-sm" href="/dashboard/shop" style={{ marginTop: "16px" }}>
            Browse the lineup
          </Link>
        </div>
      ) : (
        <div className="stack">
          {orders.map((order) => {
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
                    <span
                      className={`badge ${
                        order.status === "Completed"
                          ? "badge-ok"
                          : order.status === "Active"
                          ? "badge-warn"
                          : ""
                      }`}
                    >
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
    </>
  );
}
