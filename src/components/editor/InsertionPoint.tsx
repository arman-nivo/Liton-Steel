"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store/editor";
import { ELEMENT_TYPES, TEMPLATES, elementTemplate } from "@/lib/content/templates";
import type { NodeType } from "@/lib/schema/types";

/** The "+" that appears between blocks in edit mode. */
export function InsertionPoint({ parentId, index, kind }: { parentId: string; index: number; kind: "section" | "element" }) {
  const [open, setOpen] = useState(false);
  const insert = useEditor((s) => s.insertNode);
  const [q, setQ] = useState("");
  const close = () => { setOpen(false); setQ(""); };
  return (
    <div className="ls-insert" data-editor-ui onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="Insert here" title="Insert here" onClick={() => setOpen((o) => !o)}>+</button>
      {open ? (
        <div className="ls-editor-ui" style={{ position: "absolute", left: "50%", top: 18, transform: "translateX(-50%)", zIndex: 40, width: 320, maxHeight: 360, overflow: "auto", background: "#151513", border: "1px solid #333", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,.6)", padding: 8, color: "#eee", fontSize: 13 }}>
          <input autoFocus placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: "#0f0f0e", border: "1px solid #333", color: "#eee", borderRadius: 8, marginBottom: 8 }} onKeyDown={(e) => { if (e.key === "Escape") close(); }} />
          {kind === "section"
            ? TEMPLATES.filter((tp) => tp.label.en.toLowerCase().includes(q.toLowerCase())).map((tp) => (
              <button key={tp.id} type="button" onClick={() => { insert(parentId, index, tp.make()); close(); }} style={item}>{tp.label.en}<span style={{ opacity: 0.5, fontSize: 11 }}>{tp.group}</span></button>
            ))
            : ELEMENT_TYPES.filter((el) => el.label.toLowerCase().includes(q.toLowerCase())).map((el) => (
              <button key={el.type} type="button" onClick={() => { insert(parentId, index, elementTemplate(el.type as NodeType)); close(); }} style={item}>{el.label}<span style={{ opacity: 0.5, fontSize: 11 }}>{el.group}</span></button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
const item: React.CSSProperties = { display: "flex", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "8px 10px", background: "transparent", border: 0, color: "#eee", borderRadius: 8, cursor: "pointer" };
