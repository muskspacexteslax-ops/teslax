"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { StockQuote, StockPoint } from "@/app/api/stock/route";

interface StockChartProps {
  compact?: boolean;
  onPriceUpdate?: (price: number) => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  compact = false,
  onPriceUpdate,
}) => {
  const [selectedInterval, setSelectedInterval] = useState<string>("1D");
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  const lastPriceRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const fetchQuote = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(`/api/stock?interval=${selectedInterval}&t=${Date.now()}`);
        if (!res.ok) throw new Error("Stock fetch failed");
        const data: StockQuote = await res.json();

        if (lastPriceRef.current !== null && data.currentPrice !== lastPriceRef.current) {
          setPriceFlash(data.currentPrice > lastPriceRef.current ? "up" : "down");
          setTimeout(() => setPriceFlash(null), 1200);
        }
        lastPriceRef.current = data.currentPrice;

        setQuote(data);
        if (onPriceUpdate) {
          onPriceUpdate(data.currentPrice);
        }
      } catch (err) {
        console.error("Error fetching stock quote:", err);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [selectedInterval, onPriceUpdate]
  );

  useEffect(() => {
    fetchQuote(true);
  }, [fetchQuote]);

  // Real-time polling every 6 seconds when live is active
  useEffect(() => {
    if (!isLive) return;
    const timer = window.setInterval(() => {
      fetchQuote(false);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isLive, fetchQuote]);

  // SVG Chart Geometry calculations
  const history = quote?.history || [];
  const svgWidth = 840;
  const svgHeight = compact ? 240 : 340;
  const padLeft = 14;
  const padRight = 62;
  const padTop = 24;
  const padBottom = 38;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const prices = history.map((pt) => pt.price);
  const minPriceRaw = prices.length ? Math.min(...prices) : 260;
  const maxPriceRaw = prices.length ? Math.max(...prices) : 290;
  const priceMargin = (maxPriceRaw - minPriceRaw) * 0.08 || 1;
  const minPrice = minPriceRaw - priceMargin;
  const maxPrice = maxPriceRaw + priceMargin;

  const getCoordinates = (index: number, price: number) => {
    const x =
      history.length > 1
        ? padLeft + (index / (history.length - 1)) * plotWidth
        : padLeft;
    const y =
      padTop + (1 - (price - minPrice) / (maxPrice - minPrice)) * plotHeight;
    return { x, y };
  };

  const points = history.map((pt, i) => getCoordinates(i, pt.price));

  // Build SVG path
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth subtle quadratic curve
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    const lastPt = points[points.length - 1];
    areaD = `${pathD} L ${lastPt.x} ${padTop + plotHeight} L ${points[0].x} ${padTop + plotHeight} Z`;
  }

  // Handle mouse scrub
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || history.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (mouseX - padLeft) / plotWidth));
    const targetIdx = Math.round(ratio * (history.length - 1));
    setHoverIndex(targetIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeIndex = hoverIndex !== null ? hoverIndex : history.length - 1;
  const activePoint: StockPoint | undefined = history[activeIndex];
  const activeCoord =
    activePoint && activeIndex >= 0 ? points[activeIndex] : null;

  const isPositive = (quote?.change ?? 0) >= 0;
  const lineColor = isPositive ? "#34d399" : "#f87171";
  const glowColor = isPositive ? "rgba(52, 211, 153, 0.35)" : "rgba(248, 113, 113, 0.35)";

  // Price horizontal guide lines
  const gridSteps = 4;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const p = minPriceRaw + ((maxPriceRaw - minPriceRaw) * i) / gridSteps;
    const y = padTop + (1 - (p - minPrice) / (maxPrice - minPrice)) * plotHeight;
    return { price: p, y };
  });

  // Time labels on bottom axis
  const timeLabelsCount = 5;
  const timeLabels = Array.from({ length: timeLabelsCount }, (_, i) => {
    const idx = Math.floor((i / (timeLabelsCount - 1)) * (history.length - 1));
    return {
      label: history[idx]?.time || "",
      x: points[idx]?.x || padLeft,
    };
  });

  return (
    <div className="stock-chart-card">
      <style jsx>{`
        .stock-chart-card {
          background: #08090b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .quote-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .symbol-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.18em;
          color: #8b9199;
          font-weight: 600;
          text-transform: uppercase;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px #34d399;
          position: relative;
        }
        .live-dot::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(52, 211, 153, 0.6);
          animation: pulse 2s infinite ease-out;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .price-display {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-top: 2px;
        }
        .big-price {
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          color: #fff;
          transition: color 0.3s ease;
        }
        .big-price.flash-up {
          color: #34d399;
          text-shadow: 0 0 16px rgba(52, 211, 153, 0.4);
        }
        .big-price.flash-down {
          color: #f87171;
          text-shadow: 0 0 16px rgba(248, 113, 113, 0.4);
        }
        .delta-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--mono, monospace);
        }
        .delta-badge.positive {
          background: rgba(52, 211, 153, 0.14);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.28);
        }
        .delta-badge.negative {
          background: rgba(248, 113, 113, 0.14);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.28);
        }
        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .intervals-group {
          display: inline-flex;
          background: #101115;
          padding: 3px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .interval-btn {
          background: transparent;
          border: none;
          color: #717782;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .interval-btn:hover {
          color: #fff;
        }
        .interval-btn.active {
          background: #1b1d24;
          color: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }
        .live-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #717782;
          cursor: pointer;
          user-select: none;
        }
        .live-toggle input {
          accent-color: #34d399;
          cursor: pointer;
        }
        .chart-container {
          position: relative;
          width: 100%;
          cursor: crosshair;
        }
        .metrics-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .metric-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #646b77;
        }
        .metric-val {
          font-size: 14px;
          font-weight: 500;
          color: #d1d5db;
          font-family: var(--mono, monospace);
        }
        .scrubber-hud {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(18, 19, 23, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          margin-bottom: 12px;
        }
        .hud-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hud-label {
          color: #717782;
          font-size: 11px;
          text-transform: uppercase;
        }
        .hud-val {
          color: #fff;
          font-family: var(--mono, monospace);
          font-weight: 600;
        }
      `}</style>

      {/* Top Header */}
      <div className="header-row">
        <div className="quote-left">
          <div className="symbol-tag">
            <span className="live-dot" />
            <span>NASDAQ: TSLAX · CIRCULAR MOBILITY &amp; ENERGY</span>
          </div>
          <div className="price-display">
            <span
              className={`big-price ${
                priceFlash === "up"
                  ? "flash-up"
                  : priceFlash === "down"
                  ? "flash-down"
                  : ""
              }`}
            >
              ${activePoint ? activePoint.price.toFixed(2) : "284.50"}
            </span>
            <span className={`delta-badge ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? "▲ +" : "▼ "}
              {quote?.change ? Math.abs(quote.change).toFixed(2) : "0.00"} (
              {isPositive ? "+" : ""}
              {quote?.changePercent ? quote.changePercent.toFixed(2) : "0.00"}%)
            </span>
          </div>
        </div>

        <div className="header-right">
          <div className="intervals-group">
            {["1D", "1W", "1M", "1Y", "ALL"].map((int) => (
              <button
                key={int}
                type="button"
                className={`interval-btn ${selectedInterval === int ? "active" : ""}`}
                onClick={() => setSelectedInterval(int)}
              >
                {int}
              </button>
            ))}
          </div>

          <label className="live-toggle">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            <span>Auto-Refresh Realtime (6s)</span>
          </label>
        </div>
      </div>

      {/* Scrubber HUD Bar when hovering */}
      <div className="scrubber-hud">
        <div className="hud-item">
          <span className="hud-label">Time:</span>
          <span className="hud-val">{activePoint?.time || "Realtime"}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Scrub Price:</span>
          <span className="hud-val" style={{ color: lineColor }}>
            ${activePoint ? activePoint.price.toFixed(2) : "--"}
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Est. Volume:</span>
          <span className="hud-val">
            {activePoint ? activePoint.volume.toLocaleString() : "--"}
          </span>
        </div>
        <div className="hud-item" style={{ marginLeft: "auto" }}>
          <span className="hud-label">Currency:</span>
          <span className="hud-val">USD ($)</span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="chart-container">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.28" />
              <stop offset="85%" stopColor={lineColor} stopOpacity="0.01" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor={lineColor}
                floodOpacity="0.4"
              />
            </filter>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {gridValues.map((g, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={g.y}
                x2={svgWidth - padRight}
                y2={g.y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - padRight + 10}
                y={g.y + 4}
                fill="#555a64"
                fontSize="11"
                fontFamily="var(--mono, monospace)"
              >
                ${g.price.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#stockGradient)" />}

          {/* Glowing Stroke Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineGlow)"
            />
          )}

          {/* X Axis Time Labels */}
          {timeLabels.map((tl, idx) => (
            <text
              key={idx}
              x={tl.x}
              y={svgHeight - 10}
              fill="#5d636e"
              fontSize="11"
              textAnchor={idx === 0 ? "start" : idx === timeLabels.length - 1 ? "end" : "middle"}
              fontFamily="var(--mono, monospace)"
            >
              {tl.label}
            </text>
          ))}

          {/* Interactive Crosshair & Cursor Anchor */}
          {activeCoord && (
            <g>
              {/* Vertical crosshair line */}
              <line
                x1={activeCoord.x}
                y1={padTop}
                x2={activeCoord.x}
                y2={padTop + plotHeight}
                stroke="rgba(255, 255, 255, 0.22)"
                strokeDasharray="3 3"
              />

              {/* Outer pulsing beacon ring */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="10"
                fill="none"
                stroke={lineColor}
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />

              {/* Center point */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4.5"
                fill="#fff"
                stroke={lineColor}
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Metrics Row */}
      <div className="metrics-strip">
        <div className="metric-box">
          <span className="metric-label">Market Capitalization</span>
          <span className="metric-val">{quote?.marketCap || "$924.8B"}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">24H Trading Volume</span>
          <span className="metric-val">{quote?.volume24h || "46.8M"}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Day High / Low</span>
          <span className="metric-val">
            ${quote?.highPrice ?? "286.4"} / ${quote?.lowPrice ?? "268.2"}
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">52-Wk Range</span>
          <span className="metric-val">
            ${quote?.fiftyTwoWeekLow ?? "138.8"} – ${quote?.fiftyTwoWeekHigh ?? "299.8"}
          </span>
        </div>
        <div className="metric-box">
          <span className="metric-label">P/E Ratio</span>
          <span className="metric-val">{quote?.peRatio || "64.2"}</span>
        </div>
      </div>
    </div>
  );
};
