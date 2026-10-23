import type { Locale, Page, Site } from "@/lib/schema/types";
import { mediaMap } from "@/lib/content/media";
import { RenderPage } from "../render/RenderNode";
import type { EditorUI, RenderCtx } from "../render/context";

export function ctxFor(site: Site, locale: Locale, editable = false, ui?: EditorUI): RenderCtx {
  return { locale, editable, media: mediaMap(site), projects: site.collections.projects, site, ui };
}

export function PublicPage({ site, page, locale }: { site: Site; page: Page; locale: Locale }) {
  return <RenderPage page={page} ctx={ctxFor(site, locale)} />;
}

export function JsonLd({ site, locale }: { site: Site; locale: Locale }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const c = site.company;
  const name = locale === "bn" ? c.name.bn || c.name.en : c.name.en;
  // Single object with @graph: valid JSON-LD that every parser (search engines and browser extensions) accepts.
  const address = { "@type": "PostalAddress", streetAddress: "Dadapur Road, Mojompur", addressLocality: "Kushtia", addressCountry: "BD" };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${base}/#organization`, name, url: base, logo: `${base}/icon.svg`, telephone: c.phone, email: c.email, foundingDate: String(c.founded), address },
      { "@type": "LocalBusiness", "@id": `${base}/#business`, name, url: base, telephone: c.phone, email: c.email, image: `${base}/opengraph-image`, address, areaServed: "Bangladesh", priceRange: "$$" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
