import type { Box, MediaItem, Node, Page, StyleProps, Theme } from "./types";

export const TABLET_MAX = 1199;
export const MOBILE_MAX = 767;

export const cls = (id: string) => `n_${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

const tok = (v: string) => (v.startsWith("token:") ? v.slice(6) : null);

export function resolveColor(v?: string): string | undefined {
  if (!v) return undefined;
  const t = tok(v);
  if (t) return t === "goldSoft" ? "var(--gold-soft)" : `var(--${t})`;
  return v;
}
export function resolveFont(v?: string): string | undefined {
  if (!v) return undefined;
  const t = tok(v);
  return t ? `var(--font-${t})` : v;
}
export function resolveSize(v?: string | number): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "number") return `${v}px`;
  const t = tok(v);
  return t ? `var(--text-${t})` : v;
}
export function resolveRadius(v?: string): string | undefined {
  if (!v) return undefined;
  const t = tok(v);
  return t ? `var(--radius-${t})` : v;
}
export function resolveSpace(v?: number | string): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "number") return v === 0 ? "0" : `calc(var(--space) * ${v})`;
  return v;
}
function resolveBox(b?: Box): string | undefined {
  if (b === undefined || b === null || b === "") return undefined;
  if (Array.isArray(b)) return b.map((x) => resolveSpace(x) ?? "0").join(" ");
  return resolveSpace(b);
}

const SHAPES: Record<string, string> = {
  rounded: "border-radius:var(--radius-lg);overflow:hidden;",
  arch: "border-radius:999px 999px 0 0;overflow:hidden;",
  pill: "border-radius:999px;overflow:hidden;",
  circle: "border-radius:50%;aspect-ratio:1;overflow:hidden;",
  "shard-tl": "clip-path:polygon(0 var(--shard-pct),100% 0,100% 100%,0 100%);",
  "shard-tr": "clip-path:polygon(0 0,100% var(--shard-pct),100% 100%,0 100%);",
  "shard-bl": "clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--shard-pct)));",
  "shard-br": "clip-path:polygon(0 0,100% 0,100% calc(100% - var(--shard-pct)),0 100%);",
};
const FILTERS: Record<string, string> = {
  bw: "filter:grayscale(1) contrast(1.08);",
  duotone: "filter:grayscale(1) sepia(.55) saturate(3.2) hue-rotate(5deg) contrast(1.05);",
  none: "filter:none;",
};

export function styleToDecls(s: StyleProps | undefined, media?: Map<string, MediaItem>): string {
  if (!s) return "";
  const d: string[] = [];
  const put = (k: string, v?: string | number) => { if (v !== undefined && v !== null && v !== "") d.push(`${k}:${v};`); };
  put("font-family", resolveFont(s.font));
  put("font-size", resolveSize(s.size));
  put("font-weight", s.weight);
  put("letter-spacing", s.letterSpacing);
  put("line-height", s.lineHeight);
  put("text-transform", s.transform);
  put("text-align", s.align);
  if (s.italic !== undefined) put("font-style", s.italic ? "italic" : "normal");
  if (s.maxLines) d.push(`display:-webkit-box;-webkit-line-clamp:${s.maxLines};-webkit-box-orient:vertical;overflow:hidden;`);
  put("color", resolveColor(s.color));
  put("opacity", s.opacity);
  const bgImg: string[] = [];
  if (s.bgOverlay) bgImg.push(s.bgOverlay.includes("gradient") ? s.bgOverlay : `linear-gradient(${s.bgOverlay},${s.bgOverlay})`);
  if (s.bgMedia) {
    const m = media?.get(s.bgMedia);
    const src = m?.src ?? (s.bgMedia.startsWith("/") || s.bgMedia.startsWith("http") ? s.bgMedia : undefined);
    if (src) bgImg.push(`url("${src}")`);
  }
  if (bgImg.length) { put("background-image", bgImg.join(",")); put("background-size", s.bgSize ?? "cover"); put("background-position", s.bgPosition ?? "center"); }
  put("background-color", resolveColor(s.bg));
  put("border-radius", resolveRadius(s.radius));
  put("border", s.border);
  put("box-shadow", s.shadow);
  if (s.shape && SHAPES[s.shape]) d.push(SHAPES[s.shape]);
  if (s.filter && FILTERS[s.filter]) d.push(FILTERS[s.filter]);
  put("display", s.display);
  put("flex-direction", s.direction);
  if (s.wrap !== undefined) put("flex-wrap", s.wrap ? "wrap" : "nowrap");
  if (s.columns) put("grid-template-columns", `repeat(${s.columns}, minmax(0, 1fr))`);
  put("grid-template-columns", s.columnsTemplate);
  put("gap", resolveSpace(s.gap));
  put("row-gap", resolveSpace(s.rowGap));
  put("padding", resolveBox(s.padding));
  put("margin", resolveBox(s.margin));
  put("align-items", s.alignItems);
  put("justify-content", s.justifyContent);
  put("align-self", s.alignSelf);
  put("justify-self", s.justifySelf);
  put("width", s.width);
  put("height", s.height);
  put("min-height", s.minHeight);
  put("max-height", s.maxHeight);
  put("min-width", s.minWidth);
  put("max-width", s.maxWidth);
  put("position", s.position);
  put("top", s.top); put("right", s.right); put("bottom", s.bottom); put("left", s.left);
  put("z-index", s.zIndex);
  put("aspect-ratio", s.aspectRatio);
  // images render inside a <figure>, so fit/position are also passed down as variables the <img> reads
  put("object-fit", s.objectFit);
  put("--ls-fit", s.objectFit);
  put("object-position", s.objectPosition);
  put("--ls-pos", s.objectPosition);
  put("overflow", s.overflow);
  put("order", s.order);
  put("flex", s.flex);
  put("grid-column", s.gridColumn);
  put("grid-row", s.gridRow);
  put("rotate", s.rotate);
  put("translate", s.translate);
  if (s.css) d.push(s.css.endsWith(";") ? s.css : s.css + ";");
  return d.join("");
}

function visibilityRules(node: Node, sel: string): string {
  const v = node.visibility;
  if (!v) return "";
  let out = "";
  if (!v.desktop) out += `@container page (min-width:${TABLET_MAX + 1}px){${sel}{display:none !important}}`;
  if (!v.tablet) out += `@container page (min-width:${MOBILE_MAX + 1}px) and (max-width:${TABLET_MAX}px){${sel}{display:none !important}}`;
  if (!v.mobile) out += `@container page (max-width:${MOBILE_MAX}px){${sel}{display:none !important}}`;
  return out;
}

/** An absolutely positioned image that covers its parent — it acts as the section's background photo. */
export function isBackgroundImage(node: Node): boolean {
  const s = node.style?.base;
  return node.type === "Image" && s?.position === "absolute" && (s.width === "100%" || s.width === "100vw") && (s.height === "100%" || s.height === "100vh" || s.height === "100svh");
}

/** On tablet/phone a CSS background photo is shown at full width instead of `cover`, so the whole picture stays visible. */
function bgFitDecls(node: Node): string {
  const b = node.style?.base;
  if (!b?.bgMedia || (b.bgSize && b.bgSize !== "cover")) return "";
  const t = node.style?.tablet, m = node.style?.mobile;
  if (t?.bgSize || t?.bgPosition || m?.bgSize || m?.bgPosition) return "";
  // layer order matches styleToDecls: overlay gradient first, then the photo
  return b.bgOverlay
    ? "background-size:100% 100%,100% auto;background-position:0 0,50% 0;background-repeat:no-repeat;"
    : "background-size:100% auto;background-position:50% 0;background-repeat:no-repeat;";
}

interface CssParts { base: string[]; tablet: string[]; mobile: string[]; extra: string[] }

function collect(node: Node, parts: CssParts, media?: Map<string, MediaItem>) {
  const sel = `.${cls(node.id)}`;
  const auto = styleToDecls(node.auto, media);
  const base = styleToDecls(node.style?.base, media);
  if (auto || base) parts.base.push(`${sel}{${base}${auto}}`);
  const tab = bgFitDecls(node) + styleToDecls(node.style?.tablet, media);
  if (tab) parts.tablet.push(`${sel}{${tab}}`);
  const mob = styleToDecls(node.style?.mobile, media);
  if (mob) parts.mobile.push(`${sel}{${mob}}`);
  const vis = visibilityRules(node, sel);
  if (vis) parts.extra.push(vis);
}

/** Joins rules that share the exact same declarations into one selector list (`.n_a,.n_b{…}`). */
function merge(rules: string[]): string {
  const bySig = new Map<string, string[]>();
  for (const r of rules) {
    const i = r.indexOf("{");
    const sel = r.slice(0, i), body = r.slice(i);
    const list = bySig.get(body);
    if (list) list.push(sel); else bySig.set(body, [sel]);
  }
  let out = "";
  bySig.forEach((sels, body) => { out += sels.join(",") + body; });
  return out;
}

function assemble(parts: CssParts): string {
  let out = merge(parts.base);
  if (parts.tablet.length) out += `@container page (max-width:${TABLET_MAX}px){${merge(parts.tablet)}}`;
  if (parts.mobile.length) out += `@container page (max-width:${MOBILE_MAX}px){${merge(parts.mobile)}}`;
  return out + parts.extra.join("");
}

export function nodeCss(node: Node, media?: Map<string, MediaItem>): string {
  const parts: CssParts = { base: [], tablet: [], mobile: [], extra: [] };
  collect(node, parts, media);
  return assemble(parts);
}

export function walk(node: Node, fn: (n: Node, parent?: Node, index?: number) => void, parent?: Node, index?: number) {
  fn(node, parent, index);
  node.children?.forEach((c, i) => walk(c, fn, node, i));
}

/**
 * Every rule targets a single node class, so rules can be grouped freely: one container query per breakpoint
 * and identical declaration blocks merged. Base → tablet → phone order is kept, so the cascade is unchanged.
 */
export function buildPageCss(page: Page, _theme: Theme, media?: Map<string, MediaItem>): string {
  const parts: CssParts = { base: [], tablet: [], mobile: [], extra: [] };
  walk(page, (n) => collect(n, parts, media));
  return assemble(parts);
}
