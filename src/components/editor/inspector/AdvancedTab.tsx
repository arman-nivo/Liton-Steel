"use client";
import { useEditor } from "@/lib/store/editor";
import type { Node } from "@/lib/schema/types";
import { Field, Input, TextArea, Toggle } from "../ui";
import { slugify } from "@/lib/utils";

export function AdvancedTab({ node }: { node: Node }) {
  const updateNode = useEditor((s) => s.updateNode);
  const updateStyle = useEditor((s) => s.updateStyle);
  const vis = node.visibility ?? { desktop: true, tablet: true, mobile: true };
  const setVis = (k: keyof typeof vis, v: boolean) => updateNode(node.id, (n) => { n.visibility = { ...vis, [k]: v }; if (n.visibility.desktop && n.visibility.tablet && n.visibility.mobile) delete n.visibility; });
  return (
    <div>
      <Field label="Layer name"><Input value={node.name ?? ""} placeholder={node.type} onChange={(e) => updateNode(node.id, (n) => { n.name = e.target.value || undefined; })} /></Field>
      <Field label="Anchor id (link with /#id)"><Input value={node.anchor ?? ""} onChange={(e) => updateNode(node.id, (n) => { n.anchor = slugify(e.target.value) || undefined; })} /></Field>
      <Field label="Custom CSS class"><Input value={node.className ?? ""} onChange={(e) => updateNode(node.id, (n) => { n.className = e.target.value || undefined; })} /></Field>
      <Field label="ARIA label"><Input value={node.ariaLabel ?? ""} onChange={(e) => updateNode(node.id, (n) => { n.ariaLabel = e.target.value || undefined; })} /></Field>
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#9a9a95" }}>Visible on</span>
        <Toggle checked={vis.desktop} onChange={(v) => setVis("desktop", v)} label="Desktop" />
        <Toggle checked={vis.tablet} onChange={(v) => setVis("tablet", v)} label="Tablet" />
        <Toggle checked={vis.mobile} onChange={(v) => setVis("mobile", v)} label="Mobile" />
      </div>
      <Toggle checked={!!node.locked} onChange={(v) => updateNode(node.id, (n) => { n.locked = v; })} label="Locked (no canvas resizing)" />
      <Field label="Custom CSS (applied to this block)"><TextArea value={node.style.base.css ?? ""} placeholder="letter-spacing: .2em; mix-blend-mode: screen;" onChange={(e) => updateStyle(node.id, "base", { css: e.target.value || undefined })} style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }} /></Field>
      <p style={{ fontSize: 11, color: "#9a9a95" }}>id: {node.id} · type: {node.type}{node.computed ? ` · engine: ${Object.keys(node.computed).join(", ")}` : ""}</p>
    </div>
  );
}
