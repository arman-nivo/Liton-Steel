import Link from "next/link";
import type { Locale, Site } from "@/lib/schema/types";
import { localePath, ui } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { LogoMark } from "../render/elements/media";

export function Footer({ site, locale }: { site: Site; locale: Locale }) {
  const c = site.company;
  return (
    <footer className="ls-footer">
      <div className="ls-shard" data-corner="br" data-tone="gold" style={{ opacity: 0.9 }} aria-hidden="true" />
      <div className="inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--gold)", fontFamily: "var(--font-display2)", fontWeight: 700, marginBottom: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gold)", color: "var(--ink)", display: "grid", placeItems: "center" }}><LogoMark style={{ width: "70%" }} /></span>
            {t(c.name, locale)}
          </div>
          <p style={{ margin: 0, fontSize: "var(--text-sm)", opacity: 0.8, maxWidth: "40ch" }}>{t(site.footer.about, locale)}</p>
        </div>
        {site.footer.columns.map((col) => (
          <div key={col.id}>
            <h2>{t(col.title, locale)}</h2>
            <ul>{col.links.map((l) => <li key={l.id}><Link href={localePath(locale, l.href)}>{t(l.label, locale)}</Link></li>)}</ul>
          </div>
        ))}
        <div>
          <h2>{ui("phone", locale)} / {ui("email", locale)}</h2>
          <ul>
            <li><a href={`tel:+${c.whatsapp}`}>{c.phone}</a></li>
            <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
            <li style={{ opacity: 0.8 }}>{t(c.address, locale)}</li>
            {site.settings.pdfUrl ? <li><a href={site.settings.pdfUrl} download>{ui("downloadProfile", locale)}</a></li> : null}
          </ul>
        </div>
      </div>
      <div className="bottom">
        <span>© {new Date().getFullYear()} {t(c.name, locale)}. {ui("rights", locale)}</span>
        <span>{t(site.footer.note, locale)}</span>
      </div>
    </footer>
  );
}
