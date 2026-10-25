import React from "react";
import Link from "next/link";
import { CarArt } from "@/components/CarArt";
import { Footer } from "@/components/Footer";
import { VEHICLES } from "@/data/vehicles";

export default function HomePage() {
  return (
    <>
      <main id="main">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="hero-art">
            <CarArt slug="cybertruck" glow={true} />
          </div>
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <div className="eyebrow">TeslaX · Membership platform</div>
              <h1>
                Everyone should
                <br />
                own a <em>Tesla.</em>
              </h1>
              <p className="lede">
                We want everyone to own a Tesla. We lease, recover, refurbish and re-lease — so each car serves many owners and the price falls every cycle.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" href="/signup">
                  Become a member<span className="arrow">→</span>
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/shop/cybertruck">
                  Interactive 3D Studio
                </Link>
              </div>
            </div>

            <div className="hero-meta">
              <div>
                <b>{VEHICLES.length}</b>
                <span>Models</span>
              </div>
              <div>
                <b>2008—2028</b>
                <span>Original to Flying Roadster</span>
              </div>
              <div>
                <b>0%</b>
                <span>Instalment interest</span>
              </div>
              <div>
                <b>4×</b>
                <span>Vehicle reuse cycles</span>
              </div>
            </div>
          </div>
          <div className="scroll-hint">
            <i></i>
            <span>Scroll</span>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            <span>
              <b>Original Roadster</b> 2008 &nbsp;·&nbsp; <b>Model S</b> 2012 &nbsp;·&nbsp; <b>Model X</b> 2015 &nbsp;·&nbsp; <b>Model 3</b> 2017 &nbsp;·&nbsp; <b>Model Y</b> 2020 &nbsp;·&nbsp; <b>Cybertruck</b> 2023 &nbsp;·&nbsp; <b>Semi</b> 2024 &nbsp;·&nbsp; <b>Roadster</b> 2026 &nbsp;·&nbsp;
            </span>
            <span>
              <b>Original Roadster</b> 2008 &nbsp;·&nbsp; <b>Model S</b> 2012 &nbsp;·&nbsp; <b>Model X</b> 2015 &nbsp;·&nbsp; <b>Model 3</b> 2017 &nbsp;·&nbsp; <b>Model Y</b> 2020 &nbsp;·&nbsp; <b>Cybertruck</b> 2023 &nbsp;·&nbsp; <b>Semi</b> 2024 &nbsp;·&nbsp; <b>Roadster</b> 2026 &nbsp;·&nbsp;
            </span>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow">The model</div>
                <h2>How a Tesla becomes affordable</h2>
                <p className="lede">
                  A new car loses most of its value in the first few years because it is only ever sold once. We keep the same vehicle in circulation, and pass the savings to each member.
                </p>
              </div>
              <Link className="btn btn-ghost" href="/signup">
                Join the cycle <span className="arrow">→</span>
              </Link>
            </div>

            <div className="cycle">
              <div className="cycle-ring">
                <article className="cycle-step">
                  <div className="cycle-num">01</div>
                  <h4>Lease it to a member</h4>
                  <p>Lower the upfront financial barrier. A member takes the car on a short lease instead of buying outright.</p>
                </article>
                <article className="cycle-step">
                  <div className="cycle-num">02</div>
                  <h4>Recover and refurbish</h4>
                  <p>We take the vehicle back, inspect the battery, repair the body and prepare it for its next owner.</p>
                </article>
                <article className="cycle-step">
                  <div className="cycle-num">03</div>
                  <h4>Sell or lease it again</h4>
                  <p>The refurbished car reaches a second member at a materially lower price than it did the first.</p>
                </article>
                <article className="cycle-step">
                  <div className="cycle-num">04</div>
                  <h4>Repeat the cycle</h4>
                  <p>Every return feeds the next lease. One battery pack, many owners — and the price keeps falling.</p>
                </article>
              </div>
              <div className="cycle-loop">
                <i></i>
                <span>Cycle repeats · price falls each pass</span>
                <i></i>
              </div>
            </div>

            {/* CHART */}
            <div style={{ marginTop: "44px" }}>
              <figure className="chart-fig">
                <svg viewBox="0 0 640 300" className="chart" role="img" aria-label="Vehicle cost per owner across four reuse cycles">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20"></stop>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffffff"></stop>
                      <stop offset="100%" stopColor="#e82127"></stop>
                    </linearGradient>
                  </defs>
                  <line x1="56" y1="60" x2="612" y2="60" stroke="rgba(255,255,255,0.055)" strokeWidth="1"></line>
                  <line x1="56" y1="110" x2="612" y2="110" stroke="rgba(255,255,255,0.055)" strokeWidth="1"></line>
                  <line x1="56" y1="160" x2="612" y2="160" stroke="rgba(255,255,255,0.055)" strokeWidth="1"></line>
                  <line x1="56" y1="210" x2="612" y2="210" stroke="rgba(255,255,255,0.055)" strokeWidth="1"></line>
                  <path d="M100 74 L232 128 L364 172 L496 200 L496 236 L100 236 Z" fill="url(#areaGrad)"></path>
                  <path d="M100 74 L232 128 L364 172 L496 200" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                  <g>
                    <circle cx="100" cy="74" r="11" fill="#000"></circle>
                    <circle cx="100" cy="74" r="5.5" fill="#fff"></circle>
                    <text x="100" y="54" textAnchor="middle" className="c-val">100%</text>
                    <text x="100" y="262" textAnchor="middle" className="c-lbl">Cycle 1</text>
                    <text x="100" y="278" textAnchor="middle" className="c-sub">New owner</text>
                  </g>
                  <g>
                    <circle cx="232" cy="128" r="11" fill="#000"></circle>
                    <circle cx="232" cy="128" r="5.5" fill="#fff"></circle>
                    <text x="232" y="108" textAnchor="middle" className="c-val">62%</text>
                    <text x="232" y="262" textAnchor="middle" className="c-lbl">Cycle 2</text>
                    <text x="232" y="278" textAnchor="middle" className="c-sub">Recovered</text>
                  </g>
                  <g>
                    <circle cx="364" cy="172" r="11" fill="#000"></circle>
                    <circle cx="364" cy="172" r="5.5" fill="#fff"></circle>
                    <text x="364" y="152" textAnchor="middle" className="c-val">38%</text>
                    <text x="364" y="262" textAnchor="middle" className="c-lbl">Cycle 3</text>
                    <text x="364" y="278" textAnchor="middle" className="c-sub">Refurbished</text>
                  </g>
                  <g>
                    <circle cx="496" cy="200" r="11" fill="#000"></circle>
                    <circle cx="496" cy="200" r="5.5" fill="#fff"></circle>
                    <text x="496" y="180" textAnchor="middle" className="c-val">24%</text>
                    <text x="496" y="262" textAnchor="middle" className="c-lbl">Cycle 4</text>
                    <text x="496" y="278" textAnchor="middle" className="c-sub">Re-leased</text>
                  </g>
                  <text x="56" y="34" className="c-axis">COST TO THE OWNER</text>
                  <text x="612" y="34" textAnchor="end" className="c-axis">SAME VEHICLE · FOUR LIVES</text>
                </svg>
                <figcaption className="chart-cap">
                  One car, four ownership cycles. Each time it returns to us the cost to the next member falls — the vehicle keeps working instead of being scrapped.
                </figcaption>
              </figure>
            </div>

            {/* ECONOMY BAR */}
            <div className="econ" style={{ marginTop: "32px" }}>
              <div>
                <b>1 car</b>
                <span>serves up to 4 members</span>
                <p>Instead of one buyer absorbing the full depreciation, the cost is distributed across every cycle the vehicle survives.</p>
              </div>
              <div>
                <b>0%</b>
                <span>interest on instalments</span>
                <p>Split any member price across up to 12 payments. No credit check, no finance company in the middle.</p>
              </div>
              <div>
                <b>24 mo</b>
                <span>battery health guarantee</span>
                <p>Every refurbished vehicle ships with an inspected pack and a written state-of-health report.</p>
              </div>
            </div>
          </div>
        </section>

        {/* LINEUP PREVIEW */}
        <section className="section" style={{ paddingTop: 0 }} id="lineup">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="eyebrow">The lineup</div>
                <h2>Every model. One membership.</h2>
                <p className="dim" style={{ marginTop: "6px", fontSize: "14px" }}>
                  Interactive 3D showroom models with live 360° inspection and custom paint selector.
                </p>
              </div>
              <Link className="btn btn-ghost" href="/shop">
                All {VEHICLES.length} models <span className="arrow">→</span>
              </Link>
            </div>

            <div className="grid g4">
              {/* Model 3 */}
              <Link className="model-card" href="/shop/model-3">
                <div className="model-visual">
                  <span className="badge badge-accent">MOST LEASED</span>
                  <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 2 }}>
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
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#34d399",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }}></span>
                      3D
                    </span>
                  </div>
                  <CarArt slug="model-3" />
                </div>
                <div className="model-body">
                  <div className="model-name">Model 3</div>
                  <div className="model-era">2017 — present</div>
                  <div className="model-tag">The car that made electric normal.</div>
                  <div className="model-foot">
                    <div>
                      <span className="price-lbl">Member price</span>
                      <div className="price-now">$2,900</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="price-lbl">List</span>
                      <div className="price-was">$42,990</div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Model Y */}
              <Link className="model-card" href="/shop/model-y">
                <div className="model-visual">
                  <span className="badge badge-ok">POPULAR</span>
                  <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 2 }}>
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
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#34d399",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }}></span>
                      3D
                    </span>
                  </div>
                  <CarArt slug="model-y" />
                </div>
                <div className="model-body">
                  <div className="model-name">Model Y</div>
                  <div className="model-era">2020 — present</div>
                  <div className="model-tag">The most practical Tesla ever built.</div>
                  <div className="model-foot">
                    <div>
                      <span className="price-lbl">Member price</span>
                      <div className="price-now">$3,100</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="price-lbl">List</span>
                      <div className="price-was">$46,990</div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Cybertruck */}
              <Link className="model-card" href="/shop/cybertruck">
                <div className="model-visual">
                  <span className="badge badge-accent">MEMBER PICK</span>
                  <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 2 }}>
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
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#34d399",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }}></span>
                      3D
                    </span>
                  </div>
                  <CarArt slug="cybertruck" />
                </div>
                <div className="model-body">
                  <div className="model-name">Cybertruck</div>
                  <div className="model-era">2023 — present</div>
                  <div className="model-tag">Stainless steel. No compromises.</div>
                  <div className="model-foot">
                    <div>
                      <span className="price-lbl">Member price</span>
                      <div className="price-now">$750</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="price-lbl">List</span>
                      <div className="price-was">$99,990</div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Roadster */}
              <Link className="model-card" href="/shop/roadster-2">
                <div className="model-visual">
                  <span className="badge badge-accent">PRE-ORDER</span>
                  <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 2 }}>
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
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#34d399",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }}></span>
                      3D
                    </span>
                  </div>
                  <CarArt slug="roadster-2" />
                </div>
                <div className="model-body">
                  <div className="model-name">Roadster</div>
                  <div className="model-era">2026 — taking pre-orders</div>
                  <div className="model-tag">The fastest car ever built. Full stop.</div>
                  <div className="model-foot">
                    <div>
                      <span className="price-lbl">Member price</span>
                      <div className="price-now">$5,000</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="price-lbl">List</span>
                      <div className="price-was">$200,000</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* LATEST REVEAL FEATURE: ROADSTER SPACEX FLYING MODEL */}
            <div
              style={{
                marginTop: "28px",
                padding: "28px 32px",
                borderRadius: "16px",
                border: "1px solid rgba(56,189,248,0.35)",
                background:
                  "radial-gradient(80% 120% at 100% 50%, rgba(56,189,248,0.14), transparent 70%), linear-gradient(135deg, #0e121a, #07080b)",
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                gap: "34px",
                alignItems: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.08)",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 11px",
                    background: "rgba(56,189,248,0.14)",
                    border: "1px solid rgba(56,189,248,0.4)",
                    color: "#38bdf8",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Latest Reveal · Flight Package
                </span>
                <h3 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", marginTop: "14px", color: "#fff", fontWeight: 400 }}>
                  Roadster SpaceX (Flying Model)
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "13.5px", marginTop: "10px", lineHeight: 1.62 }}>
                  10 directional cold-gas rocket thrusters fed by high-pressure composite overwrapped tanks (COPV). 0—60 mph in 0.8 seconds, mid-air hops, pitch/yaw rotation control, and short-range hovering.
                </p>
                <div style={{ display: "flex", gap: "26px", marginTop: "20px" }}>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#6b7280", letterSpacing: "0.1em", display: "block" }}>0—60 mph</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 500, color: "#38bdf8", marginTop: "2px" }}>0.8 s</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#6b7280", letterSpacing: "0.1em", display: "block" }}>Flight System</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginTop: "2px" }}>10 Thrusters</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#6b7280", letterSpacing: "0.1em", display: "block" }}>Top Speed</span>
                    <div style={{ fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginTop: "2px" }}>250+ mph</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                  <Link href="/shop/roadster-flying" className="btn btn-primary">
                    Pre-order Flying Model <span className="arrow">→</span>
                  </Link>
                  <Link href="/shop/roadster-flying" className="btn btn-ghost">
                    Interactive 3D WebGL Studio
                  </Link>
                </div>
              </div>
              <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 18px 40px rgba(0,0,0,0.8)" }}>
                <CarArt slug="roadster-flying" glow={true} />
              </div>
            </div>
          </div>
        </section>

        {/* VIP SECTION */}
        <section className="section" style={{ paddingTop: 0 }} id="vip">
          <div className="wrap">
            <div className="vip">
              <div>
                <div className="eyebrow">TeslaX VIP</div>
                <h2>First in line for every allocation.</h2>
                <p className="lede" style={{ marginTop: "16px" }}>
                  TeslaX VIP — first allocation, priority delivery, dedicated concierge. Built for members who want the newest model before the public queue opens.
                </p>
                <ul className="vip-list">
                  <li>Priority allocation on new releases, including the Roadster</li>
                  <li>Dedicated concierge for lease, hire and trade-in</li>
                  <li>Reduced deposit on every split-payment order</li>
                  <li>Free self-driving sessions every month</li>
                  <li>Early access to refurbished inventory</li>
                </ul>
              </div>
              <div className="vip-panel">
                <span className="badge">Membership tier</span>
                <div className="vip-price" style={{ marginTop: "14px" }}>
                  $149 <small>/ year</small>
                </div>
                <p className="dim" style={{ fontSize: "12.5px", marginTop: "10px" }}>
                  Included with any active lease. Cancel any time — unused months are credited back to your wallet.
                </p>
                <Link className="btn btn-primary btn-block" href="/signup?plan=vip" style={{ marginTop: "18px" }}>
                  Join as VIP
                </Link>
                <p className="tiny dim" style={{ marginTop: "12px", textAlign: "center" }}>
                  Prefer to talk first? Ask in your member chat
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRADE-IN SECTION */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="card" style={{ padding: "clamp(26px, 4vw, 52px)" }}>
              <div className="swap-grid">
                <div>
                  <div className="eyebrow">Trade in</div>
                  <h2 style={{ marginTop: "14px" }}>Still driving petrol?</h2>
                  <p className="lede" style={{ marginTop: "16px" }}>
                    Tell us what you drive today. We value it against any Tesla in the lineup, and the credit comes straight off your member price — or off your monthly lease.
                  </p>
                  <div className="row" style={{ marginTop: "28px", gap: "10px" }}>
                    <Link className="btn btn-primary" href="/swap">
                      Value my car <span className="arrow">→</span>
                    </Link>
                    <Link className="btn btn-quiet" href="/shop">
                      See the lineup
                    </Link>
                  </div>
                  <div
                    className="grid g3"
                    style={{
                      marginTop: "34px",
                      gap: "1px",
                      background: "var(--line)",
                      border: "1px solid var(--line)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ background: "#060708", padding: "16px 18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>Any make</div>
                      <div className="tiny dim" style={{ marginTop: "3px" }}>
                        Petrol, diesel or hybrid
                      </div>
                    </div>
                    <div style={{ background: "#060708", padding: "16px 18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>Instant range</div>
                      <div className="tiny dim" style={{ marginTop: "3px" }}>
                        Estimated in 24 hours
                      </div>
                    </div>
                    <div style={{ background: "#060708", padding: "16px 18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>Offset</div>
                      <div className="tiny dim" style={{ marginTop: "3px" }}>
                        Applied to your order
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="card-flat card" style={{ padding: "20px" }}>
                    <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
                      Worked example
                    </div>
                    <div className="kv">
                      <span className="k">2016 saloon, 90k miles</span>
                      <span className="v">valued at $4,200</span>
                    </div>
                    <div className="kv">
                      <span className="k">Model 3 member price</span>
                      <span className="v">$2,900</span>
                    </div>
                    <div className="kv" style={{ borderTop: "1px solid var(--line-strong)", marginTop: "6px", paddingTop: "14px" }}>
                      <span className="k">Your balance</span>
                      <span className="v" style={{ color: "#6ee7b7" }}>$1,300 credit</span>
                    </div>
                    <div className="alert alert-ok" style={{ margin: "16px 0 0", fontSize: "12px" }}>
                      Trade-ins frequently cover the full member price of a Model 3.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INVEST IN TESLAX STOCK SECTION */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: "80px" }} id="invest">
          <div className="wrap">
            <div
              style={{
                background: "linear-gradient(135deg, #090c12 0%, #050608 100%)",
                border: "1px solid rgba(52, 211, 153, 0.22)",
                borderRadius: "16px",
                padding: "clamp(24px, 4vw, 44px)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-80px",
                  right: "-80px",
                  width: "280px",
                  height: "280px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div className="row-between" style={{ alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                <div style={{ maxWidth: "560px" }}>
                  <div className="eyebrow" style={{ color: "#34d399", marginBottom: "12px" }}>
                    Public &amp; Private Equity
                  </div>
                  <h2 style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", color: "#fff" }}>
                    Invest in Tesla<i>X</i> Common Stock
                  </h2>
                  <p className="lede" style={{ marginTop: "12px", fontSize: "14.5px" }}>
                    Direct equity participation in the global circular electric fleet, automated Megapack grid arbitrage, and autonomous Cybercab network. Real-time ticker quotes and direct customer care concierge routing.
                  </p>
                  <div style={{ display: "flex", gap: "18px", marginTop: "18px", flexWrap: "wrap", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }}></span>
                      <span style={{ color: "#d1d5db" }}>NASDAQ: <strong>TSLAX</strong></span>
                    </div>
                    <div style={{ color: "#34d399", fontWeight: 600 }}>$924.8B Market Cap</div>
                    <div style={{ color: "#9ca3af" }}>18.4% Annualized Fleet Yield</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
                  <Link href="/invest" className="btn btn-primary btn-lg" style={{ textAlign: "center" }}>
                    View Realtime Chart &amp; Invest →
                  </Link>
                  <a
                    href="mailto:support@teslax.io?subject=Direct%20TeslaX%20Stock%20Inquiry"
                    className="btn btn-ghost"
                    style={{ textAlign: "center" }}
                  >
                    ✉ Contact Customer Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="section-sm" style={{ borderTop: "1px solid var(--line)", background: "#030405" }}>
          <div className="wrap">
            <div className="row-between">
              <div>
                <Link href="/" className="brand" aria-label="TeslaX home">
                  <svg width="21" height="21" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
                    <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
                    <path d="M42.8 45.5 57.2 45.5 56.1 51.4 43.9 51.4Z" opacity=".55"></path>
                  </svg>
                  <span className="brand-word">
                    TESLA<i>X</i>
                  </span>
                </Link>
                <h2 style={{ marginTop: "22px", maxWidth: "18ch" }}>One membership. The whole lineup.</h2>
              </div>
              <div className="stack" style={{ gap: "10px", minWidth: "260px" }}>
                <Link className="btn btn-primary btn-lg btn-block" href="/signup">
                  Become a member <span className="arrow">→</span>
                </Link>
                <p className="tiny dim center">Free to join · email verification required</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
