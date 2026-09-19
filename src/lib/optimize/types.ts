import type { Adjustment, MediaItem, Node, Page, Site, Warning } from "../schema/types";

export interface RuleCtx {
  site: Site;                   // immer draft
  page: Page;                   // immer draft
  media: Map<string, MediaItem>;
  viewport: number;
  warn(w: Omit<Warning, "id">): void;
  adjust(a: Adjustment): void;
  /** parent chain for a node id (page → … → parent) */
  ancestors(id: string): Node[];
}
export type Rule = { id: string; run(ctx: RuleCtx): void };
