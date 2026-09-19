/**
 * Self-optimisation engine — a pure function pipeline run after every edit (editor) and at publish/build time.
 * optimize(site, viewport) → { site, warnings, adjustments }
 */
import { produce } from "immer";
import type { Adjustment, Node, Site, Warning } from "../schema/types";
import { mediaMap } from "../content/media";
import type { Rule, RuleCtx } from "./types";
import { fluidType } from "./rules/fluid-type";
import { autoLayout } from "./rules/layout";
import { rhythm } from "./rules/rhythm";
import { images } from "./rules/images";
import { contrast } from "./rules/contrast";
import { overflow } from "./rules/overflow";
import { consistency } from "./rules/consistency";
import { motionBudget } from "./rules/motion";
import { seo } from "./rules/seo";

export const RULES: Rule[] = [autoLayout, fluidType, rhythm, images, contrast, overflow, consistency, motionBudget, seo];

export interface OptimizeResult { site: Site; warnings: Warning[]; adjustments: Adjustment[] }

export function optimize(site: Site, viewport = 1440, rules: Rule[] = RULES): OptimizeResult {
  const warnings: Warning[] = [];
  const adjustments: Adjustment[] = [];
  let counter = 0;
  const next = produce(site, (draft) => {
    const media = mediaMap(draft);
    for (const page of draft.pages) {
      const parentsOf = new Map<string, Node[]>();
      const index = (n: Node, ps: Node[]) => { parentsOf.set(n.id, ps); n.children?.forEach((c) => index(c, [...ps, n])); };
      index(page, []);
      const ctx: RuleCtx = {
        site: draft, page, media, viewport,
        warn: (w) => warnings.push({ id: `w${++counter}`, ...w }),
        adjust: (a) => adjustments.push(a),
        ancestors: (id) => parentsOf.get(id) ?? [],
      };
      for (const r of rules) {
        try { r.run(ctx); } catch (e) { warnings.push({ id: `w${++counter}`, level: "warn", rule: r.id, message: `Rule failed: ${(e as Error).message}` }); }
      }
    }
  });
  // de-duplicate identical warnings
  const seen = new Set<string>();
  const uniq = warnings.filter((w) => { const k = `${w.rule}|${w.nodeId}|${w.message}`; if (seen.has(k)) return false; seen.add(k); return true; });
  return { site: next, warnings: uniq, adjustments };
}

export const hasBlockingIssues = (w: Warning[]) => w.some((x) => x.level === "error");
