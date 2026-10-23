"use client";
import { useEffect, useMemo, useRef } from "react";
import { useEditor } from "@/lib/store/editor";
import { sanitizeHtml } from "@/lib/utils";
import type { Locale } from "@/lib/schema/types";

export interface EditableTextProps extends React.HTMLAttributes<HTMLElement> {
  nodeId: string;
  field?: string;
  locale: Locale;
  html: string;
  tag: keyof React.JSX.IntrinsicElements;
}

/** Inline (double-click) text editing for headings, paragraphs and rich text. */
export function EditableText({ nodeId, field = "text", locale, html, tag, ...rest }: EditableTextProps) {
  const editing = useEditor((s) => s.editingId === nodeId);
  const setEditing = useEditor((s) => s.setEditing);
  const updateNode = useEditor((s) => s.updateNode);
  const ref = useRef<HTMLElement>(null);
  const Tag = tag as any;
  // React 19 re-sets innerHTML whenever this object identity changes — keep it stable per html string
  const inner = useMemo(() => ({ __html: html }), [html]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const sel = window.getSelection();
      if (sel && ref.current.childNodes.length) { const r = document.createRange(); r.selectNodeContents(ref.current); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
    }
  }, [editing]);

  const commit = () => {
    if (!ref.current) return;
    const clean = sanitizeHtml(ref.current.innerHTML).replace(/<div>/g, "<br>").replace(/<\/div>/g, "");
    updateNode(nodeId, (n) => {
      const cur = n.props[field];
      if (cur && typeof cur === "object") n.props[field] = { ...cur, [locale]: clean };
      else n.props[field] = { [locale]: clean };
    });
    setEditing(null);
  };

  return (
    <Tag
      {...rest}
      ref={ref}
      contentEditable={editing || undefined}
      suppressContentEditableWarning
      spellCheck={false}
      onDoubleClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditing(nodeId); }}
      onBlur={editing ? commit : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (!editing) return;
        e.stopPropagation();
        if (e.key === "Escape") { e.preventDefault(); commit(); }
        if (e.key === "Enter" && !e.shiftKey && tag !== "div") { e.preventDefault(); document.execCommand("insertLineBreak"); }
      }}
      onPaste={(e: React.ClipboardEvent) => { if (!editing) return; e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); }}
      dangerouslySetInnerHTML={inner}
    />
  );
}
