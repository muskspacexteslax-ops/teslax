"use client";

import React, { useState, useEffect } from "react";
import { useTeslaX } from "@/context/TeslaXContext";

export default function DashboardProfilePage() {
  const { user, updateProfile } = useTeslaX();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setCountry(user.country || "");
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, phone, country });
  };

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Profile</h1>
            <p>Your member details, contact information and account security.</p>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <div className="card">
          <div className="eyebrow no-rule" style={{ marginBottom: "16px" }}>
            Member details
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span className="label">Full name</span>
              <input
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span className="label">Email address</span>
                <input
                  className="input"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </label>

              <label className="field">
                <span className="label">Phone number</span>
                <input
                  className="input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span className="label">Country of residence</span>
              <input
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>

            <button className="btn btn-primary" type="submit" style={{ marginTop: "10px" }}>
              Save changes
            </button>
          </form>
        </div>

        <aside>
          <div className="card card-flat">
            <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
              Account status
            </div>
            <div className="kv">
              <span className="k">Member ID</span>
              <span className="v mono">{user?.memberId}</span>
            </div>
            <div className="kv">
              <span className="k">Verification</span>
              <span className="v" style={{ color: "#6ee7b7" }}>Verified</span>
            </div>
            <div className="kv">
              <span className="k">Tier</span>
              <span className="v">{user?.isVip ? "TeslaX VIP" : "Standard Member"}</span>
            </div>
            <div className="kv">
              <span className="k">Security</span>
              <span className="v">Encrypted 256-bit</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: "14px" }}>
            <div className="eyebrow no-rule" style={{ marginBottom: "8px" }}>
              Need assistance?
            </div>
            <p className="dim" style={{ fontSize: "12.5px", lineHeight: 1.6 }}>
              Our concierge team is available to assist with vehicle delivery schedules, payment queries, or trade-in appraisals.
            </p>
            <a
              className="btn btn-quiet btn-block btn-sm"
              href="mailto:concierge@teslax.io"
              style={{ marginTop: "12px" }}
            >
              Contact Concierge
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
