"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store/editor";
import { PROJECT_CATEGORIES, type Project } from "@/lib/schema/types";
import { Btn, C, Field, Input, Modal, Select, Toggle } from "../ui";
import { L10nField, ListEditor, MediaField } from "../controls";
import { slugify, uid } from "@/lib/utils";

/** Site-level Projects collection: add, edit, reorder, bulk-add images. */
export function ProjectsEditor() {
  const site = useEditor((s) => s.site)!;
  const addProject = useEditor((s) => s.addProject);
  const updateProject = useEditor((s) => s.updateProject);
  const removeProject = useEditor((s) => s.removeProject);
  const mutate = useEditor((s) => s.mutate);
  const [open, setOpen] = useState(false);
  const list = site.collections.projects;
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.dim }}>Projects collection ({list.length})</span>
        <Btn small variant="outline" onClick={() => setOpen(true)}>Manage projects…</Btn>
      </div>
      {open ? (
        <Modal title="Projects" onClose={() => setOpen(false)} width={860}>
          <Btn variant="gold" onClick={() => addProject({ id: uid(), slug: `new-project-${uid().slice(0, 4)}`, title: { en: "New project" }, caption: { en: "" }, category: "industrial-shed", images: [] })} style={{ marginBottom: 12 }}>+ New project</Btn>
          <ListEditor items={list} onChange={(items) => mutate((d) => { d.collections.projects = items as Project[]; })} render={(p: Project) => (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <L10nField label="Title" value={p.title} onChange={(v) => updateProject(p.id, { title: v, slug: p.slug.startsWith("new-project") && v.en ? slugify(v.en) : p.slug })} />
                <Field label="Slug (URL)"><Input value={p.slug} onChange={(e) => updateProject(p.id, { slug: slugify(e.target.value) })} /></Field>
                <Field label="Category"><Select value={p.category} onChange={(e) => updateProject(p.id, { category: e.target.value as Project["category"] })} options={PROJECT_CATEGORIES.map((c) => ({ value: c.id, label: c.label.en }))} /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Field label="Year"><Input value={p.year ?? ""} onChange={(e) => updateProject(p.id, { year: e.target.value })} /></Field>
                  <Toggle checked={!!p.featured} onChange={(v) => updateProject(p.id, { featured: v })} label="Featured" />
                </div>
                <L10nField label="Location" value={p.location} onChange={(v) => updateProject(p.id, { location: v })} />
                <L10nField label="Client" value={p.client} onChange={(v) => updateProject(p.id, { client: v })} />
              </div>
              <div>
                <L10nField label="Caption" value={p.caption} onChange={(v) => updateProject(p.id, { caption: v })} multiline />
                <MediaField label="Add photos (bulk)" multiple onMultiple={(ids) => updateProject(p.id, { images: [...p.images, ...ids] })} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.images.map((m, i) => { const item = site.media.find((x) => x.id === m); return (
                    <div key={`${m}-${i}`} style={{ position: "relative" }}>
                      {item ? <img src={item.src} alt={item.alt} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6 }} /> : <div style={{ width: 64, height: 48, background: "#300", borderRadius: 6 }} />}
                      <button title="Remove" onClick={() => updateProject(p.id, { images: p.images.filter((_, j) => j !== i) })} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 9, border: 0, background: C.danger, color: "#000", fontSize: 11, cursor: "pointer" }}>×</button>
                      {i > 0 ? <button title="Move left" onClick={() => { const im = [...p.images]; [im[i - 1], im[i]] = [im[i], im[i - 1]]; updateProject(p.id, { images: im }); }} style={{ position: "absolute", bottom: -6, left: -6, width: 18, height: 18, borderRadius: 9, border: 0, background: C.gold, color: "#000", fontSize: 11, cursor: "pointer" }}>‹</button> : null}
                    </div>
                  ); })}
                </div>
                <div style={{ marginTop: 8 }}><Btn small variant="danger" onClick={() => { if (confirm(`Delete project "${p.title.en}"?`)) removeProject(p.id); }}>Delete project</Btn></div>
              </div>
            </div>
          )} />
        </Modal>
      ) : null}
    </div>
  );
}
