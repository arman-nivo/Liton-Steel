import type { Rule } from "../types";
import { eachNode } from "../walk";
import type { Box, StyleProps } from "../../schema/types";

function snapBox(b: Box | undefined, unit: number): { value: Box; changed: boolean } | null {
  if (b === undefined) return null;
  const snapOne = (v: number | string): { v: number | string; c: boolean } => {
    if (typeof v === "string" && /^\d+(\.\d+)?px$/.test(v)) {
      const px = parseFloat(v); const s = Math.max(0, Math.round(px / unit)) * unit;
      return { v: `${s}px`, c: s !== px };
    }
    return { v, c: false };
  };
  if (Array.isArray(b)) { const r = b.map(snapOne); return { value: r.map((x) => x.v) as Box, changed: r.some((x) => x.c) }; }
  const r = snapOne(b); return { value: r.v, changed: r.c };
}

/** Rule 4 — vertical rhythm: raw pixel spacing snaps to the base unit. */
export const rhythm: Rule = {
  id: "rhythm",
  run(ctx) {
    const unit = ctx.site.theme.space;
    eachNode(ctx.page, (n) => {
      for (const key of ["padding", "margin", "gap"] as const) {
        const r = snapBox(n.style.base[key] as Box | undefined, unit);
        if (!r) { if (n.auto) delete (n.auto as StyleProps)[key]; continue; }
        if (r.changed) {
          (n.auto ??= {})[key] = r.value as never;
          ctx.adjust({ rule: "rhythm", nodeId: n.id, message: `${key} snapped to the ${unit}px grid (${JSON.stringify(n.style.base[key])} → ${JSON.stringify(r.value)}).` });
        } else if (n.auto) delete (n.auto as StyleProps)[key];
      }
    });
  },
};
