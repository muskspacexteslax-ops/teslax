"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VEHICLES, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";

export default function DashboardShopPage() {
  const [activeBody, setActiveBody] = useState("");

  const filteredVehicles = activeBody
    ? VEHICLES.filter((v) => v.body === activeBody)
    : VEHICLES;

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Member shop</h1>
            <p>Every vehicle unlocked at member rates. 0% interest on split payments.</p>
          </div>
        </div>
      </header>

      <div className="row-between" style={{ marginBottom: "26px" }}>
        <div className="chips">
          <button
            className={`chip ${activeBody === "" ? "on" : ""}`}
            onClick={() => setActiveBody("")}
          >
            All
          </button>
          <button
            className={`chip ${activeBody === "sedan" ? "on" : ""}`}
            onClick={() => setActiveBody("sedan")}
          >
            Sedans
          </button>
          <button
            className={`chip ${activeBody === "suv" ? "on" : ""}`}
            onClick={() => setActiveBody("suv")}
          >
            SUVs
          </button>
          <button
            className={`chip ${activeBody === "truck" ? "on" : ""}`}
            onClick={() => setActiveBody("truck")}
          >
            Pickup
          </button>
          <button
            className={`chip ${activeBody === "roadster" ? "on" : ""}`}
            onClick={() => setActiveBody("roadster")}
          >
            Roadster &amp; Flight
          </button>
          <button
            className={`chip ${activeBody === "semi" ? "on" : ""}`}
            onClick={() => setActiveBody("semi")}
          >
            Commercial
          </button>
        </div>
        <span className="tiny dim">{filteredVehicles.length} models</span>
      </div>

      <div className="grid g3">
        {filteredVehicles.map((vehicle) => {
          const instalment = Math.ceil(vehicle.memberPrice / 4);
          return (
            <Link
              key={vehicle.slug}
              className="model-card"
              href={`/shop/${vehicle.slug}`}
            >
              <div className="model-visual">
                {vehicle.badge && (
                  <span className="badge badge-accent">{vehicle.badge}</span>
                )}
                <CarArt slug={vehicle.slug} />
              </div>
              <div className="model-body">
                <div className="row-between" style={{ gap: "8px" }}>
                  <div className="model-name">{vehicle.name}</div>
                  <span className="tiny dim">{vehicle.bodyLabel}</span>
                </div>
                <div className="model-era">{vehicle.era}</div>
                <div className="model-tag">{vehicle.tagline}</div>
                <div className="model-foot">
                  <div>
                    <span className="price-lbl">Member price</span>
                    <div className="price-now">
                      {formatCurrency(vehicle.memberPrice)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="price-lbl">From</span>
                    <div className="tiny" style={{ color: "#cfd3d8" }}>
                      ${instalment}/mo
                    </div>
                    <div className="tiny dim">4× instalments</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
