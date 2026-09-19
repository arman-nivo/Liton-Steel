"use client";
import type { Node } from "@/lib/schema/types";
import { attrs, type RenderCtx } from "../context";
import { useInView } from "@/lib/motion/useInView";

export function MapEmbed({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const { ref, inView } = useInView<HTMLDivElement>("200px");
  const a = attrs(node, "ls-map", ctx);
  const src = node.props.embed || (node.props.query ? `https://www.google.com/maps?q=${encodeURIComponent(node.props.query)}&z=14&output=embed` : "");
  return (
    <div {...a} ref={ref}>
      {inView && src ? <iframe src={src} loading="lazy" title="Map" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : null}
    </div>
  );
}
