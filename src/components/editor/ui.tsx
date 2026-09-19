"use client";
import type { CSSProperties, ReactNode } from "react";

export const C = { bg: "#0b0b0a", panel: "#141412", line: "#262623", text: "#ececea", dim: "#9a9a95", gold: "#F8DB63", danger: "#ff6b6b", ok: "#7ee787" };

export function Btn({ children, onClick, variant = "ghost", disabled, title, style, type = "button", small }: { children: ReactNode; onClick?: () => void; variant?: "gold" | "ghost" | "outline" | "danger"; disabled?: boolean; title?: string; style?: CSSProperties; type?: "button" | "submit"; small?: boolean }) {
  const base: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "4px 8px" : "7px 12px", borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: "1px solid transparent", opacity: disabled ? 0.5 : 1, lineHeight: 1.2, whiteSpace: "nowrap" };
  const v: Record<string, CSSProperties> = {
    gold: { background: C.gold, color: "#0f0f0e" },
    ghost: { background: "transparent", color: C.text },
    outline: { background: "transparent", color: C.text, borderColor: C.line },
    danger: { background: "transparent", color: C.danger, borderColor: "transparent" },
  };
  return <button type={type} title={title} disabled={disabled} onClick={onClick} style={{ ...base, ...v[variant], ...style }}>{children}</button>;
}

export function IconBtn({ children, onClick, title, active, disabled, style }: { children: ReactNode; onClick?: () => void; title?: string; active?: boolean; disabled?: boolean; style?: CSSProperties }) {
  return <button type="button" title={title} aria-label={title} aria-pressed={active} disabled={disabled} onClick={onClick} style={{ width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid transparent", background: active ? "rgba(248,219,99,.15)" : "transparent", color: active ? C.gold : C.text, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, ...style }}>{children}</button>;
}

export function Field({ label, children, hint, overridden, onReset, inline }: { label: string; children: ReactNode; hint?: string; overridden?: boolean; onReset?: () => void; inline?: boolean }) {
  return (
    <label style={{ display: inline ? "flex" : "grid", alignItems: inline ? "center" : undefined, justifyContent: inline ? "space-between" : undefined, gap: 6, fontSize: 12, color: C.dim, marginBottom: 10 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{label}{overridden ? <span title="Overridden at this breakpoint — click to reset" onClick={(e) => { e.preventDefault(); onReset?.(); }} style={{ width: 8, height: 8, borderRadius: 4, background: C.gold, display: "inline-block", cursor: "pointer" }} /> : null}</span>
      {children}
      {hint ? <span style={{ fontSize: 11, opacity: 0.7 }}>{hint}</span> : null}
    </label>
  );
}

export const inputStyle: CSSProperties = { width: "100%", background: "#0f0f0e", border: `1px solid ${C.line}`, color: C.text, borderRadius: 8, padding: "7px 9px", fontSize: 13, minHeight: 34, boxSizing: "border-box" };

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} style={{ ...inputStyle, ...(props.style ?? {}) }} />; }
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "inherit", ...(props.style ?? {}) }} />; }
export function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return <select {...props} style={{ ...inputStyle, ...(props.style ?? {}) }}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: 0, color: C.text, cursor: "pointer", padding: 0, fontSize: 12 }}>
      <span style={{ width: 34, height: 20, borderRadius: 10, background: checked ? C.gold : "#333", position: "relative", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, left: checked ? 16 : 2, width: 16, height: 16, borderRadius: 8, background: checked ? "#0f0f0e" : "#aaa", transition: "left .2s" }} /></span>
      {label}
    </button>
  );
}
export function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; title?: string }[] }) {
  return (
    <div role="group" style={{ display: "inline-flex", border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden" }}>
      {options.map((o) => <button key={o.value} type="button" title={o.title} aria-pressed={value === o.value} onClick={() => onChange(o.value)} style={{ padding: "5px 9px", fontSize: 12, background: value === o.value ? "rgba(248,219,99,.18)" : "transparent", color: value === o.value ? C.gold : C.text, border: 0, cursor: "pointer" }}>{o.label}</button>)}
    </div>
  );
}
export function Section({ title, children, right, open = true }: { title: string; children: ReactNode; right?: ReactNode; open?: boolean }) {
  return (
    <details open={open} style={{ borderBottom: `1px solid ${C.line}`, padding: "8px 0" }}>
      <summary style={{ cursor: "pointer", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", listStyle: "none" }}><span>{title}</span>{right}</summary>
      <div style={{ paddingTop: 8 }}>{children}</div>
    </details>
  );
}
export function Modal({ title, onClose, children, width = 720 }: { title: string; onClose: () => void; children: ReactNode; width?: number }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: width, maxHeight: "88vh", overflow: "auto", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.panel, zIndex: 1 }}>
          <strong style={{ fontSize: 14 }}>{title}</strong>
          <Btn onClick={onClose} small>✕</Btn>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
}
