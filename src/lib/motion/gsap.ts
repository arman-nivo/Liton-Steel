"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;
export function g() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    try { CustomEase.create("apple", "0.22, 1, 0.36, 1"); } catch { /* already created */ }
    gsap.defaults({ ease: "apple", duration: 0.9 });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
export const APPLE_EASE = "apple";
