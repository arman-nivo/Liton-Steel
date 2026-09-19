"use client";
import { create } from "zustand";
import { produce } from "immer";
import type { Adjustment, Animation, Breakpoint, Device, Locale, MediaItem, Node, NodeStyle, Page, Project, Site, StyleProps, Theme, Warning } from "../schema/types";
import { cloneWithNewIds, findNode, findParent, uid } from "../utils";
import { optimize } from "../optimize";
import type { Role } from "../session";

export type Panel = "layers" | "pages" | "templates" | "media";
export type InspectorTab = "content" | "style" | "layout" | "motion" | "advanced";

export interface EditorState {
  site: Site | null;
  role: Role;
  pageId: string | null;
  selectedId: string | null;
  hoverId: string | null;
  editingId: string | null;
  breakpoint: Device;
  locale: Locale;
  zoom: number;
  motionPreview: boolean;
  past: Site[];
  future: Site[];
  dirty: boolean;
  saving: "idle" | "saving" | "saved" | "error";
  publishing: boolean;
  lastSavedAt?: string;
  warnings: Warning[];
  adjustments: Adjustment[];
  panel: Panel;
  inspectorTab: InspectorTab;
  modal: null | "theme" | "optimize" | "versions" | "publish";
  clipboardStyle: NodeStyle | null;
  toast: { id: number; msg: string; undo?: () => void } | null;

  load(site: Site, role: Role): void;
  mutate(fn: (draft: Site) => void, history?: boolean): void;
  page(): Page | null;
  select(id: string | null): void;
  hover(id: string | null): void;
  setEditing(id: string | null): void;
  updateNode(id: string, fn: (n: Node) => void): void;
  updateProps(id: string, patch: Record<string, unknown>): void;
  updateStyle(id: string, bp: Breakpoint, patch: Partial<StyleProps>): void;
  clearStyle(id: string, bp: Breakpoint, key: keyof StyleProps): void;
  setAnimation(id: string, anim: Animation | undefined): void;
  insertNode(parentId: string, index: number, node: Node): void;
  deleteNode(id: string): void;
  duplicateNode(id: string): void;
  moveNode(id: string, parentId: string, index: number): void;
  moveSibling(id: string, dir: -1 | 1): void;
  groupNode(id: string): void;
  copyStyle(id: string): void;
  pasteStyle(id: string): void;
  undo(): void;
  redo(): void;
  setTheme(patch: Partial<Theme> | ((t: Theme) => void)): void;
  setPage(id: string): void;
  addPage(page: Page): void;
  deletePage(id: string): void;
  addMedia(items: MediaItem[]): void;
  updateMedia(id: string, patch: Partial<MediaItem>): void;
  removeMedia(id: string): void;
  replaceMediaEverywhere(fromId: string, toId: string): void;
  addProject(p: Project): void;
  updateProject(id: string, patch: Partial<Project>): void;
  removeProject(id: string): void;
  reorderProjects(from: number, to: number): void;
  setBreakpoint(b: Device): void;
  setLocale(l: Locale): void;
  setZoom(z: number): void;
  setPanel(p: Panel): void;
  setInspectorTab(t: InspectorTab): void;
  setModal(m: EditorState["modal"]): void;
  setMotionPreview(v: boolean): void;
  showToast(msg: string, undo?: () => void): void;
  markSaved(ok: boolean): void;
  setSaving(s: EditorState["saving"]): void;
  setPublishing(v: boolean): void;
  applyOptimizedSite(site: Site): void;
}

const HISTORY_LIMIT = 150;
const viewportFor = (b: Device) => (b === "mobile" ? 390 : b === "tablet" ? 768 : 1440);

