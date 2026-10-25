"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeslaX } from "@/context/TeslaXContext";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "test@example.com";
  const previewCode = searchParams.get("preview") || "998177";

  const { verifyCode, showToast } = useTeslaX();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullCode = digits.join("");

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (fullCode.length !== 6) {
      showToast("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    const ok = verifyCode(fullCode);
    if (ok) {
      router.push("/dashboard?ok=" + encodeURIComponent("Membership activated. Welcome to TeslaX."));
    } else {
      setLoading(false);
      showToast("Invalid code, please try again");
    }
  };

  // Auto-fill preview code on click
  const handleUsePreview = () => {
    setDigits(previewCode.split(""));
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

            <div className="steps-ind">
              <i className="on"></i>
              <i className="on"></i>
              <i></i>
            </div>

            <div className="eyebrow no-rule" style={{ marginBottom: "10px" }}>
              Step 2 of 3
            </div>
            <h1 style={{ fontSize: "2rem" }}>Check your inbox</h1>
            <p className="lede" style={{ marginTop: "12px", fontSize: "13.5px" }}>
              We sent a 6-digit code to <strong style={{ color: "#fff" }}>{emailParam}</strong>. Enter it below to activate your membership.
            </p>

            <div style={{ marginTop: "22px" }}>
              <div
                className="alert alert-info cursor-pointer hover:border-white/40 transition-colors"
                onClick={handleUsePreview}
                title="Click to auto-fill"
              >
                <strong>Preview mode.</strong> No mail provider is connected yet, so here is your code:{" "}
                <span className="mono" style={{ fontSize: "16px", letterSpacing: "0.2em", color: "#fff" }}>
                  {previewCode}
                </span>{" "}
                <span className="tiny dim">(click to fill)</span>
              </div>
            </div>

            <form onSubmit={handleVerify} style={{ marginTop: "24px" }}>
              <span className="label" style={{ display: "block", marginBottom: "8px" }}>
                Verification code
              </span>
              <div className="code-inputs">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${i + 1}`}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={digit ? "filled" : ""}
                  />
                ))}
              </div>

              <span className="help" style={{ display: "block", marginBottom: "16px" }}>
                The code expires in 15 minutes.
              </span>

              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? "Verifying…" : "Verify and continue"} <span className="arrow">→</span>
              </button>
            </form>

            <button
              type="button"
              onClick={() => showToast("A fresh code has been sent")}
              className="btn btn-quiet btn-block"
              style={{ marginTop: "12px", height: "38px", fontSize: "12px" }}
            >
              Resend code
            </button>

            <p className="tiny dim" style={{ marginTop: "20px", textAlign: "center" }}>
              Wrong address?{" "}
              <Link href="/signup" style={{ color: "#fff", textDecoration: "underline" }}>
                Start over
              </Link>
            </p>
          </div>
        </div>

        <aside className="auth-aside">
          <div>
            <div className="eyebrow no-rule">Why verify</div>
            <h2 style={{ marginTop: "16px", fontSize: "1.9rem", maxWidth: "18ch" }}>
              One member, one allocation.
            </h2>
            <p className="lede" style={{ marginTop: "16px", fontSize: "13.5px", maxWidth: "34ch" }}>
              Verified email keeps the queue fair and lets us reach you when your model is ready.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="row" style={{ gap: "14px", marginBottom: "10px" }}>
              <svg width="17" height="17" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
                <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
                <path d="M42.8 45.5 57.2 45.5 56.1 51.4 43.9 51.4Z" opacity=".55"></path>
              </svg>
              <span style={{ fontSize: "12.5px", color: "#cfd3d8" }}>Encrypted in transit</span>
            </div>
            <div className="row" style={{ gap: "14px", marginBottom: "10px" }}>
              <svg width="17" height="17" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
                <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
                <path d="M42.8 45.5 57.2 45.5 56.1 51.4 43.9 51.4Z" opacity=".55"></path>
              </svg>
              <span style={{ fontSize: "12.5px", color: "#cfd3d8" }}>Never sold or shared</span>
            </div>
            <div className="row" style={{ gap: "14px" }}>
              <svg width="17" height="17" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
                <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
                <path d="M42.8 45.5 57.2 45.5 56.1 51.4 43.9 51.4Z" opacity=".55"></path>
              </svg>
              <span style={{ fontSize: "12.5px", color: "#cfd3d8" }}>Delete your account any time</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: "140px" }}>Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
