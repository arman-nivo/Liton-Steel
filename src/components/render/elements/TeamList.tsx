"use client";
import { useEffect, useRef, useState } from "react";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, type RenderCtx } from "../context";

export function TeamList({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const groups: { id: string; role: any; members: { id: string; name: any }[] }[] = node.props.groups ?? [];
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || node.props.accordionOnMobile === false) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, [node.props.accordionOnMobile]);
  const a = attrs(node, "ls-team", ctx);
  return (
    <div {...a} ref={ref}>
      {groups.map((gp) => narrow ? (
        <details key={gp.id}>
          <summary><span className="role">{t(gp.role, ctx.locale)}</span></summary>
          <div className="members">{gp.members.map((m) => <span key={m.id}>{t(m.name, ctx.locale)}</span>)}</div>
        </details>
      ) : (
        <div key={gp.id}>
          <div className="role">{t(gp.role, ctx.locale)}</div>
          <div className="members">{gp.members.map((m) => <span key={m.id}>{t(m.name, ctx.locale)}</span>)}</div>
        </div>
      ))}
    </div>
  );
}
