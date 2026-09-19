import type { Rule } from "../types";
import { eachNode, isToken } from "../walk";
import { stripHtml } from "../../utils";
import { fluid, typeSize } from "../../schema/tokens";

/** Rule 1 — fluid typography: long headings step down (min 55%) so they fit in ≤3 lines; short ones keep the full scale. */
export const fluidType: Rule = {
  id: "fluid-type",
  run(ctx) {
    eachNode(ctx.page, (n) => {
      if (n.type !== "Heading") return;
      if (!isToken(n.style.base.size)) { if (n.auto) delete n.auto.size; return; }
      const key = (n.style.base.size ?? "token:2xl").slice(6);
      const raw = stripHtml(String(n.props.text?.en ?? ""));
      const longest = Math.max(...raw.split("\n").map((l) => l.trim().length), 0);
      // target ≈ 14 chars per line at full scale for display sizes, more for smaller sizes
      const budget = ["display", "4xl"].includes(key) ? 15 : key === "3xl" ? 20 : key === "2xl" ? 28 : 999;
      const shrink = longest > budget ? Math.max(0.55, budget / longest) : 1;
      const { min, max } = typeSize(ctx.site.theme, key, shrink);
      n.auto = { ...(n.auto ?? {}), size: fluid(min, max) };
      if (shrink < 1) ctx.adjust({ rule: "fluid-type", nodeId: n.id, message: `Heading "${raw.slice(0, 24)}…" stepped down to ${Math.round(shrink * 100)}% so it fits in ≤3 lines.` });
    });
  },
};
