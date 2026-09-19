"use client";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useEditor } from "@/lib/store/editor";
import { FONTS, DEFAULT_THEME } from "@/lib/schema/tokens";
import type { FontKey, Theme } from "@/lib/schema/types";
import { Btn, C, Field, Input, Modal, Seg, Select, Toggle } from "../ui";
import { L10nField, ListEditor } from "../controls";
import { uid } from "@/lib/utils";

export function ThemePanel({ onClose }: { onClose: () => void }) {
  const site = useEditor((s) => s.site)!;
  const role = useEditor((s) => s.role);
  const setTheme = useEditor((s) => s.setTheme);
  const mutate = useEditor((s) => s.mutate);
  const [tab, setTab] = useState<"theme" | "site">("theme");
  const [pick, setPick] = useState<string | null>(null);
  const t = site.theme;
  const fonts = (group?: "display" | "body" | "bangla") => Object.entries(FONTS).filter(([, f]) => !group || f.group === group || f.group === "body").map(([k, f]) => ({ value: k, label: f.label }));
  const ro = role !== "owner";
  return (
    <Modal title="Global theme & site settings" onClose={onClose} width={820}>
      <Seg value={tab} onChange={setTab} options={[{ value: "theme", label: "Design tokens" }, { value: "site", label: "Company, nav & footer" }]} />
      {ro ? <p style={{ color: C.gold, fontSize: 12 }}>Editor role: theme changes are view-only.</p> : null}
      {tab === "theme" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16, pointerEvents: ro ? "none" : undefined, opacity: ro ? 0.7 : 1 }}>
          <div>
            <h4 style={h}>Colours</h4>
            {(Object.keys(t.colors) as (keyof Theme["colors"])[]).map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <button onClick={() => setPick(pick === k ? null : k)} style={{ width: 28, height: 28, borderRadius: 14, border: `2px solid ${pick === k ? C.gold : "#333"}`, background: t.colors[k], cursor: "pointer" }} />
                <span style={{ width: 70, fontSize: 12 }}>{k}</span>
                <HexInput value={t.colors[k]} onChange={(v) => setTheme((th) => { th.colors[k] = v; })} />
                {pick === k ? <HexColorPicker color={t.colors[k]} onChange={(c) => setTheme((th) => { th.colors[k] = c; })} style={{ width: 140, height: 100 }} /> : null}
              </div>
            ))}
            <p style={{ fontSize: 11, color: C.dim }}>The palette is black + gold + white by design; changing “gold” recolours tabs, headings, capsules, shards and buttons everywhere.</p>
            <h4 style={h}>Fonts</h4>
            {([["display", "Display headings", "display"], ["display2", "Secondary display", "display"], ["body", "Body copy", "body"], ["label", "Labels & buttons", "body"], ["digit", "Cover digits", "display"], ["bangla", "Bangla", "bangla"]] as const).map(([k, label, group]) => (
              <Field key={k} label={label}><Select value={t.fonts[k]} onChange={(e) => setTheme((th) => { th.fonts[k] = e.target.value as FontKey; })} options={fonts(group)} /></Field>
            ))}
          </div>
          <div>
            <h4 style={h}>Type scale</h4>
            <Field label={`Base size ${t.type.base}px`}><input type="range" min={14} max={20} step={0.5} value={t.type.base} onChange={(e) => setTheme((th) => { th.type.base = Number(e.target.value); })} /></Field>
            <Field label={`Scale ratio ${t.type.ratio}`}><input type="range" min={1.125} max={1.4} step={0.005} value={t.type.ratio} onChange={(e) => setTheme((th) => { th.type.ratio = Number(e.target.value); })} /></Field>
            <h4 style={h}>Spacing & corners</h4>
            <Field label={`Base spacing unit ${t.space}px`}><input type="range" min={4} max={12} step={1} value={t.space} onChange={(e) => setTheme((th) => { th.space = Number(e.target.value); })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {(["sm", "md", "lg", "xl"] as const).map((r) => <Field key={r} label={`radius ${r}`}><Input type="number" value={t.radius[r]} onChange={(e) => setTheme((th) => { th.radius[r] = Number(e.target.value); })} /></Field>)}
            </div>
            <Field label={`Shard angle ${t.shardAngle}°`}><input type="range" min={4} max={24} step={1} value={t.shardAngle} onChange={(e) => setTheme((th) => { th.shardAngle = Number(e.target.value); })} /></Field>
            <Field label={`Container width ${t.container}px`}><input type="range" min={1080} max={1600} step={20} value={t.container} onChange={(e) => setTheme((th) => { th.container = Number(e.target.value); })} /></Field>
            <h4 style={h}>Animation intensity</h4>
            <Seg value={t.motion} onChange={(v) => setTheme({ motion: v })} options={[{ value: "off", label: "Off" }, { value: "subtle", label: "Subtle" }, { value: "cinematic", label: "Cinematic" }]} />
            <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: "#0f0f0e", border: `1px solid ${C.line}` }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "var(--gold)", textTransform: "uppercase", lineHeight: 0.95 }}>ABOUT<br />COMPANY</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--paper)", margin: "8px 0 0" }}>Live preview of the tokens — the canvas updates instantly too.</p>
              <span className="ls-btn" data-variant="gold" style={{ marginTop: 10, fontSize: 12 }}>Button</span>
            </div>
            <div style={{ marginTop: 12 }}><Btn variant="outline" onClick={() => { if (confirm("Reset all tokens to the company-profile defaults?")) setTheme((th) => { Object.assign(th, structuredClone(DEFAULT_THEME)); }); }}>Reset to defaults</Btn></div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
          <div>
            <h4 style={h}>Company</h4>
            <L10nField label="Name" value={site.company.name} onChange={(v) => mutate((d) => { d.company.name = v; })} />
            <L10nField label="Short name (nav)" value={site.company.shortName} onChange={(v) => mutate((d) => { d.company.shortName = v; })} />
            <L10nField label="Tagline" value={site.company.tagline} onChange={(v) => mutate((d) => { d.company.tagline = v; })} />
            <Field label="Phone (display)"><Input value={site.company.phone} onChange={(e) => mutate((d) => { d.company.phone = e.target.value; })} /></Field>
            <Field label="WhatsApp number (digits, with country code)"><Input value={site.company.whatsapp} onChange={(e) => mutate((d) => { d.company.whatsapp = e.target.value.replace(/\D/g, ""); })} /></Field>
            <Field label="Email"><Input value={site.company.email} onChange={(e) => mutate((d) => { d.company.email = e.target.value; })} /></Field>
            <L10nField label="Address" value={site.company.address} onChange={(v) => mutate((d) => { d.company.address = v; })} />
            <Field label="Map search query"><Input value={site.company.mapQuery} onChange={(e) => mutate((d) => { d.company.mapQuery = e.target.value; })} /></Field>
            <h4 style={h}>Settings</h4>
            <Field label="Company profile PDF URL"><Input value={site.settings.pdfUrl} onChange={(e) => mutate((d) => { d.settings.pdfUrl = e.target.value; })} /></Field>
            <Toggle checked={site.settings.showWhatsApp} onChange={(v) => mutate((d) => { d.settings.showWhatsApp = v; })} label="Show WhatsApp button" />
            <div style={{ height: 6 }} />
            <Toggle checked={site.settings.cookieNotice} onChange={(v) => mutate((d) => { d.settings.cookieNotice = v; })} label="Cookie notice (when GA4 is configured)" />
            <h4 style={h}>SEO</h4>
            <L10nField label="Default description" value={site.seo.defaultDescription} onChange={(v) => mutate((d) => { d.seo.defaultDescription = v; })} multiline />
            <Field label="Keywords (comma separated)"><Input value={site.seo.keywords.join(", ")} onChange={(e) => mutate((d) => { d.seo.keywords = e.target.value.split(",").map((s) => s.trim()).filter(Boolean); })} /></Field>
          </div>
          <div>
            <h4 style={h}>Navigation</h4>
            <ListEditor items={site.nav} onChange={(nav) => mutate((d) => { d.nav = nav; })} add={() => ({ id: uid(), label: { en: "New link" }, href: "/#" })} render={(it, upd) => <><L10nField label="Label" value={it.label} onChange={(v) => upd({ label: v })} /><Field label="Link"><Input value={it.href} onChange={(e) => upd({ href: e.target.value })} /></Field></>} />
            <h4 style={h}>Footer</h4>
            <L10nField label="About text" value={site.footer.about} onChange={(v) => mutate((d) => { d.footer.about = v; })} multiline />
            <L10nField label="Bottom note" value={site.footer.note} onChange={(v) => mutate((d) => { d.footer.note = v; })} />
            <ListEditor label="Columns" items={site.footer.columns} onChange={(columns) => mutate((d) => { d.footer.columns = columns; })} add={() => ({ id: uid(), title: { en: "Column" }, links: [] })} render={(col, upd) => <>
              <L10nField label="Title" value={col.title} onChange={(v) => upd({ title: v })} />
              <ListEditor label="Links" items={col.links} onChange={(links) => upd({ links })} add={() => ({ id: uid(), label: { en: "Link" }, href: "/#" })} addLabel="Add link" render={(l, u2) => <><L10nField label="Label" value={l.label} onChange={(v) => u2({ label: v })} /><Field label="Link"><Input value={l.href} onChange={(e) => u2({ href: e.target.value })} /></Field></>} />
            </>} />
          </div>
        </div>
      )}
    </Modal>
  );
}
/** Hex field that only commits valid #rrggbb values (so the site never receives a broken colour mid-typing). */
function HexInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return <Input value={local} onChange={(e) => { const v = e.target.value.trim(); setLocal(v); if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v.toUpperCase()); }} onBlur={() => setLocal(value)} style={{ width: 110 }} />;
}
const h: React.CSSProperties = { fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#9a9a95", margin: "16px 0 8px" };
