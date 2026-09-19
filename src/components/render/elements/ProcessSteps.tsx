"use client";
import { useEffect, useRef, useState } from "react";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, type RenderCtx } from "../context";
import { MediaImage } from "./media";
import { isMotionOff } from "@/lib/motion/capability";

const bnDigits = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export function ProcessSteps({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const items: { id: string; title: any; text?: any }[] = node.props.items ?? [];
  const media: string[] = node.props.media ?? [];
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ctx.editable ? items.length : 0);
  const scrub = node.animation?.preset === "pin-and-scrub" && !ctx.editable;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!scrub || isMotionOff()) { setActive(items.length); el.style.setProperty("--p", "1"); return; }
    const steps = el.querySelector<HTMLElement>(".steps");
    if (!steps) return;
    const n = items.length;
    let st: { kill(): void } | undefined; let cancelled = false;
    import("@/lib/motion/gsap").then(({ g }) => {
    if (cancelled) return;
    const { gsap, ScrollTrigger } = g();
    const canPin = window.innerWidth >= 1200 && el.offsetHeight < window.innerHeight * 0.78;
    st = ScrollTrigger.create({
      trigger: canPin ? el : steps,
      start: canPin ? "top 14%" : "top 70%",
      end: canPin ? `+=${n * 160}` : "bottom 55%",
      pin: canPin ? el : false,
      pinType: "transform",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        el.style.setProperty("--p", String(p));
        setActive(Math.min(n, Math.max(1, Math.ceil(p * n + 0.001))));
      },
    });
    gsap.set(el, { autoAlpha: 1 });
    });
    return () => { cancelled = true; st?.kill(); };
  }, [scrub, items.length]);

  const a = attrs(node, "ls-process", ctx);
  return (
    <div {...a} ref={ref}>
      <div className="pills" aria-hidden="true">
        {media.slice(0, 3).map((m, i) => <div className="pill" key={`${m}-${i}`}><MediaImage ctx={ctx} media={m} sizes="280px" /></div>)}
      </div>
      <ol className="steps" style={{ listStyle: "none", margin: 0 }}>
        <span className="line" aria-hidden="true"><i /></span>
        {items.map((it, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <li className="step" key={it.id} data-active={i < active ? "true" : "false"}>
              <h3><small>{ctx.locale === "bn" ? bnDigits(n) : n}</small>{t(it.title, ctx.locale)}</h3>
              {it.text ? <p>{t(it.text, ctx.locale)}</p> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
