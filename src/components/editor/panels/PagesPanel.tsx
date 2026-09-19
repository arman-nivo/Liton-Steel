"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store/editor";
import { Btn, C, Field, Input, Toggle } from "../ui";
import { blankTemplate } from "@/lib/content/templates";
import { slugify, uid } from "@/lib/utils";
import type { Page } from "@/lib/schema/types";

export function PagesPanel() {
  const site = useEditor((s) => s.site)!;
  const pageId = useEditor((s) => s.pageId);
  const setPage = useEditor((s) => s.setPage);
  const addPage = useEditor((s) => s.addPage);
  const deletePage = useEditor((s) => s.deletePage);
  const mutate = useEditor((s) => s.mutate);
  const locale = useEditor((s) => s.locale);
  const [title, setTitle] = useState("");
  const cur = site.pages.find((p) => p.id === pageId) ?? site.pages[0];
  const create = () => {
    if (!title.trim()) return;
    const p: Page = { id: uid(), type: "Page", name: title.trim(), props: { slug: slugify(title), title: { en: title.trim() } }, style: { base: {} }, children: [blankTemplate()] };
    addPage(p); setTitle("");
  };
  return (
    <div style={{ padding: 10, display: "grid", gap: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim }}>Pages</div>
      {site.pages.map((p) => (
        <button key={p.id} onClick={() => setPage(p.id)} style={{ textAlign: "left", background: p.id === cur.id ? "rgba(248,219,99,.16)" : "transparent", color: p.id === cur.id ? C.gold : C.text, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
          <div style={{ fontWeight: 600 }}>{p.name ?? p.props.slug}</div>
          <div style={{ fontSize: 11, color: C.dim }}>/{p.props.slug === "home" ? "" : p.props.slug} · {p.children.length} sections</div>
        </button>
      ))}
      <div style={{ display: "flex", gap: 6 }}>
        <Input placeholder="New page title" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") create(); }} />
        <Btn variant="gold" onClick={create}>Add</Btn>
      </div>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
        <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Page settings · {cur.name}</div>
        <Field label="Name"><Input value={cur.name ?? ""} onChange={(e) => mutate((d) => { const p = d.pages.find((x) => x.id === cur.id)!; p.name = e.target.value; })} /></Field>
        <Field label="Slug (URL)"><Input value={cur.props.slug} disabled={["home", "projects"].includes(cur.props.slug)} onChange={(e) => mutate((d) => { const p = d.pages.find((x) => x.id === cur.id)!; p.props.slug = slugify(e.target.value); })} /></Field>
        <Field label={`SEO title (${locale.toUpperCase()})`}><Input value={cur.props.title?.[locale] ?? ""} placeholder={cur.computed?.title} onChange={(e) => mutate((d) => { const p = d.pages.find((x) => x.id === cur.id)!; p.props.title = { ...(p.props.title ?? { en: "" }), [locale]: e.target.value }; })} /></Field>
        <Field label={`SEO description (${locale.toUpperCase()})`} hint={cur.computed?.description ? `Auto: ${String(cur.computed.description).slice(0, 80)}…` : undefined}><Input value={cur.props.description?.[locale] ?? ""} onChange={(e) => mutate((d) => { const p = d.pages.find((x) => x.id === cur.id)!; p.props.description = { ...(p.props.description ?? { en: "" }), [locale]: e.target.value }; })} /></Field>
        <Toggle checked={!!cur.props.noindex} onChange={(v) => mutate((d) => { const p = d.pages.find((x) => x.id === cur.id)!; p.props.noindex = v; })} label="Hide from search engines" />
        {!["home", "projects"].includes(cur.props.slug) ? <div style={{ marginTop: 10 }}><Btn variant="danger" onClick={() => { if (confirm(`Delete page "${cur.name}"?`)) deletePage(cur.id); }}>Delete page</Btn></div> : null}
      </div>
    </div>
  );
}
