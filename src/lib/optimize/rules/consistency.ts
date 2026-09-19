import type { Rule } from "../types";
import { eachNode } from "../walk";
import { colorDistance } from "../../utils";
import { FONTS } from "../../schema/tokens";

/** Rule 8 — design-consistency guard: off-palette colours and non-system fonts get a gentle "snap to token" fix. */
export const consistency: Rule = {
  id: "consistency",
  run(ctx) {
    const palette = Object.entries(ctx.site.theme.colors);
    eachNode(ctx.page, (n) => {
      for (const key of ["color", "bg"] as const) {
        const v = n.style.base[key];
        if (!v || v.startsWith("token:") || !/^#/.test(v)) continue;
        let best: [string, number] = ["", Infinity];
        for (const [name, hex] of palette) { const d = colorDistance(v, hex); if (d < best[1]) best = [name, d]; }
        if (best[1] < 8) continue; // effectively a token already
        ctx.warn({ level: "info", rule: "consistency", nodeId: n.id, message: `${v} is off-palette (nearest token: ${best[0]}).`, fix: { label: `Snap to ${best[0]}`, patch: { [key]: `token:${best[0]}` } } });
      }
      const f = n.style.base.font;
      if (f && !f.startsWith("token:")) {
        const known = Object.values(FONTS).some((x) => f.toLowerCase().includes(x.label.split(" ")[0].toLowerCase()));
        if (!known) ctx.warn({ level: "info", rule: "consistency", nodeId: n.id, message: `"${f}" is not a system font.`, fix: { label: "Snap to body font", patch: { font: n.type === "Heading" ? "token:display" : "token:body" } } });
      }
    });
  },
};
