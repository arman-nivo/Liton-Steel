import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { getDraft } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { SiteFrame } from "@/components/site/SiteFrame";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Draft preview" };

export default async function PreviewLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getDraft();
  const banner = <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 90, background: "var(--gold)", color: "var(--ink)", padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: ".06em" }}>DRAFT PREVIEW — not published</div>;
  return <SiteFrame site={site} locale={locale} banner={banner}>{children}</SiteFrame>;
}
