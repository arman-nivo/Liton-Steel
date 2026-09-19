"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store/editor";
import type { Warning } from "@/lib/schema/types";
import { Btn, C, Modal } from "../ui";
import { auditDom } from "@/lib/optimize/audit";

/** Transparent log of what the engine auto-adjusted, plus warnings with one-click fixes. */
export function OptimizationPanel({ onClose }: { onClose: () => void }) {
  const warnings = useEditor((s) => s.warnings);
  const adjustments = useEditor((s) => s.adjustments);
  const select = useEditor((s) => s.select);
  const updateStyle = useEditor((s) => s.updateStyle);
  const updateProps = useEditor((s) => s.updateProps);
  const [dom, setDom] = useState<Warning[] | null>(null);
  const [tab, setTab] = useState<"warnings" | "adjustments">("warnings");

  const runAudit = () => { const root = document.querySelector<HTMLElement>(".ls-page"); setDom(root ? auditDom(root) : []); };
  const all = [...warnings, ...(dom ?? [])];
  const applyFix = (w: Warning) => {
    if (!w.nodeId) return;
    if (w.fix?.patch) updateStyle(w.nodeId, "base", w.fix.patch);
    if (w.fix?.action === "set-h1") updateProps(w.nodeId, { level: 1 });
  };
  const color = (l: Warning["level"]) => (l === "error" ? C.danger : l === "warn" ? C.gold : C.dim);
  return (
    <Modal title="Optimization panel" onClose={onClose} width={760}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <Btn variant={tab === "warnings" ? "gold" : "outline"} onClick={() => setTab("warnings")}>Warnings ({all.length})</Btn>
        <Btn variant={tab === "adjustments" ? "gold" : "outline"} onClick={() => setTab("adjustments")}>Auto-adjusted ({adjustments.length})</Btn>
        <div style={{ flex: 1 }} />
        <Btn variant="outline" onClick={runAudit}>Run layout audit (overlap / overflow / tap targets)</Btn>
      </div>
      <p style={{ fontSize: 12, color: C.dim, marginTop: 0 }}>The engine runs after every edit: fluid type, auto-layout, rhythm, image sizes, contrast, overflow, brand consistency, motion budget and SEO. Nothing here is a silent surprise.</p>
      {tab === "warnings" ? (
        all.length ? all.map((w) => (
          <div key={w.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: `1px solid ${C.line}` }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: color(w.level), marginTop: 6, flex: "none" }} />
            <div style={{ flex: 1, fontSize: 13 }}>
              <div>{w.message}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{w.rule}{w.nodeId ? <> · <button onClick={() => { select(w.nodeId!); document.querySelector(`[data-node-id="${w.nodeId}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }); }} style={{ background: "transparent", border: 0, color: C.gold, cursor: "pointer", padding: 0, fontSize: 11 }}>select element</button></> : null}</div>
            </div>
            {w.fix && (w.fix.patch || w.fix.action) ? <Btn small variant="gold" onClick={() => applyFix(w)}>{w.fix.label}</Btn> : null}
          </div>
        )) : <p style={{ color: C.ok }}>No warnings. Everything passes contrast, overflow, brand and SEO checks.</p>
      ) : (
        adjustments.length ? adjustments.map((a, i) => (
          <div key={i} style={{ padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 13 }}>
            <div>{a.message}</div>
            <div style={{ fontSize: 11, color: C.dim }}>{a.rule}{a.nodeId ? <> · <button onClick={() => select(a.nodeId!)} style={{ background: "transparent", border: 0, color: C.gold, cursor: "pointer", padding: 0, fontSize: 11 }}>select element</button></> : null}</div>
          </div>
        )) : <p style={{ color: C.dim }}>No automatic adjustments were needed for the current content.</p>
      )}
    </Modal>
  );
}
