"use client";
import { useEditor } from "@/lib/store/editor";
import type { Animation, MotionPreset, Node } from "@/lib/schema/types";
import { MOTION_PRESETS } from "@/lib/schema/types";
import { Btn, Field, Input, Select } from "../ui";
import { applyPreset } from "@/lib/motion/presets";

const DESC: Record<MotionPreset, string> = {
  none: "No animation.",
  "fade-rise": "Fades in while rising 40px.",
  "mask-reveal-text": "Lines reveal from behind a mask (Apple product-title style).",
  "split-chars": "Per-character reveal for big two-line headings (falls back to words for Bangla).",
  "shard-slide": "Diagonal shards slide in along their angle.",
  "tab-drop": "Gold bookmark tab drops from the top with overshoot; logo rotates in.",
  "image-clip-expand": "Image unmasks from a pill into a rounded rectangle.",
  "parallax-depth": "Children move at different scroll speeds.",
  "pin-and-scrub": "Section pins while a gold progress line fills and steps light up (Process, Contents).",
  "scale-hero": "Cover photo scales 1.15→1 and desaturates as you scroll.",
  "count-up": "Numbers count up when they enter the viewport.",
  "horizontal-gallery": "Cards scroll horizontally while the page scrolls vertically (desktop), swipe on mobile.",
  "magnetic-hover": "Subtle magnetic pull for buttons; cards tilt ≤3°.",
};

export function MotionTab({ node }: { node: Node }) {
  const setAnimation = useEditor((s) => s.setAnimation);
  const a: Animation = node.animation ?? { preset: "none" };
  const set = (patch: Partial<Animation>) => setAnimation(node.id, { ...a, ...patch });
  const preview = () => {
    const el = document.querySelector<HTMLElement>(`[data-node-id="${node.id}"]`);
    if (!el || a.preset === "none") return;
    el.closest(".ls-editing")?.classList.remove("ls-editing");
    delete el.dataset.animDone; el.classList.remove("is-in"); el.dataset.anim = a.preset; el.dataset.animOpts = JSON.stringify({ ...a, trigger: "load" });
    applyPreset(el, "cinematic");
    setTimeout(() => { document.querySelector(".ls-page")?.parentElement?.classList.add("ls-editing"); el.style.cssText = ""; el.classList.add("is-in"); delete el.dataset.animDone; }, ((a.duration ?? 1) + (a.delay ?? 0)) * 1000 + 1800);
  };
  return (
    <div>
      <Field label="Preset"><Select value={a.preset} onChange={(e) => setAnimation(node.id, e.target.value === "none" ? undefined : { ...a, preset: e.target.value as MotionPreset })} options={MOTION_PRESETS.map((p) => ({ value: p, label: p }))} /></Field>
      <p style={{ fontSize: 11, color: "#9a9a95", marginTop: -4 }}>{DESC[a.preset]}</p>
      {node.computed?.motionDowngrade ? <p style={{ fontSize: 11, color: "#F8DB63" }}>Downgraded to fade-rise by the motion budget (too many animated elements in this section).</p> : null}
      {a.preset !== "none" ? <>
        <Field label="Trigger"><Select value={a.trigger ?? "enter"} onChange={(e) => set({ trigger: e.target.value as Animation["trigger"] })} options={[{ value: "load", label: "On load" }, { value: "enter", label: "When scrolled into view" }, { value: "scrub", label: "Scrubbed with scroll" }, { value: "hover", label: "On hover" }]} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Delay (s)"><Input type="number" step={0.05} value={a.delay ?? 0} onChange={(e) => set({ delay: Number(e.target.value) })} /></Field>
          <Field label="Duration (s)"><Input type="number" step={0.05} value={a.duration ?? 0.9} onChange={(e) => set({ duration: Number(e.target.value) })} /></Field>
          <Field label="Stagger (s)"><Input type="number" step={0.01} value={a.stagger ?? 0.08} onChange={(e) => set({ stagger: Number(e.target.value) })} /></Field>
          <Field label="Intensity"><Input type="number" step={0.1} min={0} max={1} value={a.intensity ?? 0.6} onChange={(e) => set({ intensity: Number(e.target.value) })} /></Field>
        </div>
        <Field label="Easing"><Select value={a.ease ?? "apple"} onChange={(e) => set({ ease: e.target.value })} options={[{ value: "apple", label: "Apple (0.22, 1, 0.36, 1)" }, { value: "power3.out", label: "Power 3 out" }, { value: "expo.out", label: "Expo out" }, { value: "back.out(1.4)", label: "Back (overshoot)" }, { value: "none", label: "Linear" }]} /></Field>
        <Btn variant="outline" onClick={preview}>▶ Preview on canvas</Btn>
      </> : null}
      <p style={{ fontSize: 11, color: "#9a9a95", marginTop: 12 }}>“Respect reduced motion” is always on: visitors with prefers-reduced-motion, save-data or low-power devices get a simplified or static version automatically.</p>
    </div>
  );
}
