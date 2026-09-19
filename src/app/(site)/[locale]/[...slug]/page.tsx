import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublished } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { PublicPage } from "@/components/site/PublicPage";

const RESERVED = new Set(["home", "projects"]);

export async function generateStaticParams() {
  const site = await getPublished();
  return site.pages.filter((p) => !RESERVED.has(p.props.slug)).flatMap((p) => [{ locale: "en", slug: p.props.slug.split("/") }, { locale: "bn", slug: p.props.slug.split("/") }]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === slug.join("/"));
  if (!page) return {};
  return { title: t(page.props.title, l) || page.computed?.title, description: t(page.props.description, l) || page.computed?.description, robots: page.props.noindex ? { index: false } : undefined };
}

export default async function CustomPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === slug.join("/") && !RESERVED.has(p.props.slug));
  if (!page) notFound();
  return <PublicPage site={site} page={page} locale={l} />;
}
