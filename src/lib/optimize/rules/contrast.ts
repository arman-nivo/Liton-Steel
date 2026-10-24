import type { Rule } from "../types";
import { eachNode, isText } from "../walk";
import { contrastRatio, contrastWithBrightness } from "../../utils";
import type { Node, Theme } from "../../schema/types";

function tokenHex(theme: Theme, v?: string): string | null {
  if (!v) return null;
  if (v.startsWith("token:")) { const k = v.slice(6) as keyof Theme["colors"]; return theme.colors[k] ?? null; }
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
  return null;
}

/** Rule 6 — WCAG AA contrast guard, including text over photos (uses computed image brightness). */
export const contrast: Rule = {
  id: "contrast",
  run(ctx) {
    const theme = ctx.site.theme;
    const needOverlay = new Set<string>();
    eachNode(ctx.page, (n, parents) => {
      if (!isText(n)) return;
      const large = n.type === "Heading" || n.type === "Quote" || n.type === "Stat";
      const need = large ? 3 : 4.5;
      const text = tokenHex(theme, n.style.base.color) ?? (n.type === "Heading" ? theme.colors.gold : theme.colors.paper);
      // find background: nearest ancestor with bg colour / tone / bg media
      let bgHex: string | null = null; let brightness: number | null = null; let bgNode: Node | null = null;
      for (let i = parents.length - 1; i >= 0; i--) {
        const p = parents[i];
        const hex = tokenHex(theme, p.style.base.bg);
        if (p.style.base.bgMedia) { const m = ctx.media.get(p.style.base.bgMedia); if (m?.brightness !== undefined) { brightness = m.brightness; bgNode = p; break; } }
        if (p.type === "Section" && p.props.bgMedia) { const m = ctx.media.get(p.props.bgMedia); brightness = (m?.brightness ?? 0.5) * (1 - (p.props.bgOverlay ?? 0.55)); bgNode = p; break; }
        if (p.type === "Section") {
          const hero = p.children?.find((c) => c.type === "Image" && c.style.base.position === "absolute");
          if (hero) { const m = ctx.media.get(hero.props.media); brightness = (m?.brightness ?? 0.5) * (hero.style.base.opacity ?? 1); bgNode = p; break; }
          bgHex = hex ?? (p.props.tone === "paper" ? theme.colors.paper : p.props.tone === "gold" ? theme.colors.gold : theme.colors.ink); bgNode = p; break;
        }
        if (hex) { bgHex = hex; bgNode = p; break; }
      }
      const ratio = brightness !== null ? contrastWithBrightness(text, brightness) : contrastRatio(text, bgHex ?? theme.colors.ink);
      if (ratio === null) return;
      if (ratio >= need) return;
      if (brightness !== null && bgNode) {
        // auto-apply a dark overlay so text stays readable over the photo
        const overlay = "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.65))";
        needOverlay.add(bgNode.id);
        if (bgNode.computed?.overlay !== overlay) {
          bgNode.computed = { ...(bgNode.computed ?? {}), overlay };
          ctx.adjust({ rule: "contrast", nodeId: bgNode.id, message: "Dark gradient overlay applied so text over the photo meets AA contrast." });
        }
        return;
      }
      const alt = contrastRatio(theme.colors.gold, bgHex ?? theme.colors.ink)! >= need ? "token:gold" : "token:paper";
      ctx.warn({ level: "warn", rule: "contrast", nodeId: n.id, message: `Text contrast ${ratio.toFixed(1)}:1 is below ${need}:1 (WCAG AA).`, fix: { label: `Use ${alt.slice(6)}`, patch: { color: alt } } });
    });
    // the overlay is saved with the page, so take it off again once the text reads fine without it
    eachNode(ctx.page, (n) => {
      if (!n.computed?.overlay || needOverlay.has(n.id)) return;
      delete n.computed.overlay;
      ctx.adjust({ rule: "contrast", nodeId: n.id, message: "Dark overlay removed: text over the photo is readable without it." });
    });
  },
};
