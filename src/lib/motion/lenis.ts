"use client";
import Lenis from "lenis";
import { g } from "./gsap";

let lenis: Lenis | null = null;

export function startLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  const { gsap, ScrollTrigger } = g();
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add("lenis");
  (lenis as Lenis & { _tick?: (t: number) => void })._tick = tick;
  return lenis;
}

export function stopLenis() {
  if (!lenis) return;
  const { gsap } = g();
  const tick = (lenis as Lenis & { _tick?: (t: number) => void })._tick;
  if (tick) gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  document.documentElement.classList.remove("lenis");
}

export function getLenis() { return lenis; }

export function scrollToHash(hash: string, offset = -72) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
  else (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
