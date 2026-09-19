import type { Metadata } from "next";
import { getPublished } from "@/lib/data";
import { isLocale, ui } from "@/lib/i18n";
import { t } from "@/lib/utils";
import { PublicPage } from "@/components/site/PublicPage";
import { projectsPage } from "@/lib/content/seed";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === "projects");
  return { title: page ? t(page.props.title, l) : ui("projectsTitle", l), description: page ? t(page.props.description, l) : undefined };
}

export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const page = site.pages.find((p) => p.props.slug === "projects") ?? projectsPage();
  return <PublicPage site={site} page={page} locale={l} />;
}
