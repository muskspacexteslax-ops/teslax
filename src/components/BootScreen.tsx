"use client";

import React, { useEffect, useState } from "react";

export const BootScreen: React.FC = () => {
  const [gone, setGone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = isReduced ? 150 : 1800;

    const timer = setTimeout(() => {
      setGone(true);
      document.body.classList.remove("is-locked");
      document.documentElement.classList.add("booted");

      const removeTimer = setTimeout(() => {
        setRemoved(true);
      }, 800);

      return () => clearTimeout(removeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div id="boot" className={gone ? "gone" : ""} aria-hidden="true">
      <div className="boot-inner">
        <svg className="boot-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 31.5C28.5 15.5 71.5 15.5 90 31.5L82 42.5C66.5 30.8 33.5 30.8 18 42.5Z"></path>
          <path d="M49.4 45.5 57.2 45.5 55.1 89.5C55 91.6 53.6 91.6 53.4 89.5Z"></path>
        </svg>
        <div className="boot-word">TeslaX</div>
        <div className="boot-bar">
          <i></i>
        </div>
      </div>
    </div>
  );
};
