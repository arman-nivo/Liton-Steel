import type { Rule } from "../types";
import { eachNode } from "../walk";
import { countNodes } from "../../utils";

export function collageLayoutFor(n: number): "hero" | "pair" | "trio" | "quad" | "masonry" {
  if (n <= 1) return "hero";
  if (n === 2) return "pair";
  if (n === 3) return "trio";
  if (n === 4) return "quad";
  return "masonry";
}
export function bestColumns(n: number): number {
  if (n <= 0) return 1;
  if (n <= 4) return n;
  if (n <= 6) return 3;
  if (n % 4 === 0) return 4;
  if (n % 3 === 0) return 3;
  return 4;
}

/** Rule 3 — auto-layout reflow for collages, galleries and card grids; Rule 4 — section height vs content. */
export const autoLayout: Rule = {
  id: "auto-layout",
  run(ctx) {
    eachNode(ctx.page, (n) => {
      if (n.type === "ImageCollage" || n.type === "Gallery") {
        const count = (n.props.items ?? []).length;
        const layout = collageLayoutFor(count);
        if (!n.props.layout || n.props.layout === "auto") {
          const prev = n.computed?.layout;
          n.computed = { ...(n.computed ?? {}), layout };
          if (prev && prev !== layout) ctx.adjust({ rule: "auto-layout", nodeId: n.id, message: `Collage re-arranged for ${count} image${count === 1 ? "" : "s"} (${layout}).` });
        }
      }
      if (n.type === "Grid" && (n.props.autoColumns || (n.children ?? []).every((c) => ["PersonCard", "Stat"].includes(c.type)) && n.children?.length)) {
        if (n.style.base.columns && !n.props.autoColumns) return;
        const count = n.children?.length ?? 0;
        const cols = bestColumns(count);
        const prev = n.auto?.columns;
        n.auto = { ...(n.auto ?? {}), columns: cols };
        if (count > cols && count % cols !== 0) n.auto.justifyContent = "center";
        if (prev !== undefined && prev !== cols) ctx.adjust({ rule: "auto-layout", nodeId: n.id, message: `Cards rebalanced to ${cols} columns for ${count} items.` });
      }
      if (n.type === "Section" && n.props.fullHeight) {
        const heavy = countNodes(n) > 60;
        const prev = n.computed?.fullHeight;
        n.computed = { ...(n.computed ?? {}), fullHeight: !heavy };
        if (heavy && prev !== false) ctx.adjust({ rule: "auto-layout", nodeId: n.id, message: "Section has a lot of content; full-viewport height released so nothing is cramped." });
      }
      // empty containers collapse (no dangling gaps)
      if (["Stack", "Grid", "Container"].includes(n.type) && !(n.children?.length)) {
        n.auto = { ...(n.auto ?? {}), display: "none" };
        ctx.warn({ level: "info", rule: "auto-layout", nodeId: n.id, message: `Empty ${n.type} collapsed. Add content or delete it.` });
      } else if (n.auto?.display === "none" && n.children?.length) {
        delete n.auto.display;
      }
    });
  },
};
