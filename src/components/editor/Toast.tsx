"use client";
import { useEditor } from "@/lib/store/editor";
import { Btn, C } from "./ui";
export function Toast() {
  const toast = useEditor((s) => s.toast);
  if (!toast) return null;
  return (
    <div role="status" style={{ position: "fixed", left: "50%", bottom: 20, transform: "translateX(-50%)", zIndex: 300, background: "#1c1c1a", border: `1px solid ${C.line}`, color: C.text, borderRadius: 12, padding: "10px 14px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 12px 40px rgba(0,0,0,.5)", fontSize: 13 }}>
      <span>{toast.msg}</span>
      {toast.undo ? <Btn variant="gold" small onClick={() => { toast.undo?.(); useEditor.setState({ toast: null }); }}>Undo</Btn> : null}
    </div>
  );
}
