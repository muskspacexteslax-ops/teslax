import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ minHeight: "80svh", display: "grid", placeItems: "center", textAlign: "center", paddingTop: "60px" }}>
      <div>
        <div className="eyebrow no-rule" style={{ justifyContent: "center" }}>
          404
        </div>
        <h1 style={{ marginTop: "16px", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
          Wrong turn.
        </h1>
        <p className="lede" style={{ margin: "16px auto 0" }}>
          That page doesn&#39;t exist. The lineup is still where you left it.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: "28px" }}>
          <Link className="btn btn-primary" href="/">
            Home
          </Link>
          <Link className="btn btn-ghost" href="/shop">
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
