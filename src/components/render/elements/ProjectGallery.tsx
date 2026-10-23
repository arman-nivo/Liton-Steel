"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Node, ProjectCategory } from "@/lib/schema/types";
import { PROJECT_CATEGORIES } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { localePath, ui } from "@/lib/i18n";
import { attrs, type RenderCtx } from "../context";
import { MediaImage } from "./media";
import { isMotionOff } from "@/lib/motion/capability";

export function ProjectGallery({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const layout: "horizontal" | "grid" = node.props.layout === "horizontal" ? "horizontal" : "grid";
  const [cat, setCat] = useState<ProjectCategory | "all">(node.props.category && node.props.category !== "all" ? node.props.category : "all");
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const projects = useMemo(() => {
    let list = ctx.projects;
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (layout === "horizontal") list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    if (node.props.limit) list = list.slice(0, Number(node.props.limit));
    return list;
  }, [ctx.projects, cat, layout, node.props.limit]);

  const pinned = layout === "horizontal" && node.animation?.preset === "horizontal-gallery" && !ctx.editable;
  useEffect(() => {
    const root = ref.current, track = trackRef.current;
    if (!root || !track || !pinned) return;
    if (isMotionOff() || window.innerWidth < 1200 || !window.matchMedia("(hover: hover)").matches) return;
    let tween: { kill(): void; scrollTrigger?: { kill(): void } } | undefined; let cancelled = false; let id: ReturnType<typeof setTimeout> | undefined;
    let mod: typeof import("@/lib/motion/gsap") | undefined;
    import("@/lib/motion/gsap").then((m) => {
      if (cancelled) return;
      mod = m;
      const { gsap, ScrollTrigger } = m.g();
      id = setTimeout(() => {
        const dist = track.scrollWidth - track.clientWidth;
        if (dist < 80) return;
        root.dataset.pinned = "1";
        tween = gsap.to(track, { x: -dist, ease: "none", scrollTrigger: { trigger: root, start: "center center", end: () => `+=${dist}`, pin: true, pinType: "transform", scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
        ScrollTrigger.refresh();
      }, 400);
    });
    return () => { cancelled = true; if (id) clearTimeout(id); tween?.scrollTrigger?.kill(); tween?.kill(); delete root.dataset.pinned; if (mod) mod.g().gsap.set(track, { clearProps: "x" }); };
  }, [pinned, projects.length]);

  const a = attrs(node, "ls-projects", ctx);
  const HTag = (node.props.headingLevel === 2 ? "h2" : "h3") as "h2" | "h3";
  const catLabel = (id: string) => t(PROJECT_CATEGORIES.find((c) => c.id === id)?.label, ctx.locale) ?? id;
  return (
    <div {...a} ref={ref} data-layout={layout}>
      {node.props.showFilters ? (
        <div className="filters" role="group" aria-label={ui("category", ctx.locale)}>
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{ui("all", ctx.locale)}</button>
          {PROJECT_CATEGORIES.map((c) => <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{t(c.label, ctx.locale)}</button>)}
        </div>
      ) : null}
      <div className="track" ref={trackRef} style={pinned ? undefined : undefined}>
        {projects.map((p) => {
          const inner = (
            <>
              <div className="thumbs">
                <MediaImage ctx={ctx} media={p.images[0]} alt={t(p.title, ctx.locale)} sizes="(max-width: 767px) 84vw, 440px" />
                {p.images[1] ? <MediaImage ctx={ctx} media={p.images[1]} alt="" sizes="260px" /> : null}
              </div>
              <div>
                <div className="cat">{catLabel(p.category)}</div>
                <HTag>{t(p.title, ctx.locale)}</HTag>
                <p>{t(p.caption, ctx.locale)}</p>
              </div>
            </>
          );
          return ctx.editable
            ? <div className="card" key={p.id}>{inner}</div>
            // prefetch={false}: scrolling a 19-card grid would otherwise download every project page; the page
            // transition prefetches the clicked one instead
            : <Link className="card" key={p.id} href={localePath(ctx.locale, `/projects/${p.slug}`)} prefetch={false} data-anim="magnetic-hover" data-anim-opts='{"intensity":0.4}'>{inner}</Link>;
        })}
        {!projects.length ? <p style={{ opacity: 0.7 }}>No projects in this category yet.</p> : null}
      </div>
      {node.props.moreLabel && !ctx.editable ? <div className="more"><Link className="ls-btn" data-variant="outline" href={localePath(ctx.locale, "/projects")}>{t(node.props.moreLabel, ctx.locale)}</Link></div> : node.props.moreLabel ? <div className="more"><span className="ls-btn" data-variant="outline">{t(node.props.moreLabel, ctx.locale)}</span></div> : null}
      <style>{`.ls-projects[data-pinned="1"] .track{overflow:visible !important}`}</style>
    </div>
  );
}
