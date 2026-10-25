"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarArt } from "@/components/CarArt";
import { useTeslaX } from "@/context/TeslaXContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useTeslaX();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    login(email || "member@teslax.io");
    router.push("/dashboard");
  };

  return (
    <main id="main">
      <div className="auth-shell">
        <div className="auth-main">
          <div className="auth-box">
            <div style={{ marginBottom: "34px" }}>
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
            </div>

            <h1 style={{ fontSize: "2rem" }}>Welcome back</h1>
            <p className="lede" style={{ marginTop: "12px", fontSize: "13.5px" }}>
              Log in to see your wallet, orders and the member shop.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
              <label className="field">
                <span className="label">Email</span>
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="field">
                <span className="label">Password</span>
                <input
                  className="input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>

              <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
                {loading ? "Signing in…" : "Log in"} <span className="arrow">→</span>
              </button>
            </form>

            <p className="tiny dim" style={{ marginTop: "20px", textAlign: "center" }}>
              New here?{" "}
              <Link href="/signup" style={{ color: "#fff", textDecoration: "underline" }}>
                Become a member
              </Link>
            </p>
          </div>
        </div>

        <aside className="auth-aside">
          <div>
            <div className="eyebrow no-rule">TeslaX membership</div>
            <h2 style={{ marginTop: "16px", fontSize: "2rem", maxWidth: "16ch" }}>
              Everyone should own a Tesla.
            </h2>
            <p className="lede" style={{ marginTop: "16px", fontSize: "13.5px", maxWidth: "34ch" }}>
              Verify your email, unlock member pricing, and split any vehicle across instalments at 0% interest.
            </p>
          </div>

          <div className="car">
            <CarArt slug="cybertruck" glow={true} />
          </div>

          <div className="row" style={{ gap: "20px", position: "relative", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 400 }}>0%</div>
              <div className="tiny dim">Interest</div>
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 400 }}>8</div>
              <div className="tiny dim">Models</div>
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 400 }}>4×</div>
              <div className="tiny dim">Reuse cycles</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
