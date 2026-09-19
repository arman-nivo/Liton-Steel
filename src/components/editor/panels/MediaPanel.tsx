"use client";
import { useMemo, useRef, useState } from "react";
import { useEditor, selectNode } from "@/lib/store/editor";
import { Btn, C, Field, Input, Select } from "../ui";
import type { MediaItem } from "@/lib/schema/types";
import { Upload } from "lucide-react";

export function MediaPanel({ pick, onPick }: { pick?: boolean; onPick?: (ids: string[]) => void } = {}) {
  const site = useEditor((s) => s.site)!;
  const addMedia = useEditor((s) => s.addMedia);
  const updateMedia = useEditor((s) => s.updateMedia);
  const removeMedia = useEditor((s) => s.removeMedia);
  const replaceEverywhere = useEditor((s) => s.replaceMediaEverywhere);
  const updateProps = useEditor((s) => s.updateProps);
  const showToast = useEditor((s) => s.showToast);
  const selected = useEditor(selectNode);
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("all");
  const [cur, setCur] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [replaceWith, setReplaceWith] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const folders = useMemo(() => ["all", ...Array.from(new Set(site.media.map((m) => m.folder ?? "other")))], [site.media]);
  const list = useMemo(() => site.media.filter((m) => (folder === "all" || (m.folder ?? "other") === folder) && (!q || m.id.includes(q.toLowerCase()) || m.alt.toLowerCase().includes(q.toLowerCase()))), [site.media, folder, q]);
  const item = site.media.find((m) => m.id === cur) ?? null;

  const upload = async (files: FileList | File[]) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    setBusy(true);
    const r = await fetch("/api/media", { method: "POST", body: fd });
    setBusy(false);
    if (!r.ok) { showToast("Upload failed"); return; }
    const { items } = (await r.json()) as { items: MediaItem[] };
    addMedia(items);
    showToast(`${items.length} image${items.length === 1 ? "" : "s"} uploaded`);
    if (items.some((i) => i.lowRes)) showToast("Some images are under 1000px wide and may look soft in large slots.");
    if (pick && onPick) onPick(items.map((i) => i.id));
  };

  const canApply = selected && ["Image", "PersonCard"].includes(selected.type);
  return (
    <div style={{ padding: 10, display: "grid", gap: 10 }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) upload(e.dataTransfer.files); }}>
      <div style={{ display: "flex", gap: 6 }}>
        <Input placeholder="Search media…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={folder} onChange={(e) => setFolder(e.target.value)} options={folders.map((f) => ({ value: f, label: f }))} style={{ width: 110 }} />
      </div>
      <Btn variant="outline" onClick={() => fileRef.current?.click()} disabled={busy} style={{ justifyContent: "center" }}><Upload size={14} />{busy ? "Processing…" : "Upload images (or drop here)"}</Btn>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) upload(e.target.files); e.target.value = ""; }} />
      {pick ? <Btn variant="gold" disabled={!picked.length} onClick={() => onPick?.(picked)}>Use {picked.length} selected</Btn> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {list.map((m) => {
          const on = pick ? picked.includes(m.id) : cur === m.id;
          return (
            <button key={m.id} title={m.id} onClick={() => { if (pick) setPicked((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id])); else setCur(m.id); }} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: `2px solid ${on ? C.gold : "transparent"}`, padding: 0, background: "#000", cursor: "pointer" }}>
              <img src={m.src} alt={m.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {m.lowRes ? <span style={{ position: "absolute", top: 3, left: 3, background: C.danger, color: "#000", fontSize: 9, borderRadius: 4, padding: "1px 4px" }}>low-res</span> : null}
            </button>
          );
        })}
      </div>
      {item && !pick ? (
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 8, cursor: "crosshair" }} title="Click to set the focal point" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); updateMedia(item.id, { focal: [Math.round(((e.clientX - r.left) / r.width) * 100) / 100, Math.round(((e.clientY - r.top) / r.height) * 100) / 100] }); }}>
            <img src={item.src} alt={item.alt} style={{ width: "100%", display: "block" }} />
            <span style={{ position: "absolute", left: `${(item.focal?.[0] ?? 0.5) * 100}%`, top: `${(item.focal?.[1] ?? 0.5) * 100}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: 8, border: `2px solid ${C.gold}`, boxShadow: "0 0 0 2px #000" }} />
          </div>
          <div style={{ fontSize: 11, color: C.dim, marginBottom: 6 }}>{item.id} · {item.width}×{item.height}{item.bytes ? ` · ${Math.round(item.bytes / 1024)} KB` : ""} · brightness {Math.round((item.brightness ?? 0) * 100)}%</div>
          <Field label="Alt text (required for publishing)"><Input value={item.alt} onChange={(e) => updateMedia(item.id, { alt: e.target.value })} /></Field>
          <Field label="Folder"><Input value={item.folder ?? ""} onChange={(e) => updateMedia(item.id, { folder: e.target.value })} /></Field>
          {canApply ? <Btn variant="gold" onClick={() => updateProps(selected!.id, { media: item.id })} style={{ marginBottom: 8 }}>Use for selected {selected!.type}</Btn> : null}
          <Field label="Replace everywhere with…">
            <div style={{ display: "flex", gap: 6 }}>
              <Select value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} options={[{ value: "", label: "Choose image" }, ...site.media.filter((m) => m.id !== item.id).map((m) => ({ value: m.id, label: m.id }))]} />
              <Btn variant="outline" disabled={!replaceWith} onClick={() => { replaceEverywhere(item.id, replaceWith); showToast(`Replaced ${item.id} everywhere`); }}>Go</Btn>
            </div>
          </Field>
          <Btn variant="danger" onClick={async () => { if (!confirm(`Remove ${item.id} from the library?`)) return; if (item.src.startsWith("/uploads/") || item.src.includes("/object/public/")) await fetch("/api/media", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ src: item.src }) }); removeMedia(item.id); setCur(null); }}>Delete from library</Btn>
        </div>
      ) : null}
    </div>
  );
}
