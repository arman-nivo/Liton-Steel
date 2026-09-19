"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motionLevel, type MotionLevel } from "./capability";

const SCRUB = new Set(["scale-hero", "parallax-depth", "magnetic-hover", "pin-and-scrub", "horizontal-gallery", "count-up"]);

/**
 * Mounted once per public page. GSAP + Lenis are loaded after hydration (never in the critical path),
 * and presets are applied lazily as elements approach the viewport. The first section animates with pure CSS
 * so the hero paints immediately.
 */
export function MotionRuntime({ theme }: { theme: MotionLevel }) {
  const pathname = usePathname();

  useEffect(() => {
    const level = motionLevel(theme);
    const html = document.documentElement;
    html.classList.add("js");
    html.classList.toggle("reduce-motion", level === "off");
    if (level === "off") return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ g }, lenisMod, { applyPreset }] = await Promise.all([import("./gsap"), import("./lenis"), import("./presets")]);
      if (cancelled) return;
      const { gsap, ScrollTrigger } = g();
      if (level === "cinematic" && window.matchMedia("(hover: hover)").matches) lenisMod.startLenis();
      const ctx = gsap.context(() => {});
      const first = document.querySelector(".ls-page > section:first-child");
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); ctx.add(() => applyPreset(e.target as HTMLElement, level)); }
      }, { rootMargin: "70% 0px 70% 0px" });
      document.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
        const preset = el.dataset.anim ?? "";
        if (first && first.contains(el) && !SCRUB.has(preset)) { el.dataset.animDone = "1"; return; } // CSS entrance already ran
        io.observe(el);
      });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = setTimeout(refresh, 900);
      if (location.hash) setTimeout(() => lenisMod.scrollToHash(location.hash), 300);
      cleanup = () => { clearTimeout(t); window.removeEventListener("load", refresh); io.disconnect(); ctx.revert(); lenisMod.stopLenis(); };
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, [pathname, theme]);

  // same-page anchor links → smooth scroll
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hashIdx = href.indexOf("#");
      if (hashIdx < 0) return;
      const path = href.slice(0, hashIdx).replace(/^\/bn/, "") || "/";
      const here = pathname.replace(/^\/bn/, "") || "/";
      if (path !== "/" && path !== here) return;
      if (here !== "/" && path === "/" && href.startsWith("/#")) return;
      const hash = href.slice(hashIdx);
      const el = hash.length > 1 ? document.querySelector(hash) : null;
      if (!el) return;
      e.preventDefault();
      import("./lenis").then((m) => m.scrollToHash(hash));
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
