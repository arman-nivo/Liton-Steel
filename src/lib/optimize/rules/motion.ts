import type { Rule } from "../types";
import { eachNode } from "../walk";

const HEAVY = new Set(["split-chars", "mask-reveal-text", "parallax-depth", "image-clip-expand", "tab-drop"]);
export const SECTION_BUDGET = 18;

/** Rule 9 — motion budget: too many animated elements in one section downgrade heavy presets to a simple fade. */
export const motionBudget: Rule = {
  id: "motion-budget",
  run(ctx) {
    let total = 0;
    for (const section of ctx.page.children ?? []) {
      const animated: typeof section[] = [];
      eachNode(section, (n) => { if (n.animation && n.animation.preset !== "none") animated.push(n); });
      total += animated.length;
      const over = animated.length > SECTION_BUDGET;
      let changed = 0;
      for (const n of animated) {
        const want = over && HEAVY.has(n.animation!.preset);
        const has = !!n.computed?.motionDowngrade;
        if (want !== has) { n.computed = { ...(n.computed ?? {}), motionDowngrade: want }; changed++; }
      }
      if (over && changed) ctx.adjust({ rule: "motion-budget", nodeId: section.id, message: `${animated.length} animated elements in "${section.name}"; heavy presets downgraded to fade-rise to keep 60fps.` });
    }
    if (total > 80) ctx.warn({ level: "info", rule: "motion-budget", message: `${total} animated elements on this page; consider fewer for low-end phones.` });
  },
};
