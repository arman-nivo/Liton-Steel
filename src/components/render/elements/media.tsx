import Image from "next/image";
import Link from "next/link";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { attrs, mediaOf, type RenderCtx } from "../context";
import { Icon as LucideIcon } from "./icons";

export function LogoMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true" fill="currentColor">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M27 72V49l9-4v27z" />
      <path d="M40 72V33l12-6v45z" />
      <path d="M40 33l12-6 8 4-12 6z" opacity=".55" />
      <path d="M56 72V41l9-4v35z" />
      <path d="M56 41l9-4 6 3-9 4z" opacity=".55" />
      <path d="M24 72h52v3H24z" />
    </svg>
  );
}

export function Logo({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-logo", ctx);
  return <div {...a}><LogoMark style={{ width: "100%", height: "auto" }} /></div>;
}

export function MediaImage({ ctx, media, alt, priority, sizes, className, fill = true }: { ctx: RenderCtx; media?: string; alt?: string; priority?: boolean; sizes?: string; className?: string; fill?: boolean }) {
  const m = mediaOf(ctx, media);
  if (!m) return <div className={className} style={{ display: "grid", placeItems: "center", color: "var(--mute)", fontSize: 12, minHeight: 80 }}>No image</div>;
  const common = { alt: alt ?? m.alt ?? "", priority, sizes: sizes ?? "(max-width: 767px) 100vw, (max-width: 1199px) 90vw, 640px", placeholder: (m.blur ? "blur" : "empty") as "blur" | "empty", blurDataURL: m.blur, className };
  const unopt = m.src.startsWith("data:") || m.src.startsWith("blob:");
  if (fill) return <Image src={m.src} fill unoptimized={unopt} style={{ objectFit: "cover", objectPosition: m.focal ? `${m.focal[0] * 100}% ${m.focal[1] * 100}%` : undefined }} {...common} />;
  return <Image src={m.src} width={m.width} height={m.height} unoptimized={unopt} {...common} />;
}

export function ImageEl({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-img", ctx);
  const alt = t(node.props.alt, ctx.locale) || undefined;
  const caption = t(node.props.caption, ctx.locale);
  return (
    <figure {...a} style={{ margin: 0, ...(a.style ?? {}) }}>
      <MediaImage ctx={ctx} media={node.props.media ?? node.props.src} alt={alt} priority={!!node.props.priority} sizes={node.props.sizes} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function Video({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-video", ctx);
  if (!node.props.src) return <div {...a} style={{ display: "grid", placeItems: "center", color: "var(--mute)", minHeight: 120 }}>Add a video URL</div>;
  return <video {...a} src={node.props.src} poster={node.props.poster} autoPlay={!!node.props.autoplay} muted={!!node.props.autoplay} loop={!!node.props.loop} playsInline controls={!node.props.autoplay} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
}

export function Embed({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-embed", ctx);
  return <div {...a} dangerouslySetInnerHTML={{ __html: String(node.props.html ?? "") }} />;
}

export function IconEl({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-icon", ctx);
  return <span {...a} style={{ display: "inline-flex" }}><LucideIcon name={node.props.name} size={Number(node.props.size) || 24} /></span>;
}

export function StripedCircle({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-striped", ctx);
  const size = Number(node.props.size) || 140;
  return <div {...a} style={{ width: size, height: size }} aria-hidden="true" />;
}

export function DecorShard({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-shard", ctx);
  return <div {...a} data-corner={node.props.corner ?? "tl"} data-tone={node.props.tone ?? "paper"} aria-hidden="true" />;
}

export function BookmarkTab({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-tab", ctx);
  const variant = node.props.variant ?? "logo";
  return <div {...a} data-variant={variant} aria-hidden="true">{variant === "logo" ? <LogoMark /> : null}</div>;
}

export function BrandStamp({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-stamp", ctx);
  const text = t(node.props.text, ctx.locale) || "Liton Steel";
  return (
    <div {...a} data-position={node.props.position ?? "tr"}>
      <span>{text}</span>
      {node.props.dots !== false ? <span className="dots" aria-hidden="true"><i /><i /><i /></span> : null}
    </div>
  );
}

export function Divider({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-divider", ctx);
  return <hr {...a} style={{ border: 0, margin: 0 }} />;
}

export function Spacer({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-spacer", ctx);
  const size = Number(node.props.size) || 4;
  return <div {...a} style={{ height: `calc(var(--space) * ${size})` }} aria-hidden="true" />;
}

export function Button({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const a = attrs(node, "ls-btn", ctx);
  const label = t(node.props.label, ctx.locale);
  const href: string = node.props.href || "#";
  const external = /^https?:/i.test(href);
  const inner = <>{label}{node.props.icon ? <LucideIcon name={node.props.icon} size={18} /> : null}</>;
  const common = { ...a, "data-variant": node.props.variant ?? "gold" };
  if (ctx.editable) return <span {...common} role="link">{inner}</span>;
  if (external || node.props.download || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a {...common} href={href} target={node.props.newTab || external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} download={node.props.download ? true : undefined}>{inner}</a>;
  }
  return <Link {...common} href={href} scroll={!href.includes("#")}>{inner}</Link>;
}
