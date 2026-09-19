"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store/editor";
import { Btn, C, IconBtn, Seg } from "./ui";
import { LogoMark } from "../render/elements/media";
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Palette, Sparkles, History, Eye, LogOut, ExternalLink, Play, ZoomIn, ZoomOut } from "lucide-react";
import { saveNow } from "./hooks";
import Link from "next/link";

export function TopBar({ previewToken }: { previewToken: string }) {
  const s = useEditor();
  const [pubMsg, setPubMsg] = useState<string>("");
  const errors = s.warnings.filter((w) => w.level === "error").length;
  const warns = s.warnings.filter((w) => w.level !== "error").length;
  const page = s.page();

  const publish = async (force = false) => {
    if (s.role !== "owner") return;
    s.setPublishing(true); setPubMsg("");
    await saveNow();
    const r = await fetch("/api/publish", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ force }) });
    const j = await r.json().catch(() => ({}));
    s.setPublishing(false);
    if (r.ok) { s.showToast("Published. The live site is updating."); setPubMsg(""); }
    else if (r.status === 422) { s.setModal("optimize"); s.showToast(j.error ?? "Publish blocked"); setPubMsg("blocked"); }
    else s.showToast(j.error ?? "Publish failed");
  };

  return (
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderBottom: `1px solid ${C.line}`, background: C.panel }}>
      <Link href="/" title="Exit to site" style={{ display: "flex", alignItems: "center", gap: 8, color: C.gold, textDecoration: "none", fontWeight: 800, fontSize: 12, letterSpacing: ".06em" }}><span style={{ width: 28, height: 28, borderRadius: 14, background: C.gold, color: "#0f0f0e", display: "grid", placeItems: "center" }}><LogoMark style={{ width: "68%" }} /></span>LITON STEEL</Link>
      <span style={{ color: C.dim, fontSize: 12, marginLeft: 8 }}>Editing: <b style={{ color: C.text }}>{page?.name ?? page?.props.slug}</b></span>
      <div style={{ flex: 1 }} />
      <Seg value={s.breakpoint} onChange={s.setBreakpoint} options={[{ value: "desktop", label: <Monitor size={14} />, title: "Desktop (1440)" }, { value: "tablet", label: <Tablet size={14} />, title: "Tablet (768)" }, { value: "mobile", label: <Smartphone size={14} />, title: "Mobile (390)" }]} />
      <IconBtn title="Zoom out" onClick={() => s.setZoom(s.zoom - 0.1)}><ZoomOut size={15} /></IconBtn>
      <span style={{ fontSize: 11, color: C.dim, width: 36, textAlign: "center" }}>{Math.round(s.zoom * 100)}%</span>
      <IconBtn title="Zoom in" onClick={() => s.setZoom(s.zoom + 0.1)}><ZoomIn size={15} /></IconBtn>
      <Seg value={s.locale} onChange={s.setLocale} options={[{ value: "en", label: "EN" }, { value: "bn", label: "বাং" }]} />
      <IconBtn title="Preview motion in canvas" active={s.motionPreview} onClick={() => s.setMotionPreview(!s.motionPreview)}><Play size={15} /></IconBtn>
      <div style={{ width: 1, height: 24, background: C.line, margin: "0 4px" }} />
      <IconBtn title="Undo (⌘Z)" disabled={!s.past.length} onClick={s.undo}><Undo2 size={16} /></IconBtn>
      <IconBtn title="Redo (⇧⌘Z)" disabled={!s.future.length} onClick={s.redo}><Redo2 size={16} /></IconBtn>
      <span style={{ fontSize: 11, color: s.saving === "error" ? C.danger : C.dim, minWidth: 70 }}>{s.saving === "saving" ? "Saving…" : s.saving === "error" ? "Save failed" : s.dirty ? "Unsaved" : s.lastSavedAt ? "Saved" : ""}</span>
      <div style={{ width: 1, height: 24, background: C.line, margin: "0 4px" }} />
      <Btn onClick={() => s.setModal("theme")} title="Global theme"><Palette size={15} />Theme</Btn>
      <Btn onClick={() => s.setModal("optimize")} title="Optimization panel"><Sparkles size={15} />Optimize{errors ? <span style={{ background: C.danger, color: "#000", borderRadius: 10, padding: "0 6px", fontSize: 11 }}>{errors}</span> : warns ? <span style={{ background: "#444", borderRadius: 10, padding: "0 6px", fontSize: 11 }}>{warns}</span> : null}</Btn>
      <Btn onClick={() => s.setModal("versions")} title="Version history"><History size={15} />Versions</Btn>
      <a href={`/preview/${s.locale}?token=${previewToken}`} target="_blank" rel="noreferrer" title="Preview the draft (shareable link)" style={{ textDecoration: "none" }}><Btn><Eye size={15} />Preview</Btn></a>
      <Link href="/" target="_blank" rel="noreferrer" title="Open live site" style={{ textDecoration: "none" }}><Btn><ExternalLink size={15} /></Btn></Link>
      {s.role === "owner" ? <Btn variant="gold" disabled={s.publishing} onClick={() => publish(pubMsg === "blocked")} title={pubMsg === "blocked" ? "Publish anyway (issues will ship)" : "Publish the draft"}>{s.publishing ? "Publishing…" : pubMsg === "blocked" ? "Publish anyway" : "Publish"}</Btn> : <span style={{ fontSize: 11, color: C.dim }}>Editor role · cannot publish</span>}
      <IconBtn title="Sign out" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/admin"; }}><LogOut size={15} /></IconBtn>
    </div>
  );
}
