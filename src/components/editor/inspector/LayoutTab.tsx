"use client";
import type { Node, StyleProps, Box } from "@/lib/schema/types";
import { Field, Input, Select, Seg, Section, Toggle } from "../ui";
import { useStyleApi } from "./StyleTab";

function BoxModel({ label, value, onChange }: { label: string; value?: Box; onChange: (v: Box | undefined) => void }) {
  const arr: (string | number)[] = Array.isArray(value) ? value : value === undefined ? ["", "", "", ""] : [value, value, value, value];
  const upd = (i: number, v: string) => { const next = [...arr]; next[i] = v === "" ? "" : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v; if (next.every((x) => x === "")) onChange(undefined); else onChange(next.map((x) => (x === "" ? 0 : x)) as Box); };
  return (
    <Field label={`${label} (top / right / bottom / left — numbers = × base unit)`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>{arr.map((v, i) => <Input key={i} value={String(v)} placeholder={["T", "R", "B", "L"][i]} onChange={(e) => upd(i, e.target.value)} />)}</div>
    </Field>
  );
}

export function LayoutTab({ node }: { node: Node }) {
  const { get, set, f } = useStyleApi(node);
  const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v || "auto" }));
  const numOrStr = (v: string) => (v === "" ? undefined : /^\d+(\.\d+)?$/.test(v) ? Number(v) : v);
  return (
    <div>
      <Section title="Display & flow">
        <Field label="Display" {...f("display")}><Select value={get("display") ?? ""} onChange={(e) => set("display", (e.target.value || undefined) as StyleProps["display"])} options={opt(["", "block", "flex", "grid", "inline-flex", "none"])} /></Field>
        {(get("display") === "flex" || get("display") === "inline-flex") ? <>
          <Field label="Direction" {...f("direction")}><Seg value={get("direction") ?? "row"} onChange={(v) => set("direction", v as StyleProps["direction"])} options={[{ value: "row", label: "Row" }, { value: "column", label: "Column" }, { value: "row-reverse", label: "Row ⇄" }, { value: "column-reverse", label: "Col ⇅" }]} /></Field>
          <Toggle checked={!!get("wrap")} onChange={(v) => set("wrap", v || undefined)} label="Wrap" />
        </> : null}
        {get("display") === "grid" ? <Field label="Columns" {...f("columns")}><Input type="number" min={1} max={12} value={get("columns") ?? ""} onChange={(e) => set("columns", e.target.value ? Number(e.target.value) : undefined)} /></Field> : null}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Gap" {...f("gap")}><Input value={String(get("gap") ?? "")} placeholder="4" onChange={(e) => set("gap", numOrStr(e.target.value))} /></Field>
          <Field label="Row gap" {...f("rowGap")}><Input value={String(get("rowGap") ?? "")} onChange={(e) => set("rowGap", numOrStr(e.target.value))} /></Field>
          <Field label="Align items" {...f("alignItems")}><Select value={get("alignItems") ?? ""} onChange={(e) => set("alignItems", e.target.value || undefined)} options={opt(["", "start", "center", "end", "stretch", "baseline"])} /></Field>
          <Field label="Justify content" {...f("justifyContent")}><Select value={get("justifyContent") ?? ""} onChange={(e) => set("justifyContent", e.target.value || undefined)} options={opt(["", "flex-start", "center", "flex-end", "space-between", "space-around"])} /></Field>
          <Field label="Align self" {...f("alignSelf")}><Select value={get("alignSelf") ?? ""} onChange={(e) => set("alignSelf", e.target.value || undefined)} options={opt(["", "flex-start", "center", "flex-end", "stretch"])} /></Field>
          <Field label="Justify self" {...f("justifySelf")}><Select value={get("justifySelf") ?? ""} onChange={(e) => set("justifySelf", e.target.value || undefined)} options={opt(["", "start", "center", "end", "stretch"])} /></Field>
        </div>
      </Section>
      <Section title="Spacing">
        <BoxModel label="Padding" value={get("padding")} onChange={(v) => set("padding", v)} />
        <BoxModel label="Margin" value={get("margin")} onChange={(v) => set("margin", v)} />
      </Section>
      <Section title="Size">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"] as const).map((k) => <Field key={k} label={k} {...f(k)}><Input value={get(k) ?? ""} placeholder="auto / 100% / 320px / fit-content" onChange={(e) => set(k, e.target.value || undefined)} /></Field>)}
          <Field label="Aspect ratio" {...f("aspectRatio")}><Input value={get("aspectRatio") ?? ""} placeholder="16 / 9" onChange={(e) => set("aspectRatio", e.target.value || undefined)} /></Field>
          <Field label="Object fit" {...f("objectFit")}><Select value={get("objectFit") ?? ""} onChange={(e) => set("objectFit", (e.target.value || undefined) as StyleProps["objectFit"])} options={opt(["", "cover", "contain"])} /></Field>
        </div>
      </Section>
      <Section title="Position" open={false}>
        <Field label="Position" {...f("position")}><Select value={get("position") ?? ""} onChange={(e) => set("position", (e.target.value || undefined) as StyleProps["position"])} options={opt(["", "static", "relative", "absolute", "sticky"])} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
          {(["top", "right", "bottom", "left"] as const).map((k) => <Field key={k} label={k} {...f(k)}><Input value={get(k) ?? ""} onChange={(e) => set(k, e.target.value || undefined)} /></Field>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <Field label="z-index" {...f("zIndex")}><Input type="number" value={get("zIndex") ?? ""} onChange={(e) => set("zIndex", e.target.value ? Number(e.target.value) : undefined)} /></Field>
          <Field label="Order" {...f("order")}><Input type="number" value={get("order") ?? ""} onChange={(e) => set("order", e.target.value ? Number(e.target.value) : undefined)} /></Field>
          <Field label="Overflow" {...f("overflow")}><Select value={get("overflow") ?? ""} onChange={(e) => set("overflow", (e.target.value || undefined) as StyleProps["overflow"])} options={opt(["", "visible", "hidden", "auto"])} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Rotate" {...f("rotate")}><Input value={get("rotate") ?? ""} placeholder="-6deg" onChange={(e) => set("rotate", e.target.value || undefined)} /></Field>
          <Field label="Translate" {...f("translate")}><Input value={get("translate") ?? ""} placeholder="0 -20px" onChange={(e) => set("translate", e.target.value || undefined)} /></Field>
          <Field label="Grid column" {...f("gridColumn")}><Input value={get("gridColumn") ?? ""} placeholder="1 / -1" onChange={(e) => set("gridColumn", e.target.value || undefined)} /></Field>
          <Field label="Flex" {...f("flex")}><Input value={get("flex") ?? ""} placeholder="1 1 0" onChange={(e) => set("flex", e.target.value || undefined)} /></Field>
        </div>
      </Section>
    </div>
  );
}
