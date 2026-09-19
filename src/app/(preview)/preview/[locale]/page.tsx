import { notFound } from "next/navigation";
import { getDraft } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { previewToken } from "@/lib/preview";
import { isLocale } from "@/lib/i18n";
import { PublicPage } from "@/components/site/PublicPage";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string; page?: string }> }) {
  const { locale } = await params;
  const { token, page: slug } = await searchParams;
  const l = isLocale(locale) ? locale : "en";
  const ok = (await getSession()) || (!!token && token === previewToken());
  if (!ok) notFound();
  const site = await getDraft();
  const page = site.pages.find((p) => p.props.slug === (slug || "home")) ?? site.pages[0];
  return <PublicPage site={site} page={page} locale={l} />;
}
