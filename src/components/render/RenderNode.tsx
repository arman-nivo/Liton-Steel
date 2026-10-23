import { Fragment } from "react";
import type { MediaItem, Node, Page } from "@/lib/schema/types";
import { buildPageCss } from "@/lib/schema/css";
import type { RenderCtx } from "./context";
import { Section, Container, Grid, Stack } from "./layout/Containers";
import { Heading, Text, RichText, Quote, Label, Capsule } from "./elements/text";
import { ImageEl, Video, Embed, IconEl, Logo, StripedCircle, DecorShard, BookmarkTab, BrandStamp, Divider, Spacer, Button } from "./elements/media";
import { PersonCard, ClientList, ContactDetails } from "./elements/lists";
import { ImageCollage } from "./elements/Collage";
import { TeamList } from "./elements/TeamList";
import { NumberList } from "./elements/NumberList";
import { ProcessSteps } from "./elements/ProcessSteps";
import { ProjectGallery } from "./elements/ProjectGallery";
import { Stat } from "./elements/Stat";
import { ContactForm } from "./elements/ContactForm";
import { MapEmbed } from "./elements/MapEmbed";

type C = React.ComponentType<{ node: Node; ctx: RenderCtx }>;
/** Client blocks only need the media they reference (and projects for galleries) — keeps the RSC payload small. */
const CLIENT_TYPES = new Set<Node["type"]>(["ImageCollage", "Gallery", "TeamList", "NumberList", "ProcessSteps", "ProjectGallery", "Stat", "ContactForm", "Map"]);
function slimCtx(node: Node, ctx: RenderCtx): RenderCtx {
  if (ctx.editable || !CLIENT_TYPES.has(node.type)) return ctx;
  const ids = new Set<string>();
  if (typeof node.props.media === "string") ids.add(node.props.media);
  if (Array.isArray(node.props.media)) node.props.media.forEach((m: string) => ids.add(m));
  if (Array.isArray(node.props.items)) node.props.items.forEach((it: { media?: string }) => it?.media && ids.add(it.media));
  const projects = node.type === "ProjectGallery" ? ctx.projects : [];
  if (node.type === "ProjectGallery") projects.forEach((p) => p.images.slice(0, 2).forEach((m) => ids.add(m)));
  const media = new Map<string, MediaItem>();
  // only what rendering needs: no blur placeholders, tags or upload metadata in the payload
  ids.forEach((id) => { const m = ctx.media.get(id); if (m) media.set(id, { id: m.id, src: m.src, width: m.width, height: m.height, alt: m.alt, focal: m.focal }); });
  return { locale: ctx.locale, editable: ctx.editable, media, projects, site: undefined as unknown as RenderCtx["site"], animIndex: ctx.animIndex };
}
const REGISTRY: Partial<Record<Node["type"], C>> = {
  Section, Container, Grid, Stack,
  Heading, Text, RichText, Quote, Label, Capsule,
  Image: ImageEl, Video, Embed, Icon: IconEl, Logo, StripedCircle, DecorShard, BookmarkTab, BrandStamp, Divider, Spacer, Button,
  PersonCard, ClientList, ContactDetails, ImageCollage, Gallery: ImageCollage, TeamList, NumberList, ProcessSteps, ProjectGallery, Stat, ContactForm, Map: MapEmbed,
};

export function RenderNode({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const Comp = REGISTRY[node.type];
  if (!Comp) return <div data-node-id={node.id} style={{ padding: 8, border: "1px dashed #f00" }}>Unknown block: {node.type}</div>;
  return <Comp node={node} ctx={slimCtx(node, ctx)} />;
}

export function RenderChildren({ node, ctx, insert }: { node: Node; ctx: RenderCtx; insert?: "section" | "element" }) {
  const kids = node.children ?? [];
  const Insert = ctx.editable && insert ? ctx.ui?.InsertionPoint : undefined;
  if (!Insert || !insert) return <>{kids.map((c) => <RenderNode key={c.id} node={c} ctx={ctx} />)}</>;
  return (
    <>
      {kids.map((c, i) => (
        <Fragment key={c.id}>
          {i === 0 || kids[i - 1].style.base.position === "absolute" ? null : <Insert parentId={node.id} index={i} kind={insert} />}
          <RenderNode node={c} ctx={ctx} />
        </Fragment>
      ))}
      <Insert parentId={node.id} index={kids.length} kind={insert} />
    </>
  );
}

export function RenderPage({ page, ctx }: { page: Page; ctx: RenderCtx }) {
  const css = buildPageCss(page, ctx.site.theme, ctx.media);
  // stagger order for the first section's CSS entrance animation
  const animIndex = new Map<string, number>();
  const first = page.children[0];
  if (first) { let i = 0; const walk = (n: Node) => { if (n.animation && n.animation.preset !== "none") animIndex.set(n.id, i++); n.children?.forEach(walk); }; walk(first); }
  ctx = { ...ctx, animIndex };
  return (
    <div className="ls-page" lang={ctx.locale} data-page-id={page.id} data-node-id={page.id} data-type="Page">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <RenderChildren node={page} ctx={ctx} insert="section" />
    </div>
  );
}
