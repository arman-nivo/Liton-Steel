"use client";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useEditor } from "@/lib/store/editor";
import { COLOR_TOKENS, TYPE_SIZE_KEYS, FONTS } from "@/lib/schema/tokens";
import type { L10n, Locale } from "@/lib/schema/types";
import { Btn, C, Field, Input, Modal, Select, TextArea } from "./ui";
import { MediaPanel } from "./panels/MediaPanel";
import { stripHtml } from "@/lib/utils";

/** Colour: token chips + hex picker + opacity-free raw value. */
export function ColorField({ label, value, onChange, overridden, onReset, allowNone = true }: { label: string; value?: string; onChange: (v: string | undefined) => void; overridden?: boolean; onReset?: () => void; allowNone?: boolean }) {
  const site = useEditor((s) => s.site)!;
  const [open, setOpen] = useState(false);
  const isTok = value?.startsWith("token:");
  const hex = isTok ? (site.theme.colors as any)[value!.slice(6)] : value && /^#/.test(value) ? value : "#000000";
  return (
    <Field label={label} overridden={overridden} onReset={onReset}>
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
        {COLOR_TOKENS.map((k) => <button key={k} type="button" title={k} onClick={() => onChange(`token:${k}`)} style={{ width: 20, height: 20, borderRadius: 10, border: value === `token:${k}` ? `2px solid ${C.gold}` : "1px solid #444", background: (site.theme.colors as any)[k], cursor: "pointer", padding: 0 }} />)}
        <button type="button" onClick={() => setOpen((o) => !o)} title="Custom colour" style={{ width: 20, height: 20, borderRadius: 4, border: !isTok && value ? `2px solid ${C.gold}` : "1px solid #444", background: !isTok && value ? value : "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)", cursor: "pointer", padding: 0 }} />
        {allowNone ? <Btn small onClick={() => onChange(undefined)} title="Inherit">–</Btn> : null}
      </div>
      {open ? <div style={{ marginTop: 6 }}><HexColorPicker color={hex} onChange={(c) => onChange(c)} style={{ width: "100%", height: 120 }} /><Input value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} placeholder="#hex or css colour" style={{ marginTop: 6 }} /></div> : null}
    </Field>
  );
}

export function SizeField({ label, value, onChange, overridden, onReset }: { label: string; value?: string; onChange: (v: string | undefined) => void; overridden?: boolean; onReset?: () => void }) {
  const tok = value?.startsWith("token:") ? value : value ? "custom" : "";
  return (
    <Field label={label} overridden={overridden} onReset={onReset}>
      <div style={{ display: "flex", gap: 6 }}>
        <Select value={tok} onChange={(e) => onChange(e.target.value === "custom" ? "16px" : e.target.value || undefined)} options={[{ value: "", label: "Inherit" }, ...TYPE_SIZE_KEYS.map((k) => ({ value: `token:${k}`, label: k })), { value: "custom", label: "Custom…" }]} />
        {tok === "custom" ? <Input value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} placeholder="e.g. 48px / clamp()" /> : null}
      </div>
    </Field>
  );
}

export function FontField({ label, value, onChange, overridden, onReset }: { label: string; value?: string; onChange: (v: string | undefined) => void; overridden?: boolean; onReset?: () => void }) {
  const tokens = [["display", "Display (Archivo Black)"], ["display2", "Display 2 (League Spartan)"], ["body", "Body (Glacial/Jost)"], ["label", "Label (DM Sans)"], ["digit", "Digits (Michroma)"], ["bangla", "Bangla (Hind Siliguri)"]];
  const raw = value && !value.startsWith("token:");
  return (
    <Field label={label} overridden={overridden} onReset={onReset}>
      <Select value={raw ? "custom" : value ?? ""} onChange={(e) => onChange(e.target.value === "custom" ? "Georgia, serif" : e.target.value || undefined)} options={[{ value: "", label: "Inherit" }, ...tokens.map(([v, l]) => ({ value: `token:${v}`, label: l })), ...Object.values(FONTS).map((f) => ({ value: f.css, label: f.label })), { value: "custom", label: "Custom family…" }]} />
      {raw ? <Input value={value} onChange={(e) => onChange(e.target.value)} style={{ marginTop: 6 }} /> : null}
    </Field>
  );
}

