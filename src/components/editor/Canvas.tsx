"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "@/lib/store/editor";
import { RenderPage } from "../render/RenderNode";
import type { EditorUI } from "../render/context";
import { EditableText } from "../render/elements/EditableText";
import { ctxFor } from "../site/PublicPage";
import { ThemeStyle } from "../site/ThemeStyle";
import { findNode, findParent } from "@/lib/utils";
import type { Node } from "@/lib/schema/types";
import { C, IconBtn } from "./ui";
import { InsertionPoint } from "./InsertionPoint";
import { ArrowDown, ArrowUp, Copy, Trash2, ChevronUp } from "lucide-react";
import { applyPreset } from "@/lib/motion/presets";

const WIDTHS = { desktop: 1440, tablet: 768, mobile: 390 } as const;
const EDITOR_UI: EditorUI = { InsertionPoint, EditableText };

export function Canvas() {
  const site = useEditor((s) => s.site);
  const pageId = useEditor((s) => s.pageId);
  const locale = useEditor((s) => s.locale);
  const breakpoint = useEditor((s) => s.breakpoint);
  const zoom = useEditor((s) => s.zoom);
  const selectedId = useEditor((s) => s.selectedId);
  const editingId = useEditor((s) => s.editingId);
  const motionPreview = useEditor((s) => s.motionPreview);
  const select = useEditor((s) => s.select);
  const hover = useEditor((s) => s.hover);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; id: string } | null>(null);

  const page = useMemo(() => site?.pages.find((p) => p.id === pageId) ?? site?.pages[0], [site, pageId]);
  const ctx = useMemo(() => (site ? ctxFor(site, locale, true, EDITOR_UI) : null), [site, locale]);

  const onClick = useCallback((e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-editor-ui]")) return;
    const el = t.closest<HTMLElement>("[data-node-id]");
    const id = el?.dataset.nodeId ?? null;
    if (id && id === useEditor.getState().editingId) return;
    select(id && id !== page?.id ? id : null);
    setMenu(null);
  }, [select, page?.id]);

  const onOver = useCallback((e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-node-id]");
    hover(el?.dataset.nodeId && el.dataset.nodeId !== page?.id ? el.dataset.nodeId : null);
  }, [hover, page?.id]);

  // motion preview: replay presets on demand
  useEffect(() => {
    if (!motionPreview || !frameRef.current) return;
    const root = frameRef.current;
    root.classList.remove("ls-editing");
    root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => { delete el.dataset.animDone; el.classList.remove("is-in"); el.style.opacity = ""; });
    root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => applyPreset(el, "cinematic"));
    return () => { root.classList.add("ls-editing"); root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => { el.style.cssText = ""; el.classList.add("is-in"); }); };
  }, [motionPreview]);

  if (!site || !page || !ctx) return null;
  const width = WIDTHS[breakpoint];
  return (
    <div ref={scrollRef} onClick={onClick} onMouseOver={onOver} onContextMenu={(e) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-node-id]"); if (el?.dataset.nodeId && el.dataset.nodeId !== page.id) { e.preventDefault(); select(el.dataset.nodeId); setMenu({ x: e.clientX, y: e.clientY, id: el.dataset.nodeId }); } }}
      style={{ position: "relative", overflow: "auto", height: "100%", background: "#050505", padding: 24 }}>
      <div style={{ width: width * zoom, margin: "0 auto", minHeight: "100%" }}>
        <div ref={frameRef} className="ls-editing" style={{ width, transform: `scale(${zoom})`, transformOrigin: "top left", background: "var(--ink)", color: "var(--paper)", boxShadow: "0 0 0 1px #222, 0 30px 80px rgba(0,0,0,.6)", borderRadius: 6, overflow: "clip", position: "relative" }}>
          <ThemeStyle theme={site.theme} />
          <RenderPage key={`${page.id}-${locale}`} page={page} ctx={ctx} />
          <SelectionOverlay frame={frameRef} scroll={scrollRef} zoom={zoom} />
          {editingId ? <InlineToolbar frame={frameRef} /> : null}
        </div>
      </div>
      {menu ? <ContextMenu {...menu} onClose={() => setMenu(null)} /> : null}
      <style>{`.ls-editing [data-node-id][data-hover="true"]{outline:1px dashed rgba(248,219,99,.7);outline-offset:-1px}`}</style>
      <HoverSync selectedId={selectedId} />
    </div>
  );
}

function HoverSync({ selectedId }: { selectedId: string | null }) {
  const hoverId = useEditor((s) => s.hoverId);
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-selected]").forEach((el) => el.removeAttribute("data-selected"));
    document.querySelectorAll<HTMLElement>("[data-hover]").forEach((el) => el.removeAttribute("data-hover"));
    if (selectedId) document.querySelector<HTMLElement>(`[data-node-id="${selectedId}"]`)?.setAttribute("data-selected", "true");
    if (hoverId && hoverId !== selectedId) document.querySelector<HTMLElement>(`[data-node-id="${hoverId}"]`)?.setAttribute("data-hover", "true");
  }, [selectedId, hoverId]);
  return null;
}

