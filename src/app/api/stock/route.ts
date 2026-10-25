import { NextResponse } from "next/server";

export interface StockPoint {
  time: string;
  timestamp: number;
  price: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  currency: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  marketCap: string;
  volume24h: string;
  peRatio: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  lastUpdated: string;
  interval: string;
  history: StockPoint[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const interval = searchParams.get("interval") || "1D";

    // Base price anchor for TeslaX circular equity
    const basePrice = 284.5;
    const now = Date.now();

    // Deterministic yet dynamic micro-variance based on current time (every 5 seconds)
    const timeCycle = Math.floor(now / 5000);
    const wave = Math.sin(timeCycle * 0.4) * 2.8 + Math.cos(timeCycle * 0.17) * 1.6;
    const microJitter = (Math.sin(timeCycle * 1.9) * 0.45);
    const livePrice = Number((basePrice + wave + microJitter).toFixed(2));

    const openPrice = 271.8;
    const previousClose = 270.25;
    const change = Number((livePrice - previousClose).toFixed(2));
    const changePercent = Number(((change / previousClose) * 100).toFixed(2));

    // Generate historical points based on interval
    let pointsCount = 48; // for 1D (every 10 mins over an 8-hour trading window)
    let stepMs = 10 * 60 * 1000;
    let volatility = 1.2;
    let trend = 0.28;

    if (interval === "1W") {
      pointsCount = 35;
      stepMs = 4 * 60 * 60 * 1000;
      volatility = 3.5;
      trend = 0.55;
    } else if (interval === "1M") {
      pointsCount = 30;
      stepMs = 24 * 60 * 60 * 1000;
      volatility = 6.2;
      trend = 1.1;
    } else if (interval === "1Y") {
      pointsCount = 52;
      stepMs = 7 * 24 * 60 * 60 * 1000;
      volatility = 12.0;
      trend = 1.8;
    } else if (interval === "ALL") {
      pointsCount = 48;
      stepMs = 30 * 24 * 60 * 60 * 1000;
      volatility = 18.0;
      trend = 3.2;
    }

    const history: StockPoint[] = [];
    let startPrice = openPrice;
    if (interval === "1W") startPrice = 258.4;
    else if (interval === "1M") startPrice = 242.1;
    else if (interval === "1Y") startPrice = 168.3;
    else if (interval === "ALL") startPrice = 28.5;

    let rollingPrice = startPrice;
    const startTime = now - pointsCount * stepMs;

    for (let i = 0; i < pointsCount; i++) {
      const ptTime = startTime + i * stepMs;
      // Smooth sinusoidal walk with pseudo-random seed
      const seed = Math.sin(i * 0.75 + (interval.length * 3)) * volatility;
      const progress = i / pointsCount;
      const drift = (livePrice - startPrice) * progress;
      rollingPrice = Math.max(15, Number((startPrice + drift + seed).toFixed(2)));

      const d = new Date(ptTime);
      let timeLabel = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (interval === "1W" || interval === "1M") {
        timeLabel = d.toLocaleDateString([], { month: "short", day: "numeric" });
      } else if (interval === "1Y" || interval === "ALL") {
        timeLabel = d.toLocaleDateString([], { month: "short", year: "2-digit" });
      }

      history.push({
        time: timeLabel,
        timestamp: ptTime,
        price: rollingPrice,
        volume: Math.floor(180000 + Math.abs(Math.sin(i)) * 450000),
      });
    }

    // Ensure the very last point matches livePrice exactly
    history[history.length - 1] = {
      time: "Now",
      timestamp: now,
      price: livePrice,
      volume: 642000,
    };

    const prices = history.map((h) => h.price);
    const highPrice = Number(Math.max(...prices, livePrice).toFixed(2));
    const lowPrice = Number(Math.min(...prices, livePrice).toFixed(2));

    const quote: StockQuote = {
      symbol: "TSLAX",
      name: "TeslaX Circular Mobility & Energy Corp",
      currency: "USD",
      currentPrice: livePrice,
      change,
      changePercent,
      openPrice,
      highPrice,
      lowPrice,
      previousClose,
      marketCap: "$924.8B",
      volume24h: "46.8M",
      peRatio: 64.2,
      fiftyTwoWeekHigh: 299.8,
      fiftyTwoWeekLow: 138.8,
      lastUpdated: new Date(now).toLocaleTimeString(),
      interval,
      history,
    };

    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("Stock quote API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time stock quote", details: error?.message },
      { status: 500 }
    );
  }
}
