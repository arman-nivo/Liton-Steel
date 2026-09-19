import type { Rule } from "../types";
import { eachNode } from "../walk";
import { stripHtml } from "../../utils";

/** Rule 11 — SEO/accessibility: derive title/description, one H1, alt text required. */
export const seo: Rule = {
  id: "seo",
  run(ctx) {
    const page = ctx.page;
    let firstHeading = "", firstPara = "";
    let h1 = 0;
    eachNode(page, (n) => {
      if (n.type === "Heading") {
        if (!firstHeading) firstHeading = stripHtml(String(n.props.text?.en ?? "")).replace(/\s+/g, " ");
        if (Number(n.props.level) === 1) h1++;
      }
      if ((n.type === "Text" || n.type === "RichText") && !firstPara) firstPara = stripHtml(String(n.props.text?.en ?? "")).replace(/\s+/g, " ").slice(0, 155);
      if (n.type === "Image" || n.type === "PersonCard") {
        const m = ctx.media.get(n.props.media);
        const alt = n.props.alt?.en || n.props.name?.en || m?.alt;
        if (n.props.media && !alt) ctx.warn({ level: "error", rule: "seo", nodeId: n.id, message: "Image has no alt text. Add one before publishing." });
      }
      if (n.type === "ImageCollage" || n.type === "Gallery") {
        for (const it of n.props.items ?? []) { const m = ctx.media.get(it.media); if (!(it.alt?.en || m?.alt)) ctx.warn({ level: "error", rule: "seo", nodeId: n.id, message: `Collage image "${it.media}" has no alt text.` }); }
      }
    });
    page.computed = { ...(page.computed ?? {}), title: page.props.title?.en || `${firstHeading} — ${ctx.site.company.shortName.en}`, description: page.props.description?.en || firstPara };
    if (h1 === 0) {
      const first = findFirstHeading(page);
      if (first) ctx.warn({ level: "warn", rule: "seo", nodeId: first.id, message: "Page has no H1. The first heading should be level 1.", fix: { label: "Make it H1", action: "set-h1" } });
    } else if (h1 > 1) ctx.warn({ level: "warn", rule: "seo", message: `Page has ${h1} H1 headings; keep exactly one.` });
  },
};
function findFirstHeading(root: any): any { let f: any = null; eachNode(root, (n) => { if (!f && n.type === "Heading") f = n; }); return f; }
