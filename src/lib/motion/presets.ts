"use client";
import { g } from "./gsap";
import type { MotionLevel } from "./capability";

export interface AnimOpts { trigger?: "load" | "enter" | "scrub" | "hover"; delay?: number; duration?: number; ease?: string; stagger?: number; intensity?: number }

const readOpts = (el: HTMLElement): AnimOpts => { try { return JSON.parse(el.dataset.animOpts || "{}"); } catch { return {}; } };

function splitLines(el: HTMLElement) {
  if (el.dataset.split === "lines") return Array.from(el.querySelectorAll<HTMLElement>(".ls-mask-line > span"));
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = parts.map((p) => `<span class="ls-mask-line"><span>${p.trim() || "&nbsp;"}</span></span>`).join("<br>");
  el.dataset.split = "lines";
  return Array.from(el.querySelectorAll<HTMLElement>(".ls-mask-line > span"));
}

function splitChars(el: HTMLElement) {
  if (el.dataset.split === "chars") return Array.from(el.querySelectorAll<HTMLElement>(".ls-ch"));
  const bangla = (el.closest("[lang]") as HTMLElement | null)?.lang === "bn";
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  for (const tn of texts) {
    if (!tn.textContent?.trim()) continue;
    const frag = document.createDocumentFragment();
    const units = bangla ? tn.textContent.split(/(\s+)/) : Array.from(tn.textContent);
    for (const u of units) {
      if (!u) continue;
      if (/^\s+$/.test(u)) { frag.appendChild(document.createTextNode(u)); continue; }
      const s = document.createElement("span");
      s.className = "ls-ch"; s.style.display = "inline-block"; s.style.whiteSpace = "pre"; s.textContent = u;
      frag.appendChild(s);
    }
    tn.replaceWith(frag);
  }
  el.dataset.split = "chars";
  return Array.from(el.querySelectorAll<HTMLElement>(".ls-ch"));
}

/** Applies a generic preset to an element. Component-owned presets (pin-and-scrub, count-up, horizontal-gallery) are ignored here. */
export function applyPreset(el: HTMLElement, level: MotionLevel): void {
  const { gsap } = g();
  const preset = el.dataset.anim;
  if (!preset || preset === "none" || el.dataset.animDone) return;
  const o = readOpts(el);
  const subtle = level === "subtle";
  const dur = (o.duration ?? 0.9) * (subtle ? 0.7 : 1);
  const delay = subtle ? 0 : o.delay ?? 0;
  const onLoad = o.trigger === "load";
  const st = (extra: Record<string, unknown> = {}) => (onLoad ? undefined : { trigger: el, start: "top 88%", once: true, ...extra });
  const mark = () => el.classList.add("is-in");
  el.dataset.animDone = "1";

  switch (preset) {
    case "fade-rise": {
      mark();
      gsap.fromTo(el, { autoAlpha: 0, y: subtle ? 14 : 40 }, { autoAlpha: 1, y: 0, duration: dur, delay, scrollTrigger: st() });
      return;
    }
    case "mask-reveal-text": {
      const lines = subtle ? [] : splitLines(el);
      mark();
      if (!lines.length) { gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: dur, delay, scrollTrigger: st() }); return; }
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: dur, delay, stagger: 0.12, scrollTrigger: st() });
      return;
    }
    case "split-chars": {
      const chars = subtle ? [] : splitChars(el);
      mark();
      if (!chars.length) { gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: dur, delay, scrollTrigger: st() }); return; }
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(chars, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: dur * 0.9, delay, stagger: Math.min(0.05, o.stagger ?? 0.03), scrollTrigger: st({ start: "top 92%" }) });
      return;
    }
    case "shard-slide": {
      const c = el.dataset.corner ?? "tl";
      const d = subtle ? 30 : 90;
      const from = { x: c.endsWith("l") ? -d : d, y: c.startsWith("t") ? -d : d, autoAlpha: 0 };
      mark();
      gsap.fromTo(el, from, { x: 0, y: 0, autoAlpha: 1, duration: dur * 1.2, delay, scrollTrigger: st({ start: "top 95%" }) });
      return;
    }
    case "tab-drop": {
      mark();
      const logo = el.querySelector("svg");
      gsap.fromTo(el, { yPercent: -110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: dur * 1.1, delay, ease: subtle ? "apple" : "back.out(1.3)", scrollTrigger: st({ start: "top 95%" }) });
      if (logo && !subtle) gsap.fromTo(logo, { rotate: -24, transformOrigin: "50% 50%" }, { rotate: 0, duration: dur * 1.3, delay: delay + 0.15, ease: "back.out(1.6)", scrollTrigger: st({ start: "top 95%" }) });
      return;
    }
    case "image-clip-expand": {
      mark();
      const shaped = !!el.dataset.shape && el.dataset.shape !== "rounded";
      const img = el.querySelector("img");
      if (subtle || shaped) { gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: dur, delay, scrollTrigger: st() }); return; }
      gsap.fromTo(el, { autoAlpha: 0, clipPath: "inset(10% 10% 10% 10% round 999px)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: dur * 1.3, delay, scrollTrigger: st(), onComplete: () => { el.style.clipPath = ""; } });
      if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: dur * 1.6, delay, scrollTrigger: st() });
      return;
    }
    case "parallax-depth": {
      mark();
      gsap.set(el, { autoAlpha: 1 });
      if (subtle) return;
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((k, i) => {
        const depth = ((i % 3) - 1) * 6 + 6;
        gsap.fromTo(k, { yPercent: depth }, { yPercent: -depth, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      return;
    }
    case "scale-hero": {
      mark();
      const holder = el.closest("section") ?? el;
      gsap.set(el, { autoAlpha: 1 });
      if (subtle) { gsap.set(el, { filter: "grayscale(1)" }); return; }
      // on tablets/phones a background photo is shown whole (see .ls-bg in globals.css); zooming it would crop it again
      const whole = el.classList.contains("ls-bg") && window.innerWidth < 1200;
      gsap.fromTo(el, { scale: whole ? 1 : 1.15, filter: "grayscale(0) contrast(1)" }, { scale: 1, filter: "grayscale(1) contrast(1.08)", ease: "none", scrollTrigger: { trigger: holder, start: "top top", end: "bottom top", scrub: 0.8 } });
      return;
    }
    case "magnetic-hover": {
      mark();
      gsap.set(el, { autoAlpha: 1 });
      if (subtle || !window.matchMedia("(hover: hover)").matches) return;
      const strength = Math.min(1, o.intensity ?? 0.6);
      const isCard = el.classList.contains("card") || el.dataset.type === "ImageCollage";
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        gsap.to(el, { x: dx * 8 * strength, y: dy * 8 * strength, rotateY: isCard ? dx * 3 : 0, rotateX: isCard ? -dy * 3 : 0, transformPerspective: 800, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return;
    }
    default:
      // component-owned presets keep their own logic; just make sure the element is visible
      mark();
      return;
  }
}
