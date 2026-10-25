"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getVehicleBySlug } from "@/data/vehicles";

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  memberId: string;
  isVerified: boolean;
  isVip: boolean;
}

export interface OrderInstalment {
  index: number;
  label: string;
  amount: number;
  status: "paid" | "due" | "scheduled";
  paidAt?: string;
}

export interface Order {
  id: string;
  slug: string;
  modelName: string;
  kind: "purchase" | "lease" | "hire" | "driving";
  kindLabel: string;
  totalAmount: number;
  paidAmount: number;
  status: "Pending Customer Care" | "Contacted" | "Awaiting payment" | "Active" | "Completed";
  preferredDate?: string;
  createdDate: string;
  instalmentsCount: number;
  instalmentsPaid: number;
  schedule: OrderInstalment[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferredContact?: string;
  customerNotes?: string;
  customerCareEmail?: string;
  customerCareStatus?: string;
  tradeIn?: { carName: string; creditAmount: number; valuationId?: string };
}

export interface WalletTransaction {
  id: string;
  type: "topup" | "payment" | "refund" | "credit";
  amount: number;
  method?: string;
  description: string;
  createdDate: string;
  status: "completed" | "pending";
}

export interface TradeInValuation {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  condition: string;
  targetSlug?: string;
  notes?: string;
  photos?: string;
  estimatedValue: number;
  createdDate: string;
}

interface TeslaXContextType {
  user: UserProfile | null;
  walletBalance: number;
  orders: Order[];
  transactions: WalletTransaction[];
  tradeIns: TradeInValuation[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  login: (email: string, details?: Partial<UserProfile>) => boolean;
  signup: (data: { fullName: string; email: string; phone: string; country: string }) => void;
  verifyCode: (code: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  createOrder: (data: {
    slug: string;
    kind: "purchase" | "lease" | "hire" | "driving";
    split?: number;
    months?: number;
    days?: number;
    packageType?: string;
    date?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    preferredContact?: string;
    notes?: string;
    tradeIn?: { carName: string; creditAmount: number; valuationId?: string };
  }) => Promise<string>;
  payInstalment: (orderId: string, method?: string) => boolean;
  topUpWallet: (amount: number, method: string) => string;
  activateVip: () => void;
  submitTradeIn: (data: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuel: string;
    condition: string;
    targetSlug?: string;
    notes?: string;
    photos?: string;
  }) => TradeInValuation;
}

const TeslaXContext = createContext<TeslaXContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  fullName: "Ada Okafor",
  email: "ada@example.com",
  phone: "+1 555 000 1234",
  country: "United States",
  memberId: "TXJJVZ4",
  isVerified: true,
  isVip: false,
};

const INITIAL_ORDER: Order = {
  id: "TX-N32QX3",
  slug: "model-3",
  modelName: "Model 3",
  kind: "purchase",
  kindLabel: "Purchase",
  totalAmount: 2900,
  paidAmount: 725,
  status: "Active",
  preferredDate: "2026-11-01",
  createdDate: "Oct 24, 2026",
  instalmentsCount: 4,
  instalmentsPaid: 1,
  customerName: "Ada Okafor",
  customerEmail: "ada@example.com",
  customerPhone: "+1 555 000 1234",
  preferredContact: "email",
  customerCareEmail: "support@teslax.io",
  customerCareStatus: "Order details sent to Customer Care",
  schedule: [
    { index: 1, label: "01", amount: 725, status: "paid", paidAt: "Oct 24, 2026" },
    { index: 2, label: "02", amount: 725, status: "due" },
    { index: 3, label: "03", amount: 725, status: "scheduled" },
    { index: 4, label: "04", amount: 725, status: "scheduled" },
  ],
};

export const TeslaXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [walletBalance, setWalletBalance] = useState<number>(1000);
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: "TOP-GCC7FZ",
      type: "topup",
      amount: 1000,
      method: "card",
      description: "Wallet top-up (Card)",
      createdDate: "Oct 24, 2026",
      status: "completed",
    },
    {
      id: "PAY-N32QX3-1",
      type: "payment",
      amount: 725,
      method: "wallet",
      description: "Model 3 — Instalment 1 of 4",
      createdDate: "Oct 24, 2026",
      status: "completed",
    },
  ]);
  const [tradeIns, setTradeIns] = useState<TradeInValuation[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("tx_user");
      const savedBal = localStorage.getItem("tx_wallet");
      const savedOrders = localStorage.getItem("tx_orders");
      const savedTx = localStorage.getItem("tx_transactions");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedBal !== null) setWalletBalance(Number(savedBal));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedTx) setTransactions(JSON.parse(savedTx));
    } catch {
      // ignore
    }
  }, []);

  const saveState = (
    u: UserProfile | null,
    bal: number,
    ords: Order[],
    txs: WalletTransaction[]
  ) => {
    try {
      if (u) localStorage.setItem("tx_user", JSON.stringify(u));
      else localStorage.removeItem("tx_user");
      localStorage.setItem("tx_wallet", bal.toString());
      localStorage.setItem("tx_orders", JSON.stringify(ords));
      localStorage.setItem("tx_transactions", JSON.stringify(txs));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

  const login = (email: string, details?: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      fullName: details?.fullName || email.split("@")[0] || "TeslaX Member",
      email: email,
      phone: details?.phone || "+1 555 000 1234",
      country: details?.country || "United States",
      memberId: details?.memberId || "TX" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      isVerified: true,
      isVip: details?.isVip || false,
    };
    setUser(newUser);
    saveState(newUser, walletBalance, orders, transactions);
    showToast(`Welcome back, ${newUser.fullName}`);

    // Trigger confirmation email to client + new sign-in alert email to admin
    fetch("/api/auth/notify-signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newUser.email,
        fullName: newUser.fullName,
        memberId: newUser.memberId,
        phone: newUser.phone,
        country: newUser.country,
        isNewRegistration: false,
      }),
    }).catch((err) => {
      console.warn("Failed to dispatch sign-in notification:", err);
    });

    return true;
  };

  const signup = (data: { fullName: string; email: string; phone: string; country: string }) => {
    const pendingUser: UserProfile = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      country: data.country || "United States",
      memberId: "TX" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      isVerified: false,
      isVip: false,
    };
    setUser(pendingUser);
    saveState(pendingUser, walletBalance, orders, transactions);
  };

  const verifyCode = (code: string) => {
    if (code.length === 6) {
      if (user) {
        const verifiedUser: UserProfile = { ...user, isVerified: true };
        setUser(verifiedUser);
        saveState(verifiedUser, walletBalance, orders, transactions);
        showToast("Membership activated. Welcome to TeslaX.");

        // Trigger welcome confirmation email to client + new user alert email to admin
        fetch("/api/auth/notify-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: verifiedUser.email,
            fullName: verifiedUser.fullName,
            memberId: verifiedUser.memberId,
            phone: verifiedUser.phone,
            country: verifiedUser.country,
            isNewRegistration: true,
          }),
        }).catch((err) => {
          console.warn("Failed to dispatch new user registration notification:", err);
        });

        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    saveState(null, walletBalance, orders, transactions);
    showToast("Logged out successfully");
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    saveState(updated, walletBalance, orders, transactions);
    showToast("Profile updated");
  };

  const createOrder = async (data: {
    slug: string;
    kind: "purchase" | "lease" | "hire" | "driving";
    split?: number;
    months?: number;
    days?: number;
    packageType?: string;
    date?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    preferredContact?: string;
    notes?: string;
    tradeIn?: { carName: string; creditAmount: number; valuationId?: string };
  }): Promise<string> => {
    const vehicle = getVehicleBySlug(data.slug);
    if (!vehicle) return "";

    const id = "TX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    let total = vehicle.memberPrice;
    let instalmentsCount = data.split || 4;
    let kindLabel = "Purchase";

    if (data.kind === "lease") {
      const months = data.months || 6;
      total = vehicle.leaseMonthly * months;
      instalmentsCount = months;
      kindLabel = `Lease (${months} mo)`;
    } else if (data.kind === "hire") {
      const days = data.days || 3;
      total = vehicle.hireDaily * days;
      instalmentsCount = 1;
      kindLabel = `Hire (${days} days)`;
    } else if (data.kind === "driving") {
      const rates: Record<string, number> = { express: 99, extended: 179, halfday: 299, fullday: 499 };
      total = rates[data.packageType || "express"] || 99;
      instalmentsCount = 1;
      kindLabel = "Self-driving session";
    }

    // Apply trade-in offset if present
    if (data.tradeIn?.creditAmount) {
      total = Math.max(0, total - data.tradeIn.creditAmount);
    }

    const eachAmount = Math.ceil(total / instalmentsCount);
    const schedule: OrderInstalment[] = [];
    for (let i = 1; i <= instalmentsCount; i++) {
      schedule.push({
        index: i,
        label: i < 10 ? `0${i}` : `${i}`,
        amount: eachAmount,
        status: i === 1 ? "due" : "scheduled",
      });
    }

    const customerEmail = data.customerEmail || user?.email || "guest@example.com";
    const customerName = data.customerName || user?.fullName || "Guest Buyer";
    const customerPhone = data.customerPhone || user?.phone || "";
    const preferredContact = data.preferredContact || "email";
    const customerCareEmail = "support@teslax.io";

    const newOrder: Order = {
      id,
      slug: data.slug,
      modelName: vehicle.name,
      kind: data.kind,
      kindLabel,
      totalAmount: total,
      paidAmount: 0,
      status: "Pending Customer Care",
      preferredDate: data.date || new Date().toISOString().split("T")[0],
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      instalmentsCount,
      instalmentsPaid: 0,
      customerName,
      customerEmail,
      customerPhone,
      preferredContact,
      customerNotes: data.notes,
      customerCareEmail,
      customerCareStatus: "Cart details dispatched to Customer Care",
      tradeIn: data.tradeIn,
      schedule,
    };

    // Dispatch cart to Customer Care email endpoint
    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            preferredContact,
            notes: data.notes,
          },
          cart: {
            slug: data.slug,
            modelName: vehicle.name,
            kind: data.kind,
            kindLabel,
            totalAmount: total,
            instalmentsCount,
            instalmentAmount: eachAmount,
            leaseMonths: data.months,
            hireDays: data.days,
            packageType: data.packageType,
            preferredDate: newOrder.preferredDate,
            tradeIn: data.tradeIn,
          },
        }),
      });
    } catch (err) {
      console.warn("Could not call /api/checkout:", err);
    }

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    saveState(user, walletBalance, newOrders, transactions);
    showToast(`Cart sent to Customer Care! Ref: ${id}`);
    return id;
  };

  const payInstalment = (orderId: string, method: string = "wallet") => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    const order = { ...orders[orderIndex] };
    const nextDueIdx = order.schedule.findIndex((s) => s.status === "due");
    if (nextDueIdx === -1) return false;

    const instalment = order.schedule[nextDueIdx];
    const amount = instalment.amount;

    if (method === "wallet" && walletBalance < amount) {
      showToast(`Wallet balance short by $${(amount - walletBalance).toLocaleString()}`);
      return false;
    }

    let newBal = walletBalance;
    if (method === "wallet") {
      newBal = walletBalance - amount;
      setWalletBalance(newBal);
    }

    order.schedule[nextDueIdx] = {
      ...instalment,
      status: "paid",
      paidAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    if (nextDueIdx + 1 < order.schedule.length) {
      order.schedule[nextDueIdx + 1].status = "due";
    }

    order.paidAmount += amount;
    order.instalmentsPaid += 1;
    if (order.paidAmount >= order.totalAmount) {
      order.status = "Completed";
    } else {
      order.status = "Active";
    }

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = order;
    setOrders(updatedOrders);

    const newTx: WalletTransaction = {
      id: "PAY-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      type: "payment",
      amount,
      method,
      description: `${order.modelName} — Instalment ${instalment.index} of ${order.instalmentsCount}`,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "completed",
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);

    saveState(user, newBal, updatedOrders, updatedTxs);
    showToast(`Paid $${amount.toLocaleString()} for ${order.modelName}`);
    return true;
  };

  const topUpWallet = (amount: number, method: string) => {
    const id = "TOP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBal = walletBalance + amount;
    setWalletBalance(newBal);

    const newTx: WalletTransaction = {
      id,
      type: "topup",
      amount,
      method,
      description: `Wallet top-up (${method})`,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "completed",
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);

    saveState(user, newBal, orders, updatedTxs);
    showToast(`Top-up of $${amount.toLocaleString()} credited to wallet`);
    return id;
  };

  const activateVip = () => {
    if (!user) return;
    const updated = { ...user, isVip: true };
    setUser(updated);
    saveState(updated, walletBalance, orders, transactions);
    showToast("VIP membership activated! Welcome to priority allocation.");
  };

  const submitTradeIn = (data: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuel: string;
    condition: string;
    targetSlug?: string;
    notes?: string;
    photos?: string;
  }) => {
    const base = Math.max(1200, 32000 - (2026 - data.year) * 2200 - (data.mileage / 10000) * 800);
    const condMult = data.condition === "excellent" ? 1.2 : data.condition === "good" ? 1.0 : data.condition === "fair" ? 0.8 : 0.6;
    const estimatedValue = Math.round((base * condMult) / 100) * 100;

    const val: TradeInValuation = {
      id: "VAL-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...data,
      estimatedValue,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setTradeIns([val, ...tradeIns]);
    showToast(`Valuation calculated: $${estimatedValue.toLocaleString()} credit`);
    return val;
  };

  return (
    <TeslaXContext.Provider
      value={{
        user,
        walletBalance,
        orders,
        transactions,
        tradeIns,
        toastMessage,
        showToast,
        login,
        signup,
        verifyCode,
        logout,
        updateProfile,
        createOrder,
        payInstalment,
        topUpWallet,
        activateVip,
        submitTradeIn,
      }}
    >
      {children}
    </TeslaXContext.Provider>
  );
};

export const useTeslaX = () => {
  const context = useContext(TeslaXContext);
  if (!context) throw new Error("useTeslaX must be used within a TeslaXProvider");
  return context;
};
