import type { Node } from "@/lib/schema/types";
import { attrs, type RenderCtx } from "../context";
import { MediaImage } from "../elements/media";
import { RenderChildren } from "../RenderNode";

export function Section({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-section");
  const full = node.computed?.fullHeight === false ? false : !!node.props.fullHeight;
  const tone = node.props.tone ?? "ink";
  const bg = node.props.bgMedia;
  const overlay = node.props.bgOverlay;
  return (
    <section {...a} data-full={full ? "true" : "false"} data-tone={tone} style={{ background: tone === "paper" ? "var(--paper)" : tone === "gold" ? "var(--gold)" : tone === "black" ? "var(--black)" : undefined, color: tone === "paper" || tone === "gold" ? "var(--ink)" : undefined }}>
      {bg ? (
        <div className="ls-section-bg" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, filter: node.props.bgFilter === "bw" ? "grayscale(1) contrast(1.08)" : undefined }}>
          <MediaImage ctx={ctx} media={bg} alt="" sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlay ?? 0.55})` }} />
        </div>
      ) : null}
      <RenderChildren node={node} ctx={ctx} insert="element" />
      {node.computed?.overlay ? <div className="ls-section-overlay" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: String(node.computed.overlay), pointerEvents: "none" }} /> : null}
    </section>
  );
}

export function Container({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-container");
  const w = node.props.width;
  const max = w === "narrow" ? "min(var(--container), 880px)" : w === "wide" ? "min(100%, 1600px)" : w === "full" ? "100%" : undefined;
  return <div {...a} style={max ? { maxWidth: max } : undefined}><RenderChildren node={node} ctx={ctx} insert="element" /></div>;
}

export function Grid({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-grid");
  return <div {...a}><RenderChildren node={node} ctx={ctx} /></div>;
}

export function Stack({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-stack");
  return <div {...a}><RenderChildren node={node} ctx={ctx} insert="element" /></div>;
}
