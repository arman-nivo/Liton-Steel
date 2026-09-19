"use client";
import { useEditor } from "@/lib/store/editor";
import type { Breakpoint, Node, StyleProps } from "@/lib/schema/types";
import { RADIUS_TOKENS } from "@/lib/schema/tokens";
import { Field, Input, Select, Toggle, Seg, Section } from "../ui";
import { ColorField, SizeField, FontField, MediaField } from "../controls";

export function useStyleApi(node: Node) {
  const breakpoint = useEditor((s) => s.breakpoint);
  const updateStyle = useEditor((s) => s.updateStyle);
  const clearStyle = useEditor((s) => s.clearStyle);
  const bp: Breakpoint = breakpoint === "desktop" ? "base" : breakpoint;
  const own = (bp === "base" ? node.style.base : node.style[bp]) ?? {};
  const eff = { ...node.auto, ...node.style.base, ...(bp === "tablet" || bp === "mobile" ? node.style.tablet : {}), ...(bp === "mobile" ? node.style.mobile : {}) } as StyleProps;
  const get = <K extends keyof StyleProps>(k: K) => eff[k];
  const set = <K extends keyof StyleProps>(k: K, v: StyleProps[K]) => updateStyle(node.id, bp, { [k]: v } as Partial<StyleProps>);
  const isOverridden = (k: keyof StyleProps) => bp !== "base" && own[k] !== undefined;
  const reset = (k: keyof StyleProps) => clearStyle(node.id, bp, k);
  const f = (k: keyof StyleProps) => ({ overridden: isOverridden(k), onReset: () => reset(k) });
  return { bp, get, set, f, eff };
}

const SHADOWS = [["", "None"], ["0 20px 60px -20px rgba(0,0,0,.6)", "Soft"], ["0 30px 80px -20px rgba(0,0,0,.8)", "Deep"], ["0 12px 30px -12px var(--gold)", "Gold glow"]];

export function StyleTab({ node }: { node: Node }) {
  const { bp, get, set, f } = useStyleApi(node);
  const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v || "inherit" }));
  return (
    <div>
      <p style={{ fontSize: 11, color: "#9a9a95", margin: "0 0 8px" }}>Editing <b>{bp === "base" ? "all devices" : bp}</b>. Gold dots mark values overridden at this breakpoint.</p>
      <Section title="Typography">
        <FontField label="Font" value={get("font")} onChange={(v) => set("font", v)} {...f("font")} />
        <SizeField label="Size" value={get("size")} onChange={(v) => set("size", v)} {...f("size")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Weight" {...f("weight")}><Select value={String(get("weight") ?? "")} onChange={(e) => set("weight", e.target.value ? Number(e.target.value) : undefined)} options={opt(["", "300", "400", "500", "600", "700", "800", "900"])} /></Field>
          <Field label="Letter-spacing" {...f("letterSpacing")}><Input value={get("letterSpacing") ?? ""} placeholder="0.02em" onChange={(e) => set("letterSpacing", e.target.value || undefined)} /></Field>
          <Field label="Line-height" {...f("lineHeight")}><Input value={String(get("lineHeight") ?? "")} placeholder="1.2" onChange={(e) => set("lineHeight", e.target.value || undefined)} /></Field>
          <Field label="Case" {...f("transform")}><Select value={get("transform") ?? ""} onChange={(e) => set("transform", (e.target.value || undefined) as StyleProps["transform"])} options={opt(["", "none", "uppercase", "lowercase", "capitalize"])} /></Field>
        </div>
        <Field label="Alignment" {...f("align")}><Seg value={get("align") ?? ""} onChange={(v) => set("align", (v || undefined) as StyleProps["align"])} options={[{ value: "", label: "–" }, { value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }, { value: "justify", label: "Justify" }]} /></Field>
        <Toggle checked={!!get("italic")} onChange={(v) => set("italic", v || undefined)} label="Italic" />
        <Field label="Max lines (clamp)" {...f("maxLines")}><Input type="number" value={get("maxLines") ?? ""} onChange={(e) => set("maxLines", e.target.value ? Number(e.target.value) : undefined)} /></Field>
      </Section>
      <Section title="Colour">
        <ColorField label="Text colour" value={get("color")} onChange={(v) => set("color", v)} {...f("color")} />
        <Field label={`Opacity ${Math.round((get("opacity") ?? 1) * 100)}%`} {...f("opacity")}><input type="range" min={0} max={1} step={0.05} value={get("opacity") ?? 1} onChange={(e) => set("opacity", Number(e.target.value) === 1 ? undefined : Number(e.target.value))} /></Field>
      </Section>
      <Section title="Background" open={false}>
        <ColorField label="Background colour" value={get("bg")} onChange={(v) => set("bg", v)} {...f("bg")} />
        <MediaField label="Background image" value={get("bgMedia")} onChange={(id) => set("bgMedia", id)} />
        <Field label="Overlay (css colour or gradient)" {...f("bgOverlay")}><Input value={get("bgOverlay") ?? ""} placeholder="rgba(0,0,0,.5)" onChange={(e) => set("bgOverlay", e.target.value || undefined)} /></Field>
        <Field label="Position" {...f("bgPosition")}><Input value={get("bgPosition") ?? ""} placeholder="center" onChange={(e) => set("bgPosition", e.target.value || undefined)} /></Field>
      </Section>
      <Section title="Shape, border & effects">
        <Field label="Shape preset" {...f("shape")}><Select value={get("shape") ?? "none"} onChange={(e) => set("shape", (e.target.value === "none" ? undefined : e.target.value) as StyleProps["shape"])} options={[{ value: "none", label: "None" }, { value: "rounded", label: "Rounded rectangle" }, { value: "arch", label: "Arch top" }, { value: "pill", label: "Pill / stadium" }, { value: "circle", label: "Circle" }, { value: "shard-tl", label: "Diagonal cut ↖" }, { value: "shard-tr", label: "Diagonal cut ↗" }, { value: "shard-bl", label: "Diagonal cut ↙" }, { value: "shard-br", label: "Diagonal cut ↘" }]} /></Field>
        <Field label="Radius" {...f("radius")}><Select value={get("radius") ?? ""} onChange={(e) => set("radius", e.target.value || undefined)} options={[{ value: "", label: "inherit" }, ...RADIUS_TOKENS.map((r) => ({ value: `token:${r}`, label: r })), { value: "0", label: "0" }, { value: "999px", label: "999px" }]} /></Field>
        <Field label="Border" {...f("border")}><Input value={get("border") ?? ""} placeholder="1px solid var(--gold)" onChange={(e) => set("border", e.target.value || undefined)} /></Field>
        <Field label="Shadow" {...f("shadow")}><Select value={get("shadow") ?? ""} onChange={(e) => set("shadow", e.target.value || undefined)} options={SHADOWS.map(([v, l]) => ({ value: v, label: l }))} /></Field>
        <Field label="Image filter" {...f("filter")}><Seg value={get("filter") ?? "none"} onChange={(v) => set("filter", v === "none" ? undefined : (v as StyleProps["filter"]))} options={[{ value: "none", label: "Colour" }, { value: "bw", label: "B&W" }, { value: "duotone", label: "Gold duotone" }]} /></Field>
        <Field label="Object position (focal)" {...f("objectPosition")}><Input value={get("objectPosition") ?? ""} placeholder="50% 30%" onChange={(e) => set("objectPosition", e.target.value || undefined)} /></Field>
      </Section>
    </div>
  );
}
