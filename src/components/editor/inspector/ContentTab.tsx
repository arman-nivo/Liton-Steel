"use client";
import { useEditor } from "@/lib/store/editor";
import type { Node } from "@/lib/schema/types";
import { PROJECT_CATEGORIES } from "@/lib/schema/types";
import { Field, Input, Select, Toggle, TextArea, Btn } from "../ui";
import { L10nField, MediaField, ListEditor } from "../controls";
import { ICON_NAMES } from "@/components/render/elements/icons";
import { uid, slugify } from "@/lib/utils";
import { ProjectsEditor } from "./ProjectsEditor";

export function ContentTab({ node }: { node: Node }) {
  const updateProps = useEditor((s) => s.updateProps);
  const updateNode = useEditor((s) => s.updateNode);
  const p = node.props;
  const set = (patch: Record<string, unknown>) => updateProps(node.id, patch);
  const opt = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

  switch (node.type) {
    case "Heading": return <>
      <L10nField label="Text" value={p.text} onChange={(v) => set({ text: v })} rich />
      <Field label="Heading level"><Select value={String(p.level ?? 2)} onChange={(e) => set({ level: Number(e.target.value) })} options={opt(["1", "2", "3", "4", "5", "6"]).map((o) => ({ ...o, label: `H${o.value}` }))} /></Field>
      <Btn small variant="outline" onClick={() => set({ text: { ...p.text, en: String(p.text?.en ?? "").replace(/ (?=[^ ]+$)/, "<br>") } })}>Break last word to a new line</Btn>
    </>;
    case "Text": case "RichText": return <>
      <L10nField label="Text" value={p.text} onChange={(v) => set({ text: v })} rich />
      <Toggle checked={!!p.justify} onChange={(v) => set({ justify: v })} label="Justify (auto left-aligns in narrow columns)" />
    </>;
    case "Quote": return <><L10nField label="Quote" value={p.text} onChange={(v) => set({ text: v })} multiline /><L10nField label="Cite" value={p.cite} onChange={(v) => set({ cite: v })} /></>;
    case "Label": case "Capsule": return <><L10nField label="Text" value={p.text} onChange={(v) => set({ text: v })} />{node.type === "Capsule" ? <Toggle checked={p.vertical !== false} onChange={(v) => set({ vertical: v })} label="Vertical (stacked characters)" /> : null}</>;
    case "Image": return <>
      <MediaField label="Image" value={p.media} onChange={(id) => set({ media: id })} />
      <L10nField label="Alt text (override)" value={p.alt} onChange={(v) => set({ alt: v })} />
      <L10nField label="Caption" value={p.caption} onChange={(v) => set({ caption: v })} />
      <Toggle checked={!!p.priority} onChange={(v) => set({ priority: v })} label="Preload (above the fold)" />
    </>;
    case "ImageCollage": case "Gallery": return <>
      <Field label="Layout"><Select value={p.layout ?? "auto"} onChange={(e) => set({ layout: e.target.value })} options={opt(["auto", "hero", "pair", "trio", "quad", "masonry", "row"])} /></Field>
      <Toggle checked={!!p.lightbox} onChange={(v) => set({ lightbox: v })} label="Open in lightbox" />
      <MediaField label="Add images (drop 10 → 10 items)" multiple onMultiple={(ids) => set({ items: [...(p.items ?? []), ...ids.map((m) => ({ id: uid(), media: m }))] })} />
      <ListEditor items={p.items ?? []} onChange={(items) => set({ items })} render={(it: any, upd) => <><MediaField label="" value={it.media} onChange={(id) => upd({ media: id ?? it.media })} /><L10nField label="Alt" value={it.alt} onChange={(v) => upd({ alt: v })} /></>} />
    </>;
    case "Button": return <>
      <L10nField label="Label" value={p.label} onChange={(v) => set({ label: v })} />
      <Field label="Link (URL or /#anchor)"><Input value={p.href ?? ""} onChange={(e) => set({ href: e.target.value })} /></Field>
      <Field label="Style"><Select value={p.variant ?? "gold"} onChange={(e) => set({ variant: e.target.value })} options={opt(["gold", "outline", "paper", "ghost"])} /></Field>
      <Field label="Icon"><Select value={p.icon ?? ""} onChange={(e) => set({ icon: e.target.value || undefined })} options={[{ value: "", label: "none" }, ...opt(ICON_NAMES)]} /></Field>
      <Toggle checked={!!p.newTab} onChange={(v) => set({ newTab: v })} label="Open in new tab" />
      <Toggle checked={!!p.download} onChange={(v) => set({ download: v })} label="Download link" />
    </>;
    case "Icon": return <><Field label="Icon"><Select value={p.name ?? "star"} onChange={(e) => set({ name: e.target.value })} options={opt(ICON_NAMES)} /></Field><Field label="Size (px)"><Input type="number" value={p.size ?? 24} onChange={(e) => set({ size: Number(e.target.value) })} /></Field></>;
    case "Stat": return <>
      <Field label="Value"><Input type="number" value={p.value ?? 0} onChange={(e) => set({ value: Number(e.target.value) })} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><Field label="Prefix"><Input value={p.prefix ?? ""} onChange={(e) => set({ prefix: e.target.value })} /></Field><Field label="Suffix"><Input value={p.suffix ?? ""} onChange={(e) => set({ suffix: e.target.value })} /></Field></div>
      <L10nField label="Label" value={p.label} onChange={(v) => set({ label: v })} />
    </>;
    case "NumberList": return <>
      <Field label="Start at"><Input type="number" value={p.startAt ?? 1} onChange={(e) => set({ startAt: Number(e.target.value) })} /></Field>
      <ListEditor items={p.items ?? []} onChange={(items) => set({ items })} add={() => ({ id: uid(), label: { en: "New item" }, href: "/#" })} render={(it: any, upd) => <><L10nField label="Label" value={it.label} onChange={(v) => upd({ label: v })} /><Field label="Link"><Input value={it.href} onChange={(e) => upd({ href: e.target.value })} /></Field></>} />
    </>;
    case "ProcessSteps": return <>
      {[0, 1, 2].map((i) => <MediaField key={i} label={`Pill photo ${i + 1}`} value={p.media?.[i]} onChange={(id) => { const m = [...(p.media ?? [])]; if (id) m[i] = id; else m.splice(i, 1); set({ media: m }); }} />)}
      <ListEditor label="Steps" items={p.items ?? []} onChange={(items) => set({ items })} add={() => ({ id: uid(), title: { en: "New step" }, text: { en: "" } })} render={(it: any, upd) => <><L10nField label="Title" value={it.title} onChange={(v) => upd({ title: v })} /><L10nField label="Description" value={it.text} onChange={(v) => upd({ text: v })} multiline /></>} />
    </>;
    case "PersonCard": return <>
      <L10nField label="Name" value={p.name} onChange={(v) => set({ name: v })} />
      <L10nField label="Role" value={p.role} onChange={(v) => set({ role: v })} />
      <MediaField label="Portrait" value={p.media} onChange={(id) => set({ media: id })} />
      <Field label="Photo frame"><Select value={p.frame ?? "arch"} onChange={(e) => set({ frame: e.target.value })} options={[{ value: "arch", label: "Arch (crops the photo)" }, { value: "photo", label: "Full photo (no crop)" }]} /></Field>
      <Field label="Label style"><Select value={p.labelStyle ?? "overlap"} onChange={(e) => set({ labelStyle: e.target.value })} options={[{ value: "overlap", label: "Gold tag overlapping photo" }, { value: "below", label: "Name above, role below" }]} /></Field>
      <L10nField label="Short bio" value={p.bio} onChange={(v) => set({ bio: v })} multiline />
    </>;
    case "TeamList": return <>
      <Toggle checked={p.accordionOnMobile !== false} onChange={(v) => set({ accordionOnMobile: v })} label="Accordion on narrow screens" />
      <ListEditor label="Roles" items={p.groups ?? []} onChange={(groups) => set({ groups })} add={() => ({ id: uid(), role: { en: "New role" }, members: [{ id: uid(), name: { en: "Name" } }] })} render={(gp: any, upd) => <>
        <L10nField label="Role" value={gp.role} onChange={(v) => upd({ role: v })} />
        <ListEditor label="Members" items={gp.members ?? []} onChange={(members) => upd({ members })} add={() => ({ id: uid(), name: { en: "Name" } })} addLabel="Add member" render={(m: any, u2) => <L10nField label="Name" value={m.name} onChange={(v) => u2({ name: v })} />} />
      </>} />
    </>;
    case "ClientList": return <>
      <L10nField label="Title" value={p.title} onChange={(v) => set({ title: v })} />
      <ListEditor items={p.items ?? []} onChange={(items) => set({ items })} add={() => ({ id: uid(), name: { en: "Client name" } })} render={(it: any, upd) => <L10nField label="Client" value={it.name} onChange={(v) => upd({ name: v })} />} />
    </>;
    case "ProjectGallery": return <>
      <Field label="Layout"><Select value={p.layout ?? "grid"} onChange={(e) => set({ layout: e.target.value })} options={[{ value: "horizontal", label: "Horizontal (scrolls sideways)" }, { value: "grid", label: "Grid" }]} /></Field>
      <Field label="Category"><Select value={p.category ?? "all"} onChange={(e) => set({ category: e.target.value })} options={[{ value: "all", label: "All" }, ...PROJECT_CATEGORIES.map((c) => ({ value: c.id, label: c.label.en }))]} /></Field>
      <Field label="Limit (0 = all)"><Input type="number" value={p.limit ?? 0} onChange={(e) => set({ limit: Number(e.target.value) || undefined })} /></Field>
      <Toggle checked={!!p.showFilters} onChange={(v) => set({ showFilters: v })} label="Show category filters" />
      <Field label="Card title heading level"><Select value={String(p.headingLevel ?? 3)} onChange={(e) => set({ headingLevel: Number(e.target.value) })} options={[{ value: "2", label: "H2 (page has an H1 above)" }, { value: "3", label: "H3 (inside a section with an H2)" }]} /></Field>
      <L10nField label="“See all” button label (blank = none)" value={p.moreLabel} onChange={(v) => set({ moreLabel: v.en ? v : undefined })} />
      <ProjectsEditor />
    </>;
    case "ContactDetails": return <ListEditor items={p.items ?? []} onChange={(items) => set({ items })} add={() => ({ id: uid(), icon: "phone", text: { en: "" }, href: "" })} render={(it: any, upd) => <>
      <Field label="Icon"><Select value={it.icon} onChange={(e) => upd({ icon: e.target.value })} options={opt(["phone", "mail", "pin", "whatsapp", "clock", "globe"])} /></Field>
      <L10nField label="Text" value={it.text} onChange={(v) => upd({ text: v })} />
      <Field label="Link (tel:, mailto:, https:)"><Input value={it.href ?? ""} onChange={(e) => upd({ href: e.target.value })} /></Field>
    </>} />;
    case "ContactForm": return <><L10nField label="Title" value={p.title} onChange={(v) => set({ title: v })} /><L10nField label="Button label" value={p.buttonLabel} onChange={(v) => set({ buttonLabel: v })} /><L10nField label="Success message" value={p.successText} onChange={(v) => set({ successText: v })} /></>;
    case "Map": return <><Field label="Search query (Google Maps)"><Input value={p.query ?? ""} onChange={(e) => set({ query: e.target.value })} /></Field><Field label="Or embed URL"><Input value={p.embed ?? ""} onChange={(e) => set({ embed: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=…" /></Field></>;
    case "Video": return <><Field label="Video URL (mp4/webm)"><Input value={p.src ?? ""} onChange={(e) => set({ src: e.target.value })} /></Field><MediaField label="Poster" value={p.poster} onChange={(id) => set({ poster: id })} /><Toggle checked={!!p.autoplay} onChange={(v) => set({ autoplay: v })} label="Autoplay (muted)" /><Toggle checked={!!p.loop} onChange={(v) => set({ loop: v })} label="Loop" /></>;
    case "Embed": return <Field label="HTML"><TextArea value={p.html ?? ""} onChange={(e) => set({ html: e.target.value })} style={{ minHeight: 140, fontFamily: "ui-monospace, monospace", fontSize: 12 }} /></Field>;
    case "Spacer": return <Field label="Size (× base unit)"><Input type="number" value={p.size ?? 4} onChange={(e) => set({ size: Number(e.target.value) })} /></Field>;
    case "DecorShard": return <><Field label="Corner"><Select value={p.corner ?? "tl"} onChange={(e) => set({ corner: e.target.value })} options={opt(["tl", "tr", "bl", "br"])} /></Field><Field label="Tone"><Select value={p.tone ?? "paper"} onChange={(e) => set({ tone: e.target.value })} options={opt(["paper", "gold", "ink"])} /></Field></>;
    case "BookmarkTab": return <Field label="Variant"><Select value={p.variant ?? "logo"} onChange={(e) => set({ variant: e.target.value })} options={[{ value: "logo", label: "Tall tab with logo" }, { value: "stub", label: "Flat gold stub" }]} /></Field>;
    case "BrandStamp": return <><L10nField label="Text" value={p.text} onChange={(v) => set({ text: v })} /><Field label="Position"><Select value={p.position ?? "tr"} onChange={(e) => set({ position: e.target.value })} options={[{ value: "tr", label: "Top right" }, { value: "bl", label: "Bottom left" }, { value: "inline", label: "Inline (in flow)" }]} /></Field><Toggle checked={p.dots !== false} onChange={(v) => set({ dots: v })} label="Three dots" /></>;
    case "StripedCircle": return <Field label="Size (px)"><Input type="number" value={p.size ?? 140} onChange={(e) => set({ size: Number(e.target.value) })} /></Field>;
    case "Logo": return <Field label="Variant"><Select value={p.variant ?? "mark"} onChange={(e) => set({ variant: e.target.value })} options={opt(["mark"])} /></Field>;
    case "Section": return <>
      <Field label="Anchor id (for nav links: /#id)"><Input value={node.anchor ?? ""} onChange={(e) => updateNode(node.id, (n) => { n.anchor = slugify(e.target.value) || undefined; })} /></Field>
      <Toggle checked={!!p.fullHeight} onChange={(v) => set({ fullHeight: v })} label="Full viewport height on desktop" />
      <Field label="Tone"><Select value={p.tone ?? "ink"} onChange={(e) => set({ tone: e.target.value })} options={opt(["ink", "black", "paper", "gold"])} /></Field>
      <MediaField label="Background photo" value={p.bgMedia} onChange={(id) => set({ bgMedia: id })} />
      {p.bgMedia ? <><Field label="Photo filter"><Select value={p.bgFilter ?? "none"} onChange={(e) => set({ bgFilter: e.target.value })} options={opt(["none", "bw"])} /></Field><Field label={`Dark overlay ${Math.round((p.bgOverlay ?? 0.55) * 100)}%`}><input type="range" min={0} max={1} step={0.05} value={p.bgOverlay ?? 0.55} onChange={(e) => set({ bgOverlay: Number(e.target.value) })} /></Field></> : null}
    </>;
    case "Container": return <Field label="Width"><Select value={p.width ?? "default"} onChange={(e) => set({ width: e.target.value })} options={opt(["default", "narrow", "wide", "full"])} /></Field>;
    case "Grid": return <Toggle checked={!!p.autoColumns} onChange={(v) => set({ autoColumns: v })} label="Auto-balance columns from item count" />;
    default: return <p style={{ color: "#9a9a95", fontSize: 12 }}>No content fields for {node.type}. Use the Style and Layout tabs.</p>;
  }
}
