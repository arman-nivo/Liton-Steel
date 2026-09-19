"use client";
export type MotionLevel = "off" | "subtle" | "cinematic";

/** Decides how much motion a device should get. Honors reduced-motion, save-data and low-core devices. */
/** True when no scroll-driven motion should run (theme "off", reduced-motion, save-data). Safe to call in effects. */
export function isMotionOff(): boolean {
  if (typeof window === "undefined") return false;
  const theme = (getComputedStyle(document.documentElement).getPropertyValue("--motion").trim() || "cinematic") as MotionLevel;
  return motionLevel(theme) === "off";
}

export function motionLevel(theme: MotionLevel = "cinematic"): MotionLevel {
  if (typeof window === "undefined") return theme;
  if (theme === "off") return "off";
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "off";
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  if (nav.connection?.saveData) return "off";
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  if (cores <= 4 || mem <= 2 || /2g/.test(nav.connection?.effectiveType ?? "")) return "subtle";
  return theme;
}