/** Gold selection box with a mini toolbar and width/height resize handles. */
function SelectionOverlay({ frame, scroll, zoom }: { frame: React.RefObject<HTMLDivElement | null>; scroll: React.RefObject<HTMLDivElement | null>; zoom: number }) {
  const selectedId = useEditor((s) => s.selectedId);
  const site = useEditor((s) => s.site);
  const breakpoint = useEditor((s) => s.breakpoint);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const node = useMemo(() => { if (!site || !selectedId) return null; for (const p of site.pages) { const n = findNode(p as Node, selectedId); if (n) return n; } return null; }, [site, selectedId]);

  const measure = useCallback(() => {
    const f = frame.current; if (!f || !selectedId) { setRect(null); return; }
    const el = f.querySelector<HTMLElement>(`[data-node-id="${selectedId}"]`);
    if (!el) { setRect(null); return; }
    const fr = f.getBoundingClientRect(), r = el.getBoundingClientRect();
    setRect({ x: (r.left - fr.left) / zoom, y: (r.top - fr.top) / zoom, w: r.width / zoom, h: r.height / zoom });
  }, [frame, selectedId, zoom]);

  useEffect(() => {
    measure();
    const sc = scroll.current;
    const onScroll = () => measure();
    sc?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const mo = new MutationObserver(() => requestAnimationFrame(measure));
    if (frame.current) mo.observe(frame.current, { subtree: true, childList: true, attributes: true, characterData: true });
    const id = setInterval(measure, 500);
    return () => { sc?.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); mo.disconnect(); clearInterval(id); };
  }, [measure, scroll, frame, site]);

  const startResize = (e: React.PointerEvent, axis: "w" | "h") => {
    e.preventDefault(); e.stopPropagation();
    if (!selectedId || !rect) return;
    const st = useEditor.getState();
    const bp = breakpoint === "desktop" ? "base" : breakpoint;
    const startX = e.clientX, startY = e.clientY, w0 = rect.w, h0 = rect.h;
    const before = st.site;
    const move = (ev: PointerEvent) => {
      const dw = (ev.clientX - startX) / zoom, dh = (ev.clientY - startY) / zoom;
      useEditor.getState().mutate((d) => {
        for (const p of d.pages) { const n = findNode(p as Node, selectedId); if (n) { const s = bp === "base" ? n.style.base : (n.style[bp] ??= {}); if (axis === "w") s.width = `${Math.max(24, Math.round(w0 + dw))}px`; else s.height = `${Math.max(16, Math.round(h0 + dh))}px`; } }
      }, false);
    };
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
      // one history entry for the whole drag
      if (before) useEditor.setState((s) => ({ past: [...s.past.slice(-149), before], future: [] }));
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };

  if (!rect || !node) return null;
  const st = useEditor.getState();
  const loc = (() => { for (const p of st.site?.pages ?? []) { const l = findParent(p as Node, node.id); if (l) return l; } return null; })();
  const handle: React.CSSProperties = { position: "absolute", width: 10, height: 10, background: C.gold, border: "2px solid #0f0f0e", borderRadius: 3, pointerEvents: "auto" };
  return (
    <div data-editor-ui style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, outline: `2px solid ${C.gold}`, outlineOffset: -2, pointerEvents: "none", zIndex: 50 }}>
      <div style={{ position: "absolute", left: 0, top: -30, display: "flex", alignItems: "center", gap: 2, background: C.gold, color: "#0f0f0e", borderRadius: 8, padding: "2px 4px 2px 8px", fontSize: 11, fontWeight: 700, pointerEvents: "auto", whiteSpace: "nowrap", zIndex: 2 }}>
        <span style={{ marginRight: 4 }}>{node.name ?? node.type}</span>
        {loc && loc.parent.type !== "Page" ? <IconBtn title="Select parent" onClick={() => st.select(loc.parent.id)} style={{ width: 24, height: 24, color: "#0f0f0e" }}><ChevronUp size={14} /></IconBtn> : null}
        <IconBtn title="Move up (⌥↑)" onClick={() => st.moveSibling(node.id, -1)} style={{ width: 24, height: 24, color: "#0f0f0e" }}><ArrowUp size={14} /></IconBtn>
        <IconBtn title="Move down (⌥↓)" onClick={() => st.moveSibling(node.id, 1)} style={{ width: 24, height: 24, color: "#0f0f0e" }}><ArrowDown size={14} /></IconBtn>
        <IconBtn title="Duplicate (⌘D)" onClick={() => st.duplicateNode(node.id)} style={{ width: 24, height: 24, color: "#0f0f0e" }}><Copy size={14} /></IconBtn>
        <IconBtn title="Delete (Del)" onClick={() => st.deleteNode(node.id)} style={{ width: 24, height: 24, color: "#0f0f0e" }}><Trash2 size={14} /></IconBtn>
      </div>
      {!node.locked && node.type !== "Section" ? <>
        <div title="Drag to resize width" onPointerDown={(e) => startResize(e, "w")} style={{ ...handle, right: -6, top: "50%", marginTop: -5, cursor: "ew-resize" }} />
        <div title="Drag to resize height" onPointerDown={(e) => startResize(e, "h")} style={{ ...handle, bottom: -6, left: "50%", marginLeft: -5, cursor: "ns-resize" }} />
      </> : null}
    </div>
  );
}

