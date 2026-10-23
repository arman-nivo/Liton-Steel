import type { Rule } from "../types";
import { eachNode } from "../walk";
import { isBackgroundImage } from "../../schema/css";

const MAX_BYTES = 400 * 1024;

/** Rule 5 — image optimisation: responsive sizes from layout, hero preload, weight and resolution warnings. */
export const images: Rule = {
  id: "images",
  run(ctx) {
    // Only the first section is on screen at load, so only its first image is worth a preload.
    const hero = ctx.page.children[0];
    let firstImage = true;
    eachNode(ctx.page, (n, parents) => {
      const ids: string[] = [];
      if (n.type === "Image" && n.props.media) ids.push(n.props.media);
      if ((n.type === "ImageCollage" || n.type === "Gallery") && Array.isArray(n.props.items)) ids.push(...n.props.items.map((i: any) => i.media));
      if (n.type === "PersonCard" && n.props.media) ids.push(n.props.media);
      if (n.type === "ProcessSteps" && Array.isArray(n.props.media)) ids.push(...n.props.media);
      if (n.style.base.bgMedia) ids.push(n.style.base.bgMedia);
      if (n.type === "Section" && n.props.bgMedia) {
        ids.push(n.props.bgMedia);
        if (n === hero) { n.computed = { ...(n.computed ?? {}), bgPriority: true }; firstImage = false; }
        else if (n.computed?.bgPriority) delete n.computed.bgPriority;
      }
      if (!ids.length) return;

      if (n.type === "Image") {
        const grid = [...parents].reverse().find((p) => p.type === "Grid");
        const cols = grid?.style.base.columns ?? grid?.auto?.columns ?? 1;
        // full-bleed only for real backgrounds; a small absolutely placed image would otherwise download screen-wide
        const absolute = isBackgroundImage(n) || n.style.base.width === "100vw";
        const sizes = absolute ? "100vw" : cols >= 3 ? "(max-width: 767px) 100vw, (max-width: 1199px) 45vw, 420px" : cols === 2 ? "(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 640px" : "(max-width: 767px) 100vw, 1200px";
        n.computed = { ...(n.computed ?? {}), sizes };
        const aboveFold = !!hero && (n === hero || parents.includes(hero));
        if (firstImage && aboveFold) { n.computed.priority = true; firstImage = false; }
        else delete n.computed.priority;
        const m = ctx.media.get(n.props.media);
        const need = absolute || cols === 1 ? 1200 : 700;
        if (m && m.width < need) ctx.warn({ level: "warn", rule: "images", nodeId: n.id, message: `"${m.id}" is ${m.width}px wide but this slot wants ≥${need}px; it may look soft.` });
      }
      for (const id of ids) {
        const m = ctx.media.get(id);
        if (!m) { ctx.warn({ level: "warn", rule: "images", nodeId: n.id, message: `Image "${id}" is missing from the media library.` }); continue; }
        if (m.bytes && m.bytes > MAX_BYTES) ctx.warn({ level: "info", rule: "images", nodeId: n.id, message: `"${m.id}" is ${Math.round(m.bytes / 1024)} KB after compression (budget 400 KB).` });
      }
    });
  },
};
