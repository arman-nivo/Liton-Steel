"use client";
import { useEditor, selectNode } from "@/lib/store/editor";
import { C, Seg } from "../ui";
import { ContentTab } from "./ContentTab";
import { StyleTab } from "./StyleTab";
import { LayoutTab } from "./LayoutTab";
import { MotionTab } from "./MotionTab";
import { AdvancedTab } from "./AdvancedTab";

export function Inspector() {
  const node = useEditor(selectNode);
  const tab = useEditor((s) => s.inspectorTab);
  const setTab = useEditor((s) => s.setInspectorTab);
  const warnings = useEditor((s) => s.warnings);
  const setModal = useEditor((s) => s.setModal);
  if (!node) return (
    <aside style={{ borderLeft: `1px solid ${C.line}`, background: C.panel, padding: 16, color: C.dim, fontSize: 12, overflow: "auto" }}>
      <p><b style={{ color: C.text }}>Nothing selected.</b></p>
      <p>Click any element on the canvas to edit it. Double-click text (or press Enter) to type inline. Hover between blocks for the “+” insertion point. Right-click for more.</p>
      <p>Shortcuts: ⌘Z undo · ⇧⌘Z redo · ⌘D duplicate · Del delete · ⌥⌘C/V copy/paste style · ⌘G group · ⌥↑/↓ reorder · Esc deselect.</p>
    </aside>
  );
  const mine = warnings.filter((w) => w.nodeId === node.id);
  return (
    <aside style={{ borderLeft: `1px solid ${C.line}`, background: C.panel, display: "grid", gridTemplateRows: "auto auto 1fr", minHeight: 0 }}>
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontWeight: 700 }}>{node.name ?? node.type}<span style={{ color: C.dim, fontWeight: 400, marginLeft: 6, fontSize: 11 }}>{node.type}</span></div>
        {mine.length ? <button onClick={() => setModal("optimize")} style={{ marginTop: 6, fontSize: 11, color: mine.some((w) => w.level === "error") ? C.danger : C.gold, background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>⚠ {mine.length} issue{mine.length > 1 ? "s" : ""} — open Optimization panel</button> : null}
      </div>
      <div style={{ padding: "8px 12px", borderBottom: `1px solid ${C.line}` }}>
        <Seg value={tab} onChange={setTab} options={[{ value: "content", label: "Content" }, { value: "style", label: "Style" }, { value: "layout", label: "Layout" }, { value: "motion", label: "Motion" }, { value: "advanced", label: "Adv." }]} />
      </div>
      <div style={{ overflow: "auto", padding: 12, minHeight: 0 }}>
        {tab === "content" ? <ContentTab node={node} /> : tab === "style" ? <StyleTab node={node} /> : tab === "layout" ? <LayoutTab node={node} /> : tab === "motion" ? <MotionTab node={node} /> : <AdvancedTab node={node} />}
      </div>
    </aside>
  );
}
