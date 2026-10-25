"use client";

import React from "react";
import Link from "next/link";
import { VEHICLES } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";

export default function DashboardHirePage() {
  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Hire a Tesla</h1>
            <p>Daily and weekly rentals. Collect from any hub or request delivery.</p>
          </div>
        </div>
      </header>

      <div className="econ" style={{ marginBottom: "24px" }}>
        <div>
          <b>1—30 days</b>
          <span>Flexible duration</span>
          <p>Book from a single afternoon to an entire month. No turnaround fee.</p>
        </div>
        <div>
          <b>Included</b>
          <span>Full comprehensive cover</span>
          <p>Comprehensive insurance, roadside recovery, and contactless mobile unlocking.</p>
        </div>
        <div>
          <b>Free</b>
          <span>Supercharging</span>
          <p>Plug into any Supercharger stall. Session costs are covered under membership.</p>
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
                {vehicle.bodyLabel} · {vehicle.era}
              </div>
              <div className="row-between" style={{ marginTop: "14px", alignItems: "flex-end" }}>
                <div>
                  <span className="price-lbl">Daily rate</span>
                  <div className="price-now">${vehicle.hireDaily}</div>
                </div>
                <span className="badge">Instant book</span>
              </div>
              <Link
                className="btn btn-primary btn-block btn-sm"
                href={`/shop/${vehicle.slug}`}
                style={{ marginTop: "14px" }}
              >
                Reserve hire
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
