import type { Rule } from "../types";
import { eachNode } from "../walk";

/** Rule 7 (static part) — overflow/tap-target guard. The DOM audit in the editor covers the runtime part. */
export const overflow: Rule = {
  id: "overflow",
  run(ctx) {
    eachNode(ctx.page, (n) => {
      const s = n.style.base;
      // fixed widths wider than a phone get a mobile safety net
      const w = typeof s.width === "string" && /^\d+px$/.test(s.width) ? parseInt(s.width) : null;
      if (w && w > 360 && !n.style.mobile?.width && !s.maxWidth) {
        n.auto = { ...(n.auto ?? {}), maxWidth: "100%" };
        ctx.adjust({ rule: "overflow", nodeId: n.id, message: `Fixed width ${w}px capped at 100% so it can't cause horizontal scroll on phones.` });
      } else if (n.auto?.maxWidth === "100%" && !(w && w > 360)) delete n.auto.maxWidth;
      // tap targets
      if (n.type === "Button") {
        const h = typeof s.height === "string" && /^\d+px$/.test(s.height) ? parseInt(s.height) : null;
        if (h && h < 44) { n.auto = { ...(n.auto ?? {}), minHeight: "44px" }; ctx.adjust({ rule: "overflow", nodeId: n.id, message: "Button height raised to the 44px tap-target minimum." }); }
      }
      // absurdly long single-line headings
      if (n.type === "Heading") {
        const txt = String(n.props.text?.en ?? "");
        if (!/<br/i.test(txt) && txt.replace(/<[^>]+>/g, "").length > 60) ctx.warn({ level: "info", rule: "overflow", nodeId: n.id, message: "Very long heading without a line break; consider splitting it into two lines." });
      }
    });
  },
};
