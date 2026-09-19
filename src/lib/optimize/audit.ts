"use client";
import type { Warning } from "../schema/types";

/** Runtime DOM audit (editor only): horizontal overflow, clipped text, small tap targets, unintended overlaps. */
export function auditDom(root: HTMLElement): Warning[] {
  const out: Warning[] = [];
  let i = 0;
  const push = (w: Omit<Warning, "id">) => out.push({ id: `a${++i}`, ...w });
  const rootRect = root.getBoundingClientRect();
  if (root.scrollWidth > root.clientWidth + 2) push({ level: "warn", rule: "overflow", message: `Page content is ${root.scrollWidth - root.clientWidth}px wider than the canvas (horizontal scroll).` });
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-node-id]"));
  for (const el of nodes) {
    const id = el.dataset.nodeId!;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > rootRect.right + 4 && getComputedStyle(el).position !== "absolute") push({ level: "warn", rule: "overflow", nodeId: id, message: `${el.dataset.type} sticks out ${Math.round(r.right - rootRect.right)}px past the right edge.` });
    if ((el.classList.contains("ls-heading") || el.classList.contains("ls-text")) && el.scrollWidth > el.clientWidth + 2) push({ level: "warn", rule: "overflow", nodeId: id, message: `Text in this ${el.dataset.type} is clipped horizontally.` });
    if (el.dataset.type === "Button" && (r.height < 44 || r.width < 44)) push({ level: "warn", rule: "tap-target", nodeId: id, message: `Tap target is ${Math.round(r.width)}×${Math.round(r.height)}px (min 44×44).` });
  }
  // sibling overlaps inside flow containers
  for (const parent of Array.from(root.querySelectorAll<HTMLElement>('[data-type="Stack"],[data-type="Grid"],[data-type="Container"]'))) {
    const kids = Array.from(parent.children).filter((k): k is HTMLElement => k instanceof HTMLElement && !!k.dataset.nodeId && getComputedStyle(k).position !== "absolute" && !k.dataset.anim?.includes("parallax"));
    for (let a = 0; a < kids.length; a++) for (let b = a + 1; b < kids.length; b++) {
      const ra = kids[a].getBoundingClientRect(), rb = kids[b].getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 12 && oy > 12 && !kids[a].closest('[data-type="ImageCollage"]')) push({ level: "warn", rule: "overlap", nodeId: kids[b].dataset.nodeId, message: `${kids[a].dataset.type} and ${kids[b].dataset.type} overlap by ${Math.round(Math.min(ox, oy))}px.` });
    }
  }
  return out;
}
