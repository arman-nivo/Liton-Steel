"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { localePath } from "@/lib/i18n";
import { attrs, type RenderCtx } from "../context";
import { isMotionOff } from "@/lib/motion/capability";

const bnDigits = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export function NumberList({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const items: { id: string; label: any; href: string }[] = node.props.items ?? [];
  const start = Number(node.props.startAt) || 1;
  const ref = useRef<HTMLDivElement>(null);
  const scrub = node.animation?.preset === "pin-and-scrub" && !ctx.editable;

  useEffect(() => {
    const el = ref.current; if (!el || !scrub) return;
    if (isMotionOff()) return;
    let ctxg: { revert(): void } | undefined; let cancelled = false;
    import("@/lib/motion/gsap").then(({ g }) => {
      if (cancelled) return;
      const { gsap } = g();
      ctxg = gsap.context(() => {
        const rows = el.querySelectorAll("ol li");
        const caps = el.querySelectorAll(".caps span");
        gsap.fromTo(rows, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.7, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 70%", scrub: 0.5 } });
        gsap.fromTo(caps, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 70%", scrub: 0.5 } });
      }, el);
    });
    return () => { cancelled = true; ctxg?.revert(); };
  }, [scrub]);

  const a = attrs(node, "ls-numlist", ctx);
  const num = (i: number) => { const s = String(start + i).padStart(2, "0"); return ctx.locale === "bn" ? bnDigits(s) : s; };
  return (
    <div {...a} ref={ref}>
      <ol>
        {items.map((it) => (
          <li key={it.id}>{ctx.editable ? <span style={{ display: "flex", alignItems: "center", minHeight: 44, fontSize: "var(--text-md)" }}>{t(it.label, ctx.locale)}</span> : <Link href={localePath(ctx.locale, it.href)}>{t(it.label, ctx.locale)}</Link>}</li>
        ))}
      </ol>
      <div className="caps" aria-hidden="true">{items.map((it, i) => <span key={it.id}>{num(i)}</span>)}</div>
    </div>
  );
}
