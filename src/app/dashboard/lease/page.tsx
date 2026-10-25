"use client";

import React from "react";
import Link from "next/link";
import { VEHICLES, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";

export default function DashboardLeasePage() {
  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Lease a Tesla</h1>
            <p>Short-term leases with no credit check. Cancel with 30 days&#39; notice.</p>
          </div>
        </div>
      </header>

      <div className="econ" style={{ marginBottom: "24px" }}>
        <div>
          <b>3—12 mo</b>
          <span>Flexible terms</span>
          <p>Start with three months. Extend or return whenever life changes.</p>
        </div>
        <div>
          <b>0%</b>
          <span>Finance charges</span>
          <p>No interest, no arrangement fee, no balloon payment at the end.</p>
        </div>
        <div>
          <b>Included</b>
          <span>Insurance &amp; servicing</span>
          <p>Road tax, servicing and battery monitoring are in the monthly price.</p>
        </div>
      </div>

      <div className="grid g3">
        {VEHICLES.map((vehicle) => (
          <article key={vehicle.slug} className="lease-card">
            <div className="model-visual" style={{ aspectRatio: "16/10" }}>
              <CarArt slug={vehicle.slug} />
            </div>
            <div style={{ padding: "16px 18px 18px" }}>
              <div className="model-name" style={{ fontSize: "1rem" }}>
                {vehicle.name}
              </div>
              <div className="tiny dim" style={{ marginTop: "2px" }}>
                {vehicle.era}
              </div>
              <div className="row-between" style={{ marginTop: "14px", alignItems: "flex-end" }}>
                <div>
                  <span className="price-lbl">Monthly</span>
                  <div className="price-now">${vehicle.leaseMonthly}</div>
                </div>
                <span className="badge">3 / 6 / 12 mo</span>
              </div>
              <Link
                className="btn btn-primary btn-block btn-sm"
                href={`/shop/${vehicle.slug}`}
                style={{ marginTop: "14px" }}
              >
                Start a lease
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
