"use client";

import React from "react";
import { useTeslaX } from "@/context/TeslaXContext";

export default function DashboardVipPage() {
  const { user, activateVip } = useTeslaX();

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>TeslaX VIP</h1>
            <p>Priority vehicle allocations, dedicated concierge, and early access to refurbished inventory.</p>
          </div>
        </div>
      </header>

      <div className="vip" style={{ padding: "34px" }}>
        <div>
          <div className="eyebrow">
            {user?.isVip ? "Active Tier" : "Upgrade"}
          </div>
          <h2>Move to the front of the queue.</h2>
          <p className="lede" style={{ marginTop: "14px" }}>
            TeslaX VIP guarantees priority delivery on all models, dedicated concierge support, and waived arrangement fees across every lease.
          </p>

          <ul className="vip-list">
            <li>Priority allocation on new releases, including the Roadster</li>
            <li>Dedicated concierge for lease, hire and trade-in support</li>
            <li>Reduced deposit on every split-payment order</li>
            <li>Free self-driving sessions every month</li>
            <li>Early access to refurbished inventory drops</li>
          </ul>
        </div>

        <div className="vip-panel">
          <span className="badge badge-accent">Membership tier</span>
          <div className="vip-price" style={{ marginTop: "14px" }}>
            $149 <small>/ year</small>
          </div>
          <p className="dim" style={{ fontSize: "12.5px", marginTop: "10px" }}>
            Included with any active lease. Cancel any time — unused months are credited back to your wallet.
          </p>

          {user?.isVip ? (
            <div className="alert alert-ok" style={{ marginTop: "18px", fontSize: "13px" }}>
              ✓ You are an active VIP member. Priority benefits applied to your account.
            </div>
          ) : (
            <button
              onClick={activateVip}
              className="btn btn-primary btn-block"
              style={{ marginTop: "18px" }}
            >
              Activate VIP tier ($149/yr)
            </button>
          )}

          <p className="tiny dim" style={{ marginTop: "12px", textAlign: "center" }}>
            Questions? Contact concierge at vip@teslax.io
          </p>
        </div>
      </div>
    </>
  );
}
