"use client";
import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor } from "@/lib/store/editor";
import type { Node } from "@/lib/schema/types";
import { CONTAINER_TYPES } from "@/lib/schema/types";
import { C } from "../ui";
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, GripVertical } from "lucide-react";

export function LayersPanel() {
  const page = useEditor((s) => s.page());
  if (!page) return null;
  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim, padding: "6px 8px" }}>Layers · {page.name}</div>
      <Branch parent={page as Node} depth={0} />
    </div>
  );
}

function Branch({ parent, depth }: { parent: Node; depth: number }) {
  const moveNode = useEditor((s) => s.moveNode);
  const kids = parent.children ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = kids.findIndex((k) => k.id === active.id), to = kids.findIndex((k) => k.id === over.id);
    if (from < 0 || to < 0) return;
    const order = arrayMove(kids, from, to);
    moveNode(String(active.id), parent.id, order.findIndex((k) => k.id === active.id) + (to > from ? 1 : 0));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={kids.map((k) => k.id)} strategy={verticalListSortingStrategy}>
        {kids.map((k) => <Row key={k.id} node={k} depth={depth} />)}
      </SortableContext>
    </DndContext>
  );
}

function Row({ node, depth }: { node: Node; depth: number }) {
  const selectedId = useEditor((s) => s.selectedId);
  const hoverId = useEditor((s) => s.hoverId);
  const select = useEditor((s) => s.select);
  const hover = useEditor((s) => s.hover);
  const updateNode = useEditor((s) => s.updateNode);
  const [open, setOpen] = useState(depth < 1);
  const [renaming, setRenaming] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });
  const isContainer = CONTAINER_TYPES.includes(node.type) && (node.children?.length ?? 0) > 0;
  const hidden = node.visibility && !node.visibility.desktop && !node.visibility.tablet && !node.visibility.mobile;
  const sel = selectedId === node.id;
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}>
      <div onClick={(e) => { e.stopPropagation(); select(node.id); document.querySelector(`[data-node-id="${node.id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }); }} onMouseEnter={() => hover(node.id)} onMouseLeave={() => hover(null)} onDoubleClick={() => setRenaming(true)}
        style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 6px 3px 4px", paddingLeft: 4 + depth * 14, borderRadius: 6, background: sel ? "rgba(248,219,99,.16)" : hoverId === node.id ? "rgba(255,255,255,.05)" : "transparent", color: sel ? C.gold : hidden ? C.dim : C.text, cursor: "pointer", fontSize: 12, minHeight: 26 }}>
        <span {...attributes} {...listeners} style={{ cursor: "grab", color: C.dim, display: "grid" }}><GripVertical size={12} /></span>
        <span onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} style={{ width: 14, display: "grid", color: C.dim }}>{isContainer ? (open ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}</span>
        {renaming ? <input autoFocus defaultValue={node.name ?? node.type} onBlur={(e) => { updateNode(node.id, (n) => { n.name = e.target.value || undefined; }); setRenaming(false); }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setRenaming(false); }} style={{ flex: 1, background: "#0f0f0e", color: C.text, border: `1px solid ${C.line}`, borderRadius: 4, fontSize: 12, padding: "1px 4px" }} onClick={(e) => e.stopPropagation()} />
          : <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name ?? node.type}<span style={{ color: C.dim, marginLeft: 6, fontSize: 10 }}>{node.name ? node.type : ""}</span></span>}
        <button title={hidden ? "Show" : "Hide on all devices"} onClick={(e) => { e.stopPropagation(); updateNode(node.id, (n) => { n.visibility = hidden ? undefined : { desktop: false, tablet: false, mobile: false }; }); }} style={ib}>{hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
        <button title={node.locked ? "Unlock" : "Lock"} onClick={(e) => { e.stopPropagation(); updateNode(node.id, (n) => { n.locked = !n.locked; }); }} style={ib}>{node.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
      </div>
      {isContainer && open ? <Branch parent={node} depth={depth + 1} /> : null}
    </div>
  );
}
const ib: React.CSSProperties = { background: "transparent", border: 0, color: "#777", cursor: "pointer", padding: 2, display: "grid" };
