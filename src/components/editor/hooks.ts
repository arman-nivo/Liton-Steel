"use client";
import { useEffect, useRef } from "react";
import { useEditor } from "@/lib/store/editor";

/** Autosave the draft ~2s after the last change. */
export function useAutosave() {
  const site = useEditor((s) => s.site);
  const dirty = useEditor((s) => s.dirty);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!dirty || !site) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const st = useEditor.getState();
      st.setSaving("saving");
      try {
        const r = await fetch("/api/site", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(st.site) });
        st.markSaved(r.ok);
        if (!r.ok && r.status === 401) window.location.href = "/admin?next=/edit";
      } catch { st.markSaved(false); }
    }, 2000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [site, dirty]);
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => { if (useEditor.getState().dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);
}

export async function saveNow() {
  const st = useEditor.getState();
  if (!st.site) return false;
  st.setSaving("saving");
  const r = await fetch("/api/site", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(st.site) }).catch(() => null);
  st.markSaved(!!r?.ok);
  return !!r?.ok;
}

const isTyping = () => { const el = document.activeElement as HTMLElement | null; return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)); };

/** Keyboard shortcuts: ⌘Z/⇧⌘Z undo-redo, ⌘D duplicate, Del delete, ⌥⌘C/V copy-paste style, ⌘G group, ⌘S save, Esc. */
export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useEditor.getState();
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === "Escape") { if (st.editingId) st.setEditing(null); else st.select(null); return; }
      if (isTyping()) return;
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) st.redo(); else st.undo(); return; }
      if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); st.redo(); return; }
      if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); saveNow(); return; }
      const id = st.selectedId; if (!id) return;
      if (e.key === "Enter" && !mod) {
        // Enter starts inline text editing on the selected block (keyboard alternative to double-click)
        const el = document.querySelector<HTMLElement>(`[data-node-id="${id}"]`);
        if (el && ["Heading", "Text", "RichText", "Label", "Quote"].includes(el.dataset.type ?? "")) { e.preventDefault(); st.setEditing(id); }
        return;
      }
      if (mod && e.key.toLowerCase() === "d") { e.preventDefault(); st.duplicateNode(id); return; }
      if (mod && e.key.toLowerCase() === "g") { e.preventDefault(); st.groupNode(id); return; }
      if (mod && e.altKey && e.key.toLowerCase() === "c") { e.preventDefault(); st.copyStyle(id); return; }
      if (mod && e.altKey && e.key.toLowerCase() === "v") { e.preventDefault(); st.pasteStyle(id); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && !mod) { e.preventDefault(); st.deleteNode(id); return; }
      if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); st.moveSibling(id, -1); return; }
      if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); st.moveSibling(id, 1); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
