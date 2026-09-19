import type { Metadata } from "next";
import { getPublished } from "@/lib/data";
import { isLocale } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { JsonLd, PublicPage } from "@/components/site/PublicPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === "home") ?? site.pages[0];
  return { title: { absolute: t(page.props.title, l) || page.computed?.title || t(site.company.name, l) }, description: t(page.props.description, l) || page.computed?.description, openGraph: { title: t(page.props.title, l), description: t(page.props.description, l) } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === "home") ?? site.pages[0];
  return (<><JsonLd site={site} locale={l} /><PublicPage site={site} page={page} locale={l} /></>);
}
