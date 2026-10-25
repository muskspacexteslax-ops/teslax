"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTeslaX } from "@/context/TeslaXContext";

function AppSidebarInner() {
  const pathname = usePathname();
  const { user, logout } = useTeslaX();

  const isLinkActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <nav className="side" aria-label="Dashboard">
      <div className="side-group">
        <div className="side-group-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }}></span>
          {user?.isVip ? "VIP MEMBER" : "ACTIVE MEMBER"}
        </div>
      </div>

      <div className="side-group">
        <div className="side-group-title">Overview</div>
        <Link className={`side-link ${isLinkActive("/dashboard") && pathname === "/dashboard" ? "on" : ""}`} href="/dashboard">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 8.8 9 3l6.5 5.8V16H2.5z"></path>
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/shop") ? "on" : ""}`} href="/dashboard/shop">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 5.5h13l-.9 10.5H3.4zM5.5 5.5V4a3.5 3.5 0 0 1 7 0v1.5"></path>
          </svg>
          <span>Member shop</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/orders") ? "on" : ""}`} href="/dashboard/orders">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 2.5h10v14H4zM6.5 6.5h5M6.5 10h5"></path>
          </svg>
          <span>My orders</span>
        </Link>
      </div>

      <div className="side-group">
        <div className="side-group-title">Vehicles</div>
        <Link className={`side-link ${isLinkActive("/dashboard/lease") ? "on" : ""}`} href="/dashboard/lease">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9.5a3 3 0 1 1 2.6 3L11 15l2-.4.5 1.6 2-.4"></path>
          </svg>
          <span>Lease a Tesla</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/hire") ? "on" : ""}`} href="/dashboard/hire">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 8.8 9 3l6.5 5.8V16H2.5z"></path>
          </svg>
          <span>Hire a Tesla</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/driving") ? "on" : ""}`} href="/dashboard/driving">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 2.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM9 2.5v6.5h6.2"></path>
          </svg>
          <span>Self-driving</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/roadster") ? "on" : ""}`} href="/dashboard/roadster">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 2.5 6 15.5M9 2.5l3 13M3.5 12h11"></path>
          </svg>
          <span>Roadster pre-order</span>
        </Link>
      </div>

      <div className="side-group">
        <div className="side-group-title">Account</div>
        <Link className={`side-link ${isLinkActive("/dashboard/invest") ? "on" : ""}`} href="/dashboard/invest">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 13.5 7 9l3 3 5.5-6.5M12.5 5.5H15.5V8.5"></path>
          </svg>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Invest (TSLAX)
            <span style={{ fontSize: "9px", background: "rgba(52,211,153,0.15)", color: "#34d399", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>LIVE</span>
          </span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/wallet") ? "on" : ""}`} href="/dashboard/wallet">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 5.5h13v9h-13zM11.5 10h3"></path>
          </svg>
          <span>Wallet</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/vip") ? "on" : ""}`} href="/dashboard/vip">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 2.5l1.9 4 4.4.6-3.2 3 .8 4.3L9 12.4l-3.9 2 .8-4.3-3.2-3 4.4-.6z"></path>
          </svg>
          <span>TeslaX VIP</span>
        </Link>
        <Link className={`side-link ${isLinkActive("/dashboard/profile") ? "on" : ""}`} href="/dashboard/profile">
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 9.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM3 16c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5"></path>
          </svg>
          <span>Profile</span>
        </Link>
      </div>

      <div className="side-group side-foot">
        <button
          onClick={logout}
          className="side-link"
          style={{ width: "100%", background: "none", border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: "13.5px", textAlign: "left" }}
        >
          <svg className="ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 3.5H3.5v11H7M12 9H6.5M12 9 9.5 6.5M12 9l-2.5 2.5"></path>
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}

export const AppSidebar: React.FC = () => {
  return (
    <Suspense fallback={<nav className="side" style={{ width: "236px" }} />}>
      <AppSidebarInner />
    </Suspense>
  );
};
