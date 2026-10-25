"use client";

import React from "react";
import { useTeslaX } from "@/context/TeslaXContext";

export const Toast: React.FC = () => {
  const { toastMessage } = useTeslaX();

  return (
    <div
      id="toast"
      className={`toast ${toastMessage ? "show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {toastMessage}
    </div>
  );
};
