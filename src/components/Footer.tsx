"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="TeslaX home">
              <svg
                width="21"
                height="21"
                viewBox="0 0 100 100"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
                <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
                <path d="M42.8 45.5 57.2 45.5 56.1 51.4 43.9 51.4Z" opacity=".55"></path>
              </svg>
              <span className="brand-word">
                TESLA<i>X</i>
              </span>
            </Link>
            <p className="lede" style={{ marginTop: "16px", maxWidth: "34ch", fontSize: "13.5px" }}>
              We want everyone to own a Tesla.
            </p>
          </div>

          <div className="footer-cols">
            <div>
              <h5>Vehicles</h5>
              <Link href="/shop">All models</Link>
              <Link href="/shop?body=sedan">Sedans</Link>
              <Link href="/shop?body=suv">SUVs</Link>
              <Link href="/shop?body=truck">Cybertruck</Link>
              <Link href="/shop?body=roadster">Roadster</Link>
            </div>
            <div>
              <h5>Programme</h5>
              <Link href="/#how">Circular model</Link>
              <Link href="/swap">Trade in a petrol car</Link>
              <Link href="/invest">Invest in TSLAX stock</Link>
              <Link href="/#vip">TeslaX VIP</Link>
              <Link href="/signup">Membership</Link>
            </div>
            <div>
              <h5>Customer Support</h5>
              <a href="mailto:support@teslax.io">support@teslax.io</a>
              <a href="mailto:support@teslax.io?subject=Stock%20Allocation%20Inquiry" style={{ color: "#34d399", fontSize: "13px" }}>IR &amp; Stock Concierge →</a>
              <span className="dim">WhatsApp Concierge (24/7)</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© <span id="yr">{currentYear}</span> TeslaX. Concept membership platform.</span>
          <span className="dim tiny">
            Tesla, Model S, Model 3, Model X, Model Y, Cybertruck and Roadster are trademarks of Tesla, Inc.
            TeslaX is an independent concept and is not affiliated with Tesla, Inc.
          </span>
        </div>
      </div>
    </footer>
  );
};
