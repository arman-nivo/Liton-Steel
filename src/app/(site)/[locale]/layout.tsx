import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { getPublished } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { SiteFrame } from "@/components/site/SiteFrame";

export const revalidate = 60;
export function generateStaticParams() { return [{ locale: "en" }, { locale: "bn" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getPublished();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const l = isLocale(locale) ? locale : "en";
  return {
    metadataBase: new URL(base),
    title: { default: t(site.company.name, l), template: `%s · ${t(site.company.shortName, l)}` },
    description: t(site.seo.defaultDescription, l),
    keywords: site.seo.keywords,
    alternates: { canonical: localePath(l, "/"), languages: { en: "/", bn: "/bn" } },
    openGraph: { type: "website", siteName: t(site.company.name, l), locale: l === "bn" ? "bn_BD" : "en_US" },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getPublished();
  return <SiteFrame site={site} locale={locale}>{children}</SiteFrame>;
}
