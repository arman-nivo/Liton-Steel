import type { Locale, MediaItem, Node, Project, Site } from "@/lib/schema/types";
import { cls } from "@/lib/schema/css";
import { cn } from "@/lib/utils";

export interface RenderCtx {
  locale: Locale;
  editable: boolean;
  media: Map<string, MediaItem>;
  projects: Project[];
  site: Site;
  /** stagger index for first-section entrance animations (computed by RenderPage) */
  animIndex?: Map<string, number>;
}

/** Common DOM attributes for every rendered node. */
export function attrs(node: Node, extra?: string, ctx?: RenderCtx) {
  const a: Record<string, any> = {
    "data-node-id": node.id,
    "data-type": node.type,
    className: cn(cls(node.id), node.className, extra),
  };
  if (node.anchor) a.id = node.anchor;
  if (node.animation && node.animation.preset !== "none") {
    a["data-anim"] = node.computed?.motionDowngrade ? "fade-rise" : node.animation.preset;
    const { preset: _p, ...opts } = node.animation;
    if (Object.keys(opts).length) a["data-anim-opts"] = JSON.stringify(opts);
  }
  const shape = node.style?.base?.shape;
  if (shape && shape !== "none") a["data-shape"] = shape;
  if (node.ariaLabel) a["aria-label"] = node.ariaLabel;
  const idx = ctx?.animIndex?.get(node.id);
  if (idx !== undefined) a.style = { "--i": idx } as React.CSSProperties;
  return a;
}

export function mediaOf(ctx: RenderCtx, id?: string): MediaItem | undefined {
  if (!id) return undefined;
  const m = ctx.media.get(id);
  if (m) return m;
  if (id.startsWith("/") || id.startsWith("http")) return { id, src: id, width: 1600, height: 1200, alt: "" };
  return undefined;
}
