"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale, NavItem } from "@/lib/schema/types";
import { localePath, ui } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { LogoMark } from "../render/elements/media";
import { Icon } from "../render/elements/icons";

export function Nav({ items, locale, brand, pdfUrl }: { items: NavItem[]; locale: Locale; brand: string; pdfUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const pathname = usePathname();
  const bare = pathname.replace(/^\/bn(?=\/|$)/, "") || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) setActive(`#${vis.target.id}`);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; return () => { document.documentElement.style.overflow = ""; }; }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);
  // The home hero carries the gold logo tab, so the nav stays transparent there; every other page gets the dark glass bar from the first paint.
  const hasTab = bare === "/";

  const href = (h: string) => localePath(locale, h);
  const isActive = (h: string) => h.includes("#") ? active === h.slice(h.indexOf("#")) : bare === h;

  return (
    <>
      <header className="ls-nav" data-scrolled={scrolled || open || !hasTab ? "true" : "false"} data-tab={hasTab ? "true" : "false"}>
        <div className="inner">
          <Link href={localePath(locale, "/")} className="brand" aria-label={brand}>
            <span className="mark"><LogoMark /></span>
            <span>{brand}</span>
          </Link>
          <nav className="links" aria-label="Primary">
            {items.slice(0, 7).map((it) => <Link key={it.id} href={href(it.href)} aria-current={isActive(it.href) ? "true" : undefined}>{t(it.label, locale)}</Link>)}
          </nav>
          <div className="tools">
            <LanguageToggle locale={locale} path={bare} />
            <button className="burger" aria-label={ui("menu", locale)} aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" size={20} /></button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="ls-menu" role="dialog" aria-modal="true" aria-label={ui("menu", locale)}>
          <div className="head">
            <span className="ls-nav" style={{ position: "static" }}><span className="brand"><span className="mark"><LogoMark /></span>{brand}</span></span>
            <button className="burger" style={{ display: "grid" }} aria-label={ui("close", locale)} onClick={() => setOpen(false)}><Icon name="x" size={20} /></button>
          </div>
          <div>
            <div className="title">{ui("contents", locale)}</div>
            <ol>
              {items.map((it, i) => (
                <li key={it.id}><Link href={href(it.href)} onClick={() => setOpen(false)}><span>{t(it.label, locale)}</span><b>{String(i + 1).padStart(2, "0")}</b></Link></li>
              ))}
              {pdfUrl ? <li><a href={pdfUrl} download><span>{ui("downloadProfile", locale)}</span><b><Icon name="download" size={14} /></b></a></li> : null}
            </ol>
            <div style={{ marginTop: 24 }}><LanguageToggle locale={locale} path={bare} /></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function LanguageToggle({ locale, path }: { locale: Locale; path: string }) {
  // No viewport prefetch: the toggle is on screen on every page, and prefetching would download the whole
  // other-language page (~40 KB) for every visitor, though few switch.
  return (
    <div className="ls-lang" role="group" aria-label="Language">
      <Link href={localePath("en", path)} prefetch={false} aria-current={locale === "en" ? "true" : undefined} hrefLang="en">EN</Link>
      <Link href={localePath("bn", path)} prefetch={false} aria-current={locale === "bn" ? "true" : undefined} hrefLang="bn" lang="bn">বাং</Link>
    </div>
  );
}
