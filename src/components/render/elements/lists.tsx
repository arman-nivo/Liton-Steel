import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, mediaOf, type RenderCtx } from "../context";
import { MediaImage } from "./media";
import { Icon } from "./icons";

export function PersonCard({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-person", ctx);
  const name = t(node.props.name, ctx.locale);
  const role = t(node.props.role, ctx.locale);
  const labelStyle = node.props.labelStyle ?? "overlap";
  // "photo" shows the portrait whole, in its own proportions; the default arch crops it to the 3:4 arch shape
  const photo = node.props.frame === "photo";
  const m = photo ? mediaOf(ctx, node.props.media) : undefined;
  return (
    <div {...a} data-label={labelStyle} data-frame={photo ? "photo" : undefined}>
      {labelStyle === "below" ? <div className="name" style={{ fontSize: "var(--text-md)" }}>{name}</div> : null}
      <div className="frame" style={m ? ({ "--ar": `${m.width} / ${m.height}` } as React.CSSProperties) : undefined}><MediaImage ctx={ctx} media={node.props.media} alt={name} sizes="(max-width: 767px) 90vw, 420px" /></div>
      {labelStyle === "overlap" ? <div className="tag" style={{ fontSize: "var(--text-md)" }}>{name}</div> : null}
      {role ? <div className="role">{role}</div> : null}
      {node.props.bio ? <p className="ls-text" style={{ fontSize: "var(--text-sm)", opacity: 0.8, textAlign: "center" }}>{t(node.props.bio, ctx.locale)}</p> : null}
    </div>
  );
}

export function ClientList({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-clients", ctx);
  const title = t(node.props.title, ctx.locale);
  const items: { id: string; name: any }[] = node.props.items ?? [];
  return (
    <div {...a}>
      {title ? <div className="title">{title}</div> : null}
      <ul>{items.map((it) => <li key={it.id}>{t(it.name, ctx.locale)}</li>)}</ul>
    </div>
  );
}

export function ContactDetails({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-contact-details", ctx);
  const items: { id: string; icon: string; text: any; href?: string }[] = node.props.items ?? [];
  return (
    <div {...a}>
      {items.map((it) => {
        const inner = <><span className="ico"><Icon name={it.icon} size={18} /></span><span>{t(it.text, ctx.locale)}</span></>;
        const ext = it.href && /^https?:/.test(it.href);
        return it.href && !ctx.editable ? <a key={it.id} href={it.href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>{inner}</a> : <div key={it.id}>{inner}</div>;
      })}
    </div>
  );
}
