"use client";

import React, { useState } from "react";
import { useTeslaX } from "@/context/TeslaXContext";
import { formatCurrency } from "@/data/vehicles";

export default function DashboardWalletPage() {
  const { walletBalance, transactions, topUpWallet } = useTeslaX();
  const [amount, setAmount] = useState<number>(500);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setLoading(true);
    topUpWallet(amount, method);
    setLoading(false);
  };

  return (
    <>
      <header className="page-head">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Wallet</h1>
            <p>Top up once, pay instalments instantly. No card stored on file.</p>
          </div>
        </div>
      </header>

      <div className="dash-top">
        <div className="balance">
          <div className="eyebrow no-rule">
            <span className="dot" style={{ background: "#34d399", color: "#34d399" }}></span> Available balance
          </div>
          <div className="amt">{formatCurrency(walletBalance)}</div>
          <div className="hint">Instalments are deducted automatically when due.</div>
        </div>

        <div className="card">
          <div className="eyebrow no-rule" style={{ marginBottom: "14px" }}>
            Top up
          </div>
          <form onSubmit={handleTopup}>
            <label className="field">
              <span className="label">Amount (USD)</span>
              <input
                className="input"
                name="amount"
                type="number"
                min="10"
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="500"
                required
              />
            </label>
            <label className="field">
              <span className="label">Method</span>
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="card">Card (Instant)</option>
                <option value="transfer">Bank transfer</option>
                <option value="crypto">Crypto (USDC / USDT)</option>
              </select>
            </label>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Processing…" : `Add ${formatCurrency(amount)} to wallet`}
            </button>
          </form>
          <p className="tiny dim" style={{ marginTop: "10px", lineHeight: 1.6 }}>
            Top-ups are credited once confirmed. Card and crypto are processed by our secure payments partner.
          </p>
        </div>
      </div>

      <h3 style={{ fontSize: "1.1rem", margin: "32px 0 14px" }}>Activity</h3>

      {transactions.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No wallet activity yet</p>
          <p className="dim" style={{ fontSize: "13.5px", maxWidth: "44ch", margin: "0 auto" }}>
            Top-ups and instalment payments will show up here.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="num">{tx.id}</td>
                  <td style={{ textTransform: "capitalize" }}>{tx.type}</td>
                  <td>{tx.description}</td>
                  <td className="dim">{tx.createdDate}</td>
                  <td className="num" style={{ color: tx.type === "topup" ? "#6ee7b7" : "var(--text)" }}>
                    {tx.type === "topup" ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  </td>
                  <td>
                    <span className="badge badge-ok">{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
