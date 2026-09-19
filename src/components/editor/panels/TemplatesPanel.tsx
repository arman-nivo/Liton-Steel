"use client";
import { useEditor } from "@/lib/store/editor";
import { TEMPLATES, ELEMENT_TYPES, elementTemplate } from "@/lib/content/templates";
import { C } from "../ui";
import { findParent, pathTo } from "@/lib/utils";
import type { Node, NodeType } from "@/lib/schema/types";
import { CONTAINER_TYPES } from "@/lib/schema/types";

export function TemplatesPanel() {
  const page = useEditor((s) => s.page());
  const selectedId = useEditor((s) => s.selectedId);
  const insert = useEditor((s) => s.insertNode);
  if (!page) return null;
  const addSection = (make: () => Node) => {
    // insert after the section that contains the selection, else at the end
    let index = page.children.length;
    if (selectedId) { const path = pathTo(page as Node, selectedId); const sec = path?.[1]; if (sec) index = page.children.findIndex((c) => c.id === sec.id) + 1; }
    insert(page.id, index, make());
  };
  const addElement = (type: NodeType) => {
    // into the selected container, or after the selected element inside its parent
    let parentId = page.id, index = page.children.length;
    if (selectedId) {
      const path = pathTo(page as Node, selectedId);
      const sel = path?.[path.length - 1];
      if (sel && CONTAINER_TYPES.includes(sel.type) && sel.type !== "Page") { parentId = sel.id; index = sel.children?.length ?? 0; }
      else if (sel) { const loc = findParent(page as Node, sel.id); if (loc) { parentId = loc.parent.id; index = loc.index + 1; } }
    }
    if (parentId === page.id) { const first = page.children[0]?.children?.find((c) => c.type === "Container"); if (first) { parentId = first.id; index = first.children?.length ?? 0; } }
    insert(parentId, index, elementTemplate(type));
  };
  const groups = Array.from(new Set(ELEMENT_TYPES.map((e) => e.group)));
  return (
    <div style={{ padding: 10, display: "grid", gap: 12 }}>
      <div>
        <div style={h}>Section templates (company profile)</div>
        <div style={grid}>{TEMPLATES.filter((t) => t.group === "profile").map((t) => <button key={t.id} onClick={() => addSection(t.make)} style={card}>{t.label.en}</button>)}</div>
      </div>
      <div>
        <div style={h}>Generic sections</div>
        <div style={grid}>{TEMPLATES.filter((t) => t.group === "generic").map((t) => <button key={t.id} onClick={() => addSection(t.make)} style={card}>{t.label.en}</button>)}</div>
      </div>
      <div>
        <div style={h}>Elements (added into the selected container)</div>
        {groups.map((gname) => (
          <div key={gname} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: C.dim, margin: "6px 0 4px" }}>{gname}</div>
            <div style={grid}>{ELEMENT_TYPES.filter((e) => e.group === gname).map((e) => <button key={e.type} onClick={() => addElement(e.type)} style={card}>{e.label}</button>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
const h: React.CSSProperties = { fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#9a9a95", marginBottom: 8 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 };
const card: React.CSSProperties = { background: "#0f0f0e", border: "1px solid #262623", color: "#ececea", borderRadius: 8, padding: "9px 8px", fontSize: 12, cursor: "pointer", textAlign: "left" };
