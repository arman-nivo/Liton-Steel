import { ImageResponse } from "next/og";
import { getPublished } from "@/lib/data";

export const alt = "Liton Steel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const site = await getPublished();
  const c = site.theme.colors;
  const name = locale === "bn" ? site.company.name.bn ?? site.company.name.en : site.company.name.en;
  const tag = locale === "bn" ? site.company.tagline.bn ?? site.company.tagline.en : site.company.tagline.en;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: c.ink, color: c.paper, display: "flex", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 420, height: 260, background: c.paper, clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 520, height: 200, background: c.gold, clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 80, width: 150, height: 250, background: c.gold, borderRadius: "0 0 999px 999px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 26 }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, border: `6px solid ${c.ink}`, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, paddingBottom: 18 }}>
            <div style={{ width: 12, height: 28, background: c.ink }} /><div style={{ width: 14, height: 44, background: c.ink }} /><div style={{ width: 12, height: 34, background: c.ink }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 90, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: c.gold, marginBottom: 18 }}>LITON STEEL • • •</div>
          <div style={{ fontSize: 84, fontWeight: 900, color: c.gold, lineHeight: 0.95, textTransform: "uppercase", maxWidth: 760 }}>{name}</div>
          <div style={{ fontSize: 28, marginTop: 22, opacity: 0.9 }}>{tag}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
