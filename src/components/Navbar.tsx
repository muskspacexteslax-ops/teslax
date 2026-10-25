"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTeslaX } from "@/context/TeslaXContext";

function NavbarInner() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useTeslaX();

  useEffect(() => {
    const handleScroll = () => {
      setSolid(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`nav ${solid ? "solid" : ""}`} id="site-nav">
        <div className="nav-inner">
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

          <nav className="nav-links" aria-label="Primary">
            <Link
              className={`nav-link ${pathname === "/shop" ? "active" : ""}`}
              href="/shop"
            >
              Shop
            </Link>
            <Link className="nav-link" href="/#how">
              How it works
            </Link>
            <Link
              className={`nav-link ${pathname === "/swap" ? "active" : ""}`}
              href="/swap"
            >
              Trade in
            </Link>
            <Link
              className={`nav-link ${pathname === "/invest" ? "active" : ""}`}
              href="/invest"
            >
              Invest <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 600, marginLeft: "3px" }}>TSLAX</span>
            </Link>
            <Link className="nav-link" href="/#vip">
              VIP
            </Link>
          </nav>

          <div className="nav-cta">
            {user ? (
              <Link className="btn btn-primary btn-sm" href="/dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link className="btn btn-ghost btn-sm" href="/login">
                  Log in
                </Link>
                <Link className="btn btn-primary btn-sm" href="/signup">
                  Become a member
                </Link>
              </>
            )}

            <button
              className="burger"
              id="burger"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                style={
                  menuOpen
                    ? { transform: "rotate(45deg) translate(3px, 3px)" }
                    : undefined
                }
              ></span>
              <span
                style={
                  menuOpen
                    ? { transform: "rotate(-45deg) translate(3px, -3px)" }
                    : undefined
                }
              ></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="mobile-menu">
        <Link href="/shop">Shop</Link>
        <Link href="/#how">How it works</Link>
        <Link href="/swap">Trade in your car</Link>
        <Link href="/invest">Invest in TSLAX</Link>
        <Link href="/#vip">TeslaX VIP</Link>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={logout}
              className="btn btn-ghost btn-block"
              style={{ marginTop: "14px" }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup">Become a member</Link>
          </>
        )}
      </div>
    </>
  );
}

export const Navbar: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ height: "58px" }} />}>
      <NavbarInner />
    </Suspense>
  );
};
