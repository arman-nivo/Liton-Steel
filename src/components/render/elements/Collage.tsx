"use client";
import { useState } from "react";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, mediaOf, type RenderCtx } from "../context";
import { MediaImage } from "./media";
import { Lightbox } from "@/components/site/Lightbox";

export function autoLayout(n: number): "hero" | "pair" | "trio" | "quad" | "masonry" {
  if (n <= 1) return "hero";
  if (n === 2) return "pair";
  if (n === 3) return "trio";
  if (n === 4) return "quad";
  return "masonry";
}

export function ImageCollage({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const items: { id: string; media: string; alt?: any }[] = node.props.items ?? [];
  const layout = node.props.layout && node.props.layout !== "auto" ? node.props.layout : node.computed?.layout ?? autoLayout(items.length);
  const [open, setOpen] = useState<number | null>(null);
  const a = attrs(node, "ls-collage", ctx);
  const lb = items.map((it) => { const m = mediaOf(ctx, it.media); return { src: m?.src ?? "", alt: t(it.alt, ctx.locale) || m?.alt }; });
  return (
    <>
      <div {...a} data-layout={layout}>
        {items.map((it, i) => (
          <figure key={it.id} className="ls-img" style={{ margin: 0, cursor: node.props.lightbox && !ctx.editable ? "zoom-in" : undefined }} onClick={() => { if (node.props.lightbox && !ctx.editable) setOpen(i); }}>
            <MediaImage ctx={ctx} media={it.media} alt={t(it.alt, ctx.locale) || undefined} sizes={layout === "hero" ? "(max-width: 767px) 100vw, 1200px" : "(max-width: 767px) 85vw, 600px"} />
          </figure>
        ))}
        {!items.length ? <div style={{ color: "var(--mute)", padding: 24 }}>Add images to this collage</div> : null}
      </div>
      {open !== null ? <Lightbox items={lb} index={open} onClose={() => setOpen(null)} onIndex={setOpen} /> : null}
    </>
  );
}
