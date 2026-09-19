import { seedSite } from "@/lib/content/seed";
import { node } from "@/lib/content/templates";
import type { Node, Page, Site } from "@/lib/schema/types";
import { uid } from "@/lib/utils";

export function siteWith(children: Node[]): Site {
  const site = seedSite();
  const page: Page = { id: uid(), type: "Page", props: { slug: "test", title: { en: "" } }, style: { base: {} }, children };
  site.pages = [page];
  return site;
}
export { node };
export const section = (children: Node[], props: Record<string, any> = {}) => node("Section", { tone: "ink", ...props }, { children });
export const findByType = (root: Node, type: string): Node[] => { const out: Node[] = []; const w = (n: Node) => { if (n.type === type) out.push(n); n.children?.forEach(w); }; w(root); return out; };