/** Bilingual text field (EN + BN). */
export function L10nField({ label, value, onChange, multiline, rich }: { label: string; value?: L10n; onChange: (v: L10n) => void; multiline?: boolean; rich?: boolean }) {
  const [tab, setTab] = useState<Locale>(useEditor.getState().locale);
  const v = value ?? { en: "" };
  const cur = v[tab] ?? "";
  const set = (s: string) => onChange({ ...v, [tab]: s });
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: C.dim, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ display: "inline-flex", gap: 2 }}>{(["en", "bn"] as Locale[]).map((l) => <button key={l} type="button" onClick={() => setTab(l)} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, border: 0, background: tab === l ? "rgba(248,219,99,.2)" : "transparent", color: tab === l ? C.gold : C.dim, cursor: "pointer" }}>{l.toUpperCase()}{!v[l] ? " ·" : ""}</button>)}</span>
      </div>
      {multiline || rich ? <TextArea value={cur} onChange={(e) => set(e.target.value)} lang={tab} style={{ minHeight: rich ? 110 : 70 }} /> : <Input value={cur} onChange={(e) => set(e.target.value)} lang={tab} />}
      {rich ? <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>HTML allowed: &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;span class="gold|outline|paper"&gt;. Or double-click the text on the canvas. Plain: {stripHtml(cur).slice(0, 40)}</div> : null}
    </div>
  );
}

/** Media picker button → opens the library in a modal. */
export function MediaField({ label, value, onChange, multiple, onMultiple }: { label: string; value?: string; onChange?: (id: string | undefined) => void; multiple?: boolean; onMultiple?: (ids: string[]) => void }) {
  const site = useEditor((s) => s.site)!;
  const [open, setOpen] = useState(false);
  const m = site.media.find((x) => x.id === value);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {m ? <img src={m.src} alt={m.alt} style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 6 }} /> : <div style={{ width: 56, height: 42, borderRadius: 6, background: "#0f0f0e", border: `1px dashed ${C.line}` }} />}
        <div style={{ display: "grid", gap: 4 }}>
          <Btn variant="outline" small onClick={() => setOpen(true)}>{multiple ? "Add images…" : "Choose image…"}</Btn>
          {value && onChange ? <Btn small variant="danger" onClick={() => onChange(undefined)}>Remove</Btn> : null}
        </div>
      </div>
      {open ? <Modal title="Media library" onClose={() => setOpen(false)} width={760}><MediaPanel pick onPick={(ids) => { if (multiple) onMultiple?.(ids); else onChange?.(ids[0]); setOpen(false); }} /></Modal> : null}
    </div>
  );
}

/** Generic sortable list editor for collections (items with id). */
export function ListEditor<T extends { id: string }>({ items, onChange, render, add, label, addLabel = "Add item" }: { items: T[]; onChange: (items: T[]) => void; render: (item: T, update: (patch: Partial<T> & Record<string, any>) => void, index: number) => React.ReactNode; add?: () => T; label?: string; addLabel?: string }) {
  const move = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= items.length) return; const arr = [...items]; [arr[i], arr[j]] = [arr[j], arr[i]]; onChange(arr); };
  return (
    <div style={{ marginBottom: 10 }}>
      {label ? <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>{label} ({items.length})</div> : null}
      <div style={{ display: "grid", gap: 6 }}>
        {items.map((it, i) => (
          <div key={it.id} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, background: "#0f0f0e" }}>
            {render(it, (patch) => onChange(items.map((x) => (x.id === it.id ? { ...x, ...patch } : x))), i)}
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <Btn small onClick={() => move(i, -1)} disabled={i === 0}>↑</Btn>
              <Btn small onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</Btn>
              <Btn small variant="danger" onClick={() => onChange(items.filter((x) => x.id !== it.id))}>Remove</Btn>
            </div>
          </div>
        ))}
      </div>
      {add ? <Btn variant="outline" small onClick={() => onChange([...items, add()])} style={{ marginTop: 6 }}>{addLabel}</Btn> : null}
    </div>
  );
}
