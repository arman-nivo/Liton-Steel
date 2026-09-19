import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished } from "@/lib/data";
import { isLocale, localePath, ui } from "@/lib/i18n";
import { t, uid } from "@/lib/utils";
import { PROJECT_CATEGORIES, type Page } from "@/lib/schema/types";
import { node } from "@/lib/content/templates";
import { PublicPage } from "@/components/site/PublicPage";
import { mediaMap } from "@/lib/content/media";
import { Icon } from "@/components/render/elements/icons";

export async function generateStaticParams() {
  const site = await getPublished();
  return site.collections.projects.flatMap((p) => [{ locale: "en", slug: p.slug }, { locale: "bn", slug: p.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const p = site.collections.projects.find((x) => x.slug === slug);
  if (!p) return {};
  const m = mediaMap(site).get(p.images[0]);
  return { title: t(p.title, l), description: t(p.caption, l).slice(0, 160), openGraph: { title: t(p.title, l), description: t(p.caption, l).slice(0, 160), images: m ? [{ url: m.src, width: m.width, height: m.height }] : undefined } };
}

export default async function ProjectDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = isLocale(locale) ? locale : "en";
  const site = await getPublished();
  const list = site.collections.projects;
  const idx = list.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const p = list[idx];
  const prev = list[(idx - 1 + list.length) % list.length], next = list[(idx + 1) % list.length];
  const cat = PROJECT_CATEGORIES.find((c) => c.id === p.category);
  const meta = [
    p.location ? [ui("location", l), t(p.location, l)] : null,
    p.year ? [ui("year", l), p.year] : null,
    p.client ? [ui("client", l), t(p.client, l)] : null,
    cat ? [ui("category", l), t(cat.label, l)] : null,
  ].filter(Boolean) as [string, string][];

  // Build the detail page from the same block system so it inherits shards, tab and motion presets.
  const page: Page = {
    id: `project-${p.id}`, type: "Page", props: { slug: `projects/${p.slug}`, title: p.title }, style: { base: {} },
    children: [
      node("Section", { preset: "project-detail", tone: "ink" }, { anchor: "project", style: { bg: "token:ink" }, children: [
        node("DecorShard", { corner: "tl", tone: "paper" }, { animation: { preset: "shard-slide" } }),
        node("BookmarkTab", { variant: "stub" }, { animation: { preset: "tab-drop" } }),
        node("BrandStamp", { text: site.company.shortName, position: "tr", dots: true }),
        node("Container", { width: "default" }, { style: { position: "relative", zIndex: 1, maxWidth: "var(--container)", margin: "0 auto", width: "100%", padding: ["calc(var(--tab-h) + 48px)", "clamp(20px, 5vw, 72px)", "clamp(72px, 10vh, 140px)", "clamp(20px, 5vw, 72px)"] }, mobile: { padding: ["calc(var(--tab-h) + 32px)", "20px", "64px", "20px"] }, children: [
          node("Grid", {}, { style: { display: "grid", columns: 2, gap: 8, alignItems: "end" }, tablet: { columns: 1 }, children: [
            node("Stack", {}, { style: { display: "flex", direction: "column", gap: 2 }, children: [
              node("Label", { text: cat?.label ?? { en: "Project" } }, { style: { alignSelf: "flex-start", size: "token:sm" }, animation: { preset: "fade-rise" } }),
              node("Heading", { text: p.title, level: 1 }, { style: { font: "token:display", size: "token:3xl", color: "token:gold", transform: "uppercase", lineHeight: 0.98 }, animation: { preset: "mask-reveal-text" } }),
            ] }),
            node("Text", { text: p.caption, justify: true }, { style: { font: "token:body", size: "token:base", color: "token:paper", lineHeight: 1.65, maxWidth: "64ch" }, animation: { preset: "fade-rise", delay: 0.1 } }),
          ] }),
          node("ImageCollage", { items: p.images.map((m) => ({ id: uid(), media: m })), layout: "auto", lightbox: true }, { style: { margin: [6, 0, 0, 0] }, animation: { preset: "parallax-depth", trigger: "scrub" } }),
        ] }),
      ] }),
    ],
  };

  return (
    <>
      <PublicPage site={site} page={page} locale={l} />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 clamp(20px, 5vw, 72px) 80px", display: "grid", gap: 24 }}>
        {meta.length ? (
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, margin: 0, padding: 24, borderRadius: "var(--radius-lg)", background: "rgba(255,255,255,.04)", border: "1px solid rgba(248,219,99,.18)" }}>
            {meta.map(([k, v]) => <div key={k}><dt style={{ fontFamily: "var(--font-label)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>{k}</dt><dd style={{ margin: "4px 0 0" }}>{v}</dd></div>)}
          </dl>
        ) : null}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }} aria-label="Project navigation">
          <Link className="ls-btn" data-variant="outline" href={localePath(l, `/projects/${prev.slug}`)}><Icon name="arrow-left" size={18} />{t(prev.title, l)}</Link>
          <Link className="ls-btn" data-variant="ghost" href={localePath(l, "/projects")}>{ui("backToProjects", l)}</Link>
          <Link className="ls-btn" data-variant="outline" href={localePath(l, `/projects/${next.slug}`)}>{t(next.title, l)}<Icon name="arrow-right" size={18} /></Link>
        </nav>
      </div>
    </>
  );
}