/** Floating toolbar while editing text inline: bold, italic, colour spans, outline, tracking. */
function InlineToolbar({ frame }: { frame: React.RefObject<HTMLDivElement | null> }) {
  const editingId = useEditor((s) => s.editingId);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const f = frame.current; if (!f || !editingId) return;
    const el = f.querySelector<HTMLElement>(`[data-node-id="${editingId}"]`);
    if (!el) return;
    const fr = f.getBoundingClientRect(), r = el.getBoundingClientRect();
    setPos({ x: r.left - fr.left, y: r.top - fr.top - 40 });
  }, [editingId, frame]);
  if (!pos) return null;
  const wrap = (cls?: string, style?: string) => {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    if (cls) span.className = cls;
    if (style) span.setAttribute("style", style);
    try { range.surroundContents(span); } catch { const frag = range.extractContents(); span.appendChild(frag); range.insertNode(span); }
    sel.removeAllRanges(); const nr = document.createRange(); nr.selectNodeContents(span); sel.addRange(nr);
  };
  const clear = () => {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return;
    let n: globalThis.Node | null = sel.anchorNode;
    while (n && n.nodeType !== 1) n = n.parentNode;
    const el = n as HTMLElement | null;
    if (el && el.tagName === "SPAN" && el.closest(`[data-node-id]`)) el.replaceWith(...Array.from(el.childNodes));
  };
  const b: React.CSSProperties = { border: 0, background: "transparent", color: "#0f0f0e", fontWeight: 700, padding: "4px 7px", cursor: "pointer", borderRadius: 6, fontSize: 12 };
  return (
    <div data-editor-ui onMouseDown={(e) => e.preventDefault()} style={{ position: "absolute", left: Math.max(0, pos.x), top: Math.max(0, pos.y), zIndex: 60, background: C.gold, borderRadius: 8, display: "flex", gap: 2, padding: 2, boxShadow: "0 8px 30px rgba(0,0,0,.5)" }}>
      <button style={b} title="Bold" onClick={() => document.execCommand("bold")}>B</button>
      <button style={{ ...b, fontStyle: "italic" }} title="Italic" onClick={() => document.execCommand("italic")}>I</button>
      <button style={b} title="Gold" onClick={() => wrap("gold")}>Gold</button>
      <button style={b} title="White" onClick={() => wrap("paper")}>White</button>
      <button style={b} title="Outline" onClick={() => wrap("outline")}>Outline</button>
      <button style={b} title="Tighter tracking" onClick={() => wrap(undefined, "letter-spacing:-0.04em")}>A‹›</button>
      <button style={b} title="Wider tracking" onClick={() => wrap(undefined, "letter-spacing:0.12em")}>A‹ ›</button>
      <button style={b} title="Clear formatting" onClick={clear}>✕</button>
    </div>
  );
}

function ContextMenu({ x, y, id, onClose }: { x: number; y: number; id: string; onClose: () => void }) {
  const st = useEditor.getState();
  const items: [string, () => void][] = [
    ["Duplicate  ⌘D", () => st.duplicateNode(id)],
    ["Delete  Del", () => st.deleteNode(id)],
    ["Copy style  ⌥⌘C", () => st.copyStyle(id)],
    ["Paste style  ⌥⌘V", () => st.pasteStyle(id)],
    ["Group  ⌘G", () => st.groupNode(id)],
    ["Move up  ⌥↑", () => st.moveSibling(id, -1)],
    ["Move down  ⌥↓", () => st.moveSibling(id, 1)],
  ];
  useEffect(() => { const h = () => onClose(); window.addEventListener("click", h); return () => window.removeEventListener("click", h); }, [onClose]);
  return (
    <div data-editor-ui style={{ position: "fixed", left: x, top: y, zIndex: 400, background: "#1c1c1a", border: `1px solid ${C.line}`, borderRadius: 10, padding: 4, minWidth: 190, boxShadow: "0 12px 40px rgba(0,0,0,.6)" }}>
      {items.map(([label, fn]) => <button key={label} type="button" onClick={() => { fn(); onClose(); }} style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", border: 0, color: C.text, padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>{label}</button>)}
    </div>
  );
}