export const useEditor = create<EditorState>((set, get) => ({
  site: null, role: "editor", pageId: null, selectedId: null, hoverId: null, editingId: null,
  breakpoint: "desktop", locale: "en", zoom: 1, motionPreview: false,
  past: [], future: [], dirty: false, saving: "idle", publishing: false,
  warnings: [], adjustments: [], panel: "layers", inspectorTab: "content", modal: null, clipboardStyle: null, toast: null,

  load(site, role) {
    const r = optimize(site, viewportFor(get().breakpoint));
    set({ site: r.site, role, pageId: site.pages[0]?.id ?? null, past: [], future: [], dirty: false, warnings: r.warnings, adjustments: r.adjustments });
  },
  mutate(fn, history = true) {
    const cur = get().site;
    if (!cur) return;
    const next = produce(cur, (d) => { fn(d); d.updatedAt = new Date().toISOString(); });
    if (next === cur) return;
    const r = optimize(next, viewportFor(get().breakpoint));
    set((s) => ({
      site: r.site, warnings: r.warnings, adjustments: r.adjustments, dirty: true, saving: "idle",
      past: history ? [...s.past.slice(-HISTORY_LIMIT + 1), cur] : s.past,
      future: history ? [] : s.future,
    }));
  },
  page() { const s = get(); return s.site?.pages.find((p) => p.id === s.pageId) ?? s.site?.pages[0] ?? null; },
  select(id) { set({ selectedId: id, editingId: null }); },
  hover(id) { if (get().hoverId !== id) set({ hoverId: id }); },
  setEditing(id) { set({ editingId: id }); },
  updateNode(id, fn) { get().mutate((d) => { const n = findNode(get().page()! as Node, id) && findNodeInSite(d, id); if (n) fn(n); }); },
  updateProps(id, patch) { get().updateNode(id, (n) => { Object.assign(n.props, patch); }); },
  updateStyle(id, bp, patch) {
    get().updateNode(id, (n) => {
      if (bp === "base") n.style.base = { ...n.style.base, ...patch };
      else n.style[bp] = { ...(n.style[bp] ?? {}), ...patch };
    });
  },
  clearStyle(id, bp, key) { get().updateNode(id, (n) => { const s = bp === "base" ? n.style.base : n.style[bp]; if (s) delete s[key]; }); },
  setAnimation(id, anim) { get().updateNode(id, (n) => { if (anim) n.animation = anim; else delete n.animation; }); },
  insertNode(parentId, index, node) {
    get().mutate((d) => { const p = findNodeInSite(d, parentId); if (!p) return; p.children = p.children ?? []; p.children.splice(Math.max(0, Math.min(index, p.children.length)), 0, node); });
    set({ selectedId: node.id });
  },
  deleteNode(id) {
    const s = get();
    const page = s.page();
    if (!page) return;
    const loc = findParent(page as Node, id);
    if (!loc) return;
    const removed = loc.parent.children![loc.index];
    const parentId = loc.parent.id, index = loc.index;
    s.mutate((d) => { const p = findNodeInSite(d, parentId); p?.children?.splice(index, 1); });
    set({ selectedId: null, editingId: null });
    s.showToast(`Deleted ${removed.name ?? removed.type}`, () => { get().insertNode(parentId, index, removed); });
  },
  duplicateNode(id) {
    const page = get().page(); if (!page) return;
    const loc = findParent(page as Node, id); if (!loc) return;
    const copy = cloneWithNewIds(loc.parent.children![loc.index]);
    if (copy.anchor) copy.anchor = `${copy.anchor}-${uid().slice(0, 4)}`;
    get().insertNode(loc.parent.id, loc.index + 1, copy);
  },
  moveNode(id, parentId, index) {
    if (id === parentId) return;
    get().mutate((d) => {
      const page = d.pages.find((p) => p.id === get().pageId) ?? d.pages[0];
      const loc = findParent(page as Node, id); if (!loc) return;
      const target = findNodeInSite(d, parentId); if (!target) return;
      // prevent dropping into own subtree
      if (findNode(loc.parent.children![loc.index], parentId)) return;
      const [n] = loc.parent.children!.splice(loc.index, 1);
      target.children = target.children ?? [];
      let i = index;
      if (loc.parent.id === parentId && loc.index < index) i -= 1;
      target.children.splice(Math.max(0, Math.min(i, target.children.length)), 0, n);
    });
  },
  moveSibling(id, dir) {
    const page = get().page(); if (!page) return;
    const loc = findParent(page as Node, id); if (!loc) return;
    const to = loc.index + dir;
    if (to < 0 || to >= loc.parent.children!.length) return;
    get().mutate((d) => { const p = findNodeInSite(d, loc.parent.id); if (!p?.children) return; const [n] = p.children.splice(loc.index, 1); p.children.splice(to, 0, n); });
  },
  groupNode(id) {
    const page = get().page(); if (!page) return;
    const loc = findParent(page as Node, id); if (!loc) return;
    const gid = uid();
    get().mutate((d) => {
      const p = findNodeInSite(d, loc.parent.id); if (!p?.children) return;
      const n = p.children[loc.index];
      p.children[loc.index] = { id: gid, type: "Stack", name: "Group", props: {}, style: { base: { display: "flex", direction: "column", gap: 2 } }, children: [n] };
    });
    set({ selectedId: gid });
  },
  copyStyle(id) { const n = findNode(get().page()! as Node, id); if (n) set({ clipboardStyle: structuredClone(n.style) }); get().showToast("Style copied"); },
  pasteStyle(id) { const cs = get().clipboardStyle; if (!cs) return; get().updateNode(id, (n) => { n.style = structuredClone(cs); }); },
  undo() { const s = get(); const prev = s.past[s.past.length - 1]; if (!prev || !s.site) return; const r = optimize(prev, viewportFor(s.breakpoint)); set({ site: r.site, warnings: r.warnings, adjustments: r.adjustments, past: s.past.slice(0, -1), future: [s.site, ...s.future].slice(0, HISTORY_LIMIT), dirty: true }); },
  redo() { const s = get(); const next = s.future[0]; if (!next || !s.site) return; const r = optimize(next, viewportFor(s.breakpoint)); set({ site: r.site, warnings: r.warnings, adjustments: r.adjustments, future: s.future.slice(1), past: [...s.past, s.site], dirty: true }); },
  setTheme(patch) { get().mutate((d) => { if (typeof patch === "function") patch(d.theme); else Object.assign(d.theme, patch); }); },
  setPage(id) { set({ pageId: id, selectedId: null, editingId: null }); },
  addPage(page) { get().mutate((d) => { d.pages.push(page); }); set({ pageId: page.id, selectedId: null }); },
  deletePage(id) { const s = get(); if ((s.site?.pages.length ?? 0) <= 1) return; s.mutate((d) => { d.pages = d.pages.filter((p) => p.id !== id); }); set({ pageId: get().site!.pages[0].id, selectedId: null }); },
  addMedia(items) { get().mutate((d) => { for (const m of items) { const i = d.media.findIndex((x) => x.id === m.id); if (i >= 0) d.media[i] = m; else d.media.unshift(m); } }); },
  updateMedia(id, patch) { get().mutate((d) => { const m = d.media.find((x) => x.id === id); if (m) Object.assign(m, patch); }); },
  removeMedia(id) { get().mutate((d) => { d.media = d.media.filter((m) => m.id !== id); }); },
  replaceMediaEverywhere(fromId, toId) {
    get().mutate((d) => {
      const visit = (n: Node) => {
        if (n.props.media === fromId) n.props.media = toId;
        if (Array.isArray(n.props.items)) for (const it of n.props.items) if (it && it.media === fromId) it.media = toId;
        if (Array.isArray(n.props.media)) n.props.media = n.props.media.map((m: string) => (m === fromId ? toId : m));
        if (n.style.base.bgMedia === fromId) n.style.base.bgMedia = toId;
        n.children?.forEach(visit);
      };
      d.pages.forEach(visit);
      for (const p of d.collections.projects) p.images = p.images.map((m) => (m === fromId ? toId : m));
    });
  },
  addProject(p) { get().mutate((d) => { d.collections.projects.unshift(p); }); },
  updateProject(id, patch) { get().mutate((d) => { const p = d.collections.projects.find((x) => x.id === id); if (p) Object.assign(p, patch); }); },
  removeProject(id) { get().mutate((d) => { d.collections.projects = d.collections.projects.filter((p) => p.id !== id); }); },
  reorderProjects(from, to) { get().mutate((d) => { const [p] = d.collections.projects.splice(from, 1); d.collections.projects.splice(to, 0, p); }); },
  setBreakpoint(b) { set({ breakpoint: b }); const s = get(); if (s.site) { const r = optimize(s.site, viewportFor(b)); set({ site: r.site, warnings: r.warnings, adjustments: r.adjustments }); } },
  setLocale(l) { set({ locale: l, editingId: null }); },
  setZoom(z) { set({ zoom: Math.min(1.5, Math.max(0.25, z)) }); },
  setPanel(p) { set({ panel: p }); },
  setInspectorTab(t) { set({ inspectorTab: t }); },
  setModal(m) { set({ modal: m }); },
  setMotionPreview(v) { set({ motionPreview: v }); },
  showToast(msg, undo) { const id = Date.now(); set({ toast: { id, msg, undo } }); setTimeout(() => { if (get().toast?.id === id) set({ toast: null }); }, 6000); },
  markSaved(ok) { set({ saving: ok ? "saved" : "error", dirty: ok ? false : get().dirty, lastSavedAt: ok ? new Date().toISOString() : get().lastSavedAt }); },
  setSaving(s) { set({ saving: s }); },
  setPublishing(v) { set({ publishing: v }); },
  applyOptimizedSite(site) { set({ site }); },
}));

function findNodeInSite(site: Site, id: string): Node | undefined {
  for (const p of site.pages) { const n = findNode(p as Node, id); if (n) return n; }
  return undefined;
}

export const selectNode = (s: EditorState) => (s.selectedId && s.site ? findNodeInSite(s.site, s.selectedId) : undefined);
