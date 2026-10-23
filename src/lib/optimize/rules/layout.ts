import type { Rule } from "../types";
import { eachNode } from "../walk";
import { countNodes } from "../../utils";
import { resolveSpace } from "../../schema/css";
import type { Node } from "../../schema/types";

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

/** Widest a person card gets, and the narrowest before the grid drops to fewer cards per row. */
const CARD_MAX = "420px";
const CARD_MIN = "300px";

/**
 * Equal card tracks for `cols` cards per row. Rows with fewer cards keep the same card size, centred, instead of
 * stretching (auto-fit drops the empty tracks); narrow screens fall back to fewer per row. The 1px keeps rounding
 * from pushing the last card onto a new line.
 */
export function personTracks(cols: number, gap: string): string {
  return `repeat(auto-fit, minmax(min(100%, ${CARD_MIN}), min(${CARD_MAX}, calc((100% - ${cols - 1} * ${gap}) / ${cols} - 1px))))`;
}

const isPersonGrid = (n: Node) =>
  n.type === "Grid" && !!n.children?.length && n.children.every((c) => c.type === "PersonCard") && !(n.style.base.columns && !n.props.autoColumns);

/** Rule 3 — auto-layout reflow for collages, galleries and card grids; Rule 4 — section height vs content. */
export const autoLayout: Rule = {
  id: "auto-layout",
  run(ctx) {
    // Person grids in one section share a column count, so cards split across rows (e.g. two leaders, a paragraph,
    // then an advisor) come out the same size instead of a lone card filling its whole row.
    const groups = new Map<string, Node[]>();
    eachNode(ctx.page, (n, parents) => {
      if (!isPersonGrid(n)) return;
      const sectionId = [...parents].reverse().find((p) => p.type === "Section")?.id ?? ctx.page.id;
      groups.set(sectionId, [...(groups.get(sectionId) ?? []), n]);
    });
    const sharedCols = new Map<string, number>();
    groups.forEach((grids) => {
      const cols = Math.max(...grids.map((g) => bestColumns(g.children!.length)));
      grids.forEach((g) => sharedCols.set(g.id, cols));
    });

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
      const shared = sharedCols.get(n.id);
      // a grid that is no longer a person grid drops the engine's card tracks (they would override its columns)
      if (shared === undefined && n.auto?.columnsTemplate) delete n.auto.columnsTemplate;
      if (shared !== undefined) {
        const prev = n.auto?.columnsTemplate;
        const tracks = personTracks(shared, resolveSpace(n.auto?.gap ?? n.style.base.gap) ?? "0px");
        n.auto = { ...(n.auto ?? {}), columnsTemplate: tracks, justifyContent: "center" };
        delete n.auto.columns;
        if (prev !== undefined && prev !== tracks) ctx.adjust({ rule: "auto-layout", nodeId: n.id, message: `Person cards resized to ${shared} per row so every row matches.` });
      } else if (n.type === "Grid" && (n.props.autoColumns || (n.children ?? []).every((c) => ["PersonCard", "Stat"].includes(c.type)) && n.children?.length)) {
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
