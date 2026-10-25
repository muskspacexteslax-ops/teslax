"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VEHICLES, formatCurrency } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { Footer } from "@/components/Footer";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBody = searchParams.get("body") || "";
  const initialQuery = searchParams.get("q") || "";

  const [activeBody, setActiveBody] = useState(initialBody);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchesBody = !activeBody || v.body === activeBody;
      const matchesQuery =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.era.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBody && matchesQuery;
    });
  }, [activeBody, searchQuery]);

  return (
    <>
      <main id="main">
        <div className="wrap" style={{ paddingTop: "118px", paddingBottom: "80px" }}>
          <div className="sec-head" style={{ marginBottom: "28px" }}>
            <div>
              <div className="eyebrow">Shop</div>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.1rem)" }}>The lineup</h2>
              <p className="lede" style={{ marginTop: "14px" }}>
                Every model Tesla has built, priced for members. Split any vehicle into instalments at 0% interest.
              </p>
            </div>
            <div className="row" style={{ gap: "8px" }}>
              <input
                className="input"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models"
                style={{ height: "38px", width: "200px" }}
              />
              {searchQuery && (
                <button
                  className="btn btn-quiet btn-sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="row-between" style={{ marginBottom: "26px" }}>
            <div className="chips" data-filter-group="body">
              <button
                className={`chip ${activeBody === "" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("")}
              >
                All
              </button>
              <button
                className={`chip ${activeBody === "sedan" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("sedan")}
              >
                Sedans
              </button>
              <button
                className={`chip ${activeBody === "suv" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("suv")}
              >
                SUVs
              </button>
              <button
                className={`chip ${activeBody === "truck" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("truck")}
              >
                Pickup
              </button>
              <button
                className={`chip ${activeBody === "roadster" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("roadster")}
              >
                Roadster &amp; Flight
              </button>
              <button
                className={`chip ${activeBody === "semi" ? "on" : ""}`}
                type="button"
                onClick={() => setActiveBody("semi")}
              >
                Commercial
              </button>
            </div>
            <span className="tiny dim">{filteredVehicles.length} models</span>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="empty" style={{ margin: "40px 0" }}>
              <p className="empty-title">No models found</p>
              <p className="dim" style={{ fontSize: "13.5px" }}>
                Try adjusting your search or category filter.
              </p>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: "16px" }}
                onClick={() => {
                  setActiveBody("");
                  setSearchQuery("");
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid g3">
              {filteredVehicles.map((vehicle) => {
                const instalmentRate = Math.ceil(vehicle.memberPrice / 4);
                return (
                  <Link
                    key={vehicle.slug}
                    className="model-card"
                    href={`/shop/${vehicle.slug}`}
                  >
                    <div className="model-visual" style={{ position: "relative" }}>
                      {vehicle.badge ? (
                        <span className="badge badge-accent">
                          {vehicle.badge}
                        </span>
                      ) : (
                        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              background: "rgba(10,12,16,0.85)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#34d399",
                              padding: "2px 7px",
                              borderRadius: "12px",
                            }}
                          >
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }}></span>
                            3D Studio
                          </span>
                        </div>
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
                            ${instalmentRate}/mo
                          </div>
                          <div className="tiny dim">4× instalments</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: "140px" }}>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
