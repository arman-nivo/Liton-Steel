import { customAlphabet } from "nanoid";
import type { L10n, Locale, Node } from "./schema/types";

export const uid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function t(v: L10n | string | undefined, locale: Locale): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  return (locale === "bn" ? v.bn || v.en : v.en) ?? "";
}

export function l10n(en: string, bn?: string): L10n { return bn ? { en, bn } : { en }; }

export function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || "page";
}

export function stripHtml(html: string) {
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const ALLOWED_TAGS = new Set(["span", "strong", "b", "em", "i", "u", "br", "p", "a", "small", "sup", "sub"]);
const ALLOWED_CLASSES = new Set(["outline", "gold", "paper", "mute", "ink"]);
const ALLOWED_STYLE = /^(color|font-weight|letter-spacing|font-style|text-decoration|font-size|opacity|-webkit-text-stroke)\s*:\s*[#(),.%\w\s-]+$/i;

/** Sanitizes inline rich text from the editor: keeps a tiny whitelist of tags, classes and style props. */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (_m, tagRaw: string, attrs: string) => {
    const tag = tagRaw.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (_m.startsWith("</")) return `</${tag}>`;
    if (tag === "br") return "<br>";
    const kept: string[] = [];
    const cls = /class\s*=\s*"([^"]*)"/i.exec(attrs)?.[1];
    if (cls) {
      const ok = cls.split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
      if (ok.length) kept.push(`class="${ok.join(" ")}"`);
    }
    const style = /style\s*=\s*"([^"]*)"/i.exec(attrs)?.[1];
    if (style) {
      const ok = style.split(";").map((s) => s.trim()).filter((s) => ALLOWED_STYLE.test(s));
      if (ok.length) kept.push(`style="${ok.join(";")}"`);
    }
    if (tag === "a") {
      const href = /href\s*=\s*"([^"]*)"/i.exec(attrs)?.[1];
      if (href && /^(https?:|mailto:|tel:|\/|#)/i.test(href)) kept.push(`href="${href}"`);
    }
    return `<${tag}${kept.length ? " " + kept.join(" ") : ""}>`;
  }).replace(/<script[\s\S]*?<\/script>/gi, "");
}

// ---- colour helpers (contrast guard) ----
export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "");
  if (![3, 6].includes(m.length) || !/^[0-9a-fA-F]+$/.test(m)) return null;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function luminance([r, g, b]: [number, number, number]) {
  const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrastRatio(a: string, b: string): number | null {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const la = luminance(ra), lb = luminance(rb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
export function contrastWithBrightness(hex: string, brightness: number): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const l = luminance(rgb);
  const lb = brightness; // brightness ≈ mean luma 0..1
  const [hi, lo] = l > lb ? [l, lb] : [lb, l];
  return (hi + 0.05) / (lo + 0.05);
}
export function colorDistance(a: string, b: string) {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return Infinity;
  return Math.sqrt(ra.reduce((s, v, i) => s + (v - rb[i]) ** 2, 0));
}

// ---- tree helpers ----
export function findNode(root: Node, id: string): Node | undefined {
  if (root.id === id) return root;
  for (const c of root.children ?? []) { const f = findNode(c, id); if (f) return f; }
  return undefined;
}
export function findParent(root: Node, id: string): { parent: Node; index: number } | undefined {
  for (let i = 0; i < (root.children?.length ?? 0); i++) {
    const c = root.children![i];
    if (c.id === id) return { parent: root, index: i };
    const f = findParent(c, id);
    if (f) return f;
  }
  return undefined;
}
export function pathTo(root: Node, id: string, acc: Node[] = []): Node[] | undefined {
  if (root.id === id) return [...acc, root];
  for (const c of root.children ?? []) { const p = pathTo(c, id, [...acc, root]); if (p) return p; }
  return undefined;
}
export function cloneWithNewIds<T extends Node>(node: T): T {
  const copy: Node = { ...node, id: uid(), children: node.children?.map((c) => cloneWithNewIds(c)) };
  return copy as T;
}
export function countNodes(node: Node): number { return 1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0); }

export function formatPhone(p: string) { return p.replace(/[^+\d]/g, ""); }
export function debounce<T extends (...a: any[]) => void>(fn: T, ms: number) {
  let h: ReturnType<typeof setTimeout> | undefined;
  return (...a: Parameters<T>) => { if (h) clearTimeout(h); h = setTimeout(() => fn(...a), ms); };
}
