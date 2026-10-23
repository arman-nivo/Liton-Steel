"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/schema/types";
import { ui } from "@/lib/i18n";
import { Icon } from "../render/elements/icons";

export function WhatsAppButton({ number, locale }: { number: string; locale: Locale }) {
  return <a className="ls-wa" href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" aria-label={ui("whatsapp", locale)}><Icon name="whatsapp" size={28} /></a>;
}

export function CookieNotice({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (enabled && !localStorage.getItem("ls-cookie")) setShow(true); } catch { /* ignore */ } }, [enabled]);
  if (!show) return null;
  const choose = (v: string) => { try { localStorage.setItem("ls-cookie", v); } catch { /* ignore */ } setShow(false); if (v === "accept") window.dispatchEvent(new Event("ls-analytics-consent")); };
  return (
    <div className="ls-cookie" role="dialog" aria-live="polite">
      <span>{ui("cookieText", locale)}</span>
      <div className="actions">
        <button style={{ background: "var(--ink)", color: "var(--gold)" }} onClick={() => choose("accept")}>{ui("accept", locale)}</button>
        <button style={{ background: "#eee" }} onClick={() => choose("decline")}>{ui("decline", locale)}</button>
      </div>
    </div>
  );
}

export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsent] = useState(false);
  useEffect(() => {
    try { setConsent(localStorage.getItem("ls-cookie") === "accept"); } catch { /* ignore */ }
    const on = () => setConsent(true);
    window.addEventListener("ls-analytics-consent", on);
    return () => window.removeEventListener("ls-analytics-consent", on);
  }, []);
  return (
    <>
      {plausible ? <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" /> : null}
      {ga && consent ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script>
        </>
      ) : null}
    </>
  );
}

/** Gold shard wipe between routes (≤600ms). Intercepts internal link clicks. */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const wipe = document.querySelector<HTMLElement>(".ls-wipe");
    if (!wipe) return;
    const reduce = document.documentElement.classList.contains("reduce-motion");
    const withGsap = (fn: (gsap: typeof import("gsap").gsap) => void) => import("@/lib/motion/gsap").then(({ g }) => fn(g().gsap));
    // reveal on arrival
    if (wipe.dataset.covering === "1") {
      wipe.dataset.covering = "";
      withGsap((gsap) => gsap.to(wipe, { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", duration: reduce ? 0.01 : 0.55, ease: "power3.inOut", onComplete: () => gsap.set(wipe, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }) }));
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("/api") || href.startsWith("/edit") || href.startsWith("/admin")) return;
      const url = new URL(href, location.origin);
      if (url.pathname === location.pathname) return; // hash / same page
      e.preventDefault();
      router.prefetch(href); // start loading the next page while the wipe plays (links don't prefetch in the viewport)
      if (reduce) { router.push(href); return; }
      wipe.dataset.covering = "1";
      withGsap((gsap) => gsap.fromTo(wipe, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.5, ease: "power3.inOut", onComplete: () => router.push(href) }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, router]);
  return <div className="ls-wipe" aria-hidden="true" />;
}
