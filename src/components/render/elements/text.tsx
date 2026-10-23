import type { Node } from "@/lib/schema/types";
import { sanitizeHtml, t } from "@/lib/utils";
import { attrs, type RenderCtx } from "../context";

function textOf(node: Node, ctx: RenderCtx, field = "text") {
  return sanitizeHtml(t(node.props[field], ctx.locale));
}

/** Inline editing component, only present when the editor canvas renders the page. */
const editorText = (ctx: RenderCtx) => (ctx.editable ? ctx.ui?.EditableText : undefined);

export function Heading({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const level = Math.min(6, Math.max(1, Number(node.props.level) || 2));
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const html = textOf(node, ctx);
  const a = attrs(node, "ls-heading ls-rich", ctx);
  const Edit = editorText(ctx);
  if (Edit) return <Edit nodeId={node.id} locale={ctx.locale} html={html} tag={Tag} {...a} />;
  return <Tag {...a} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Text({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const raw = textOf(node, ctx);
  const html = /<p[\s>]/i.test(raw) ? raw : raw.split(/\n{2,}|<br\s*\/?>\s*<br\s*\/?>/i).map((p) => `<p>${p}</p>`).join("");
  const a = attrs(node, "ls-text ls-rich", ctx);
  const justify = node.props.justify ? "true" : undefined;
  const Edit = editorText(ctx);
  if (Edit) return <Edit nodeId={node.id} locale={ctx.locale} html={html} tag="div" {...a} data-justify={justify} />;
  return <div {...a} data-justify={justify} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const RichText = Text;

export function Quote({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const html = textOf(node, ctx);
  const cite = t(node.props.cite, ctx.locale);
  const a = attrs(node, "ls-quote ls-rich", ctx);
  const Edit = editorText(ctx);
  return (
    <blockquote {...a}>
      {Edit ? <Edit nodeId={node.id} locale={ctx.locale} html={html} tag="p" style={{ margin: 0 }} /> : <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />}
      {cite ? <cite>— {cite}</cite> : null}
    </blockquote>
  );
}

export function Label({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const html = textOf(node, ctx);
  const a = attrs(node, "ls-label ls-rich", ctx);
  const Edit = editorText(ctx);
  if (Edit) return <Edit nodeId={node.id} locale={ctx.locale} html={html} tag="span" {...a} />;
  return <span {...a} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Capsule({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const text = t(node.props.text, ctx.locale);
  const vertical = node.props.vertical !== false;
  const a = attrs(node, "ls-capsule", ctx);
  return (
    <div {...a} data-vertical={vertical ? "true" : "false"} aria-label={text}>
      {vertical ? Array.from(text).map((ch, i) => <span key={i} aria-hidden="true">{ch}</span>) : <span>{text}</span>}
    </div>
  );
}
