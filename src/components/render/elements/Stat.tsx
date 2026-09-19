"use client";
import { useEffect, useRef, useState } from "react";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, type RenderCtx } from "../context";
import { isMotionOff } from "@/lib/motion/capability";

const bnDigits = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export function Stat({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const target = Number(node.props.value) || 0;
  const [val, setVal] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const animate = node.animation?.preset === "count-up" && !ctx.editable;
  useEffect(() => {
    const el = ref.current; if (!el || !animate) return;
    if (isMotionOff()) return;
    let tw: { kill(): void; scrollTrigger?: { kill(): void } } | undefined; let cancelled = false;
    setVal(0);
    import("@/lib/motion/gsap").then(({ g }) => {
      if (cancelled) return;
      const { gsap } = g();
      const obj = { v: 0 };
      tw = gsap.to(obj, { v: target, duration: Number(node.animation?.duration) || 1.6, ease: "power3.out", onUpdate: () => setVal(Math.round(obj.v)), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    return () => { cancelled = true; tw?.scrollTrigger?.kill(); tw?.kill(); if (!tw) setVal(target); };
  }, [animate, target, node.animation?.duration]);
  const a = attrs(node, "ls-stat", ctx);
  const num = ctx.locale === "bn" ? bnDigits(String(val)) : String(val);
  return (
    <div {...a} ref={ref}>
      <div className="v">{node.props.prefix}{num}{node.props.suffix}</div>
      <div className="l">{t(node.props.label, ctx.locale)}</div>
    </div>
  );
}
