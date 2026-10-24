/**
 * Section templates — one per company-profile page, plus a few generic ones.
 * Every template returns a fresh Section node tree with unique ids.
 */
import type { Animation, L10n, Node, StyleProps } from "../schema/types";
import { uid } from "../utils";
import * as C from "./copy";

type Opts = { name?: string; anchor?: string; style?: StyleProps; tablet?: StyleProps; mobile?: StyleProps; animation?: Animation; children?: Node[]; visibility?: Node["visibility"] };

export function node(type: Node["type"], props: Record<string, any> = {}, o: Opts = {}): Node {
  const n: Node = { id: uid(), type, props, style: { base: o.style ?? {} } };
  if (o.tablet) n.style.tablet = o.tablet;
  if (o.mobile) n.style.mobile = o.mobile;
  if (o.name) n.name = o.name;
  if (o.anchor) n.anchor = o.anchor;
  if (o.animation) n.animation = o.animation;
  if (o.visibility) n.visibility = o.visibility;
  if (o.children) n.children = o.children;
  return n;
}

// ---- style presets ----
export const S = {
  displayHeading: (extra: StyleProps = {}): StyleProps => ({ font: "token:display", size: "token:4xl", color: "token:gold", transform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.01em", ...extra }),
  subHeading: (extra: StyleProps = {}): StyleProps => ({ font: "token:body", size: "token:2xl", color: "token:gold", weight: 400, lineHeight: 1.1, ...extra }),
  body: (extra: StyleProps = {}): StyleProps => ({ font: "token:body", size: "token:base", color: "token:paper", lineHeight: 1.65, maxWidth: "64ch", ...extra }),
  small: (extra: StyleProps = {}): StyleProps => ({ font: "token:label", size: "token:sm", color: "token:gold", letterSpacing: "0.12em", transform: "uppercase", ...extra }),
  container: (extra: StyleProps = {}): StyleProps => ({ position: "relative", zIndex: 1, maxWidth: "var(--container)", margin: "0 auto", width: "100%", padding: ["calc(var(--tab-h) + 48px)", "clamp(20px, 5vw, 72px)", "clamp(72px, 10vh, 140px)", "clamp(20px, 5vw, 72px)"], ...extra }),
  containerMobile: (): StyleProps => ({ padding: ["calc(var(--tab-h) + 32px)", "20px", "64px", "20px"] }),
  grid2: (extra: StyleProps = {}): StyleProps => ({ display: "grid", columns: 2, gap: 8, alignItems: "start", ...extra }),
  stack: (extra: StyleProps = {}): StyleProps => ({ display: "flex", direction: "column", gap: 3, ...extra }),
  imageRounded: (extra: StyleProps = {}): StyleProps => ({ shape: "rounded", aspectRatio: "4 / 3", width: "100%", ...extra }),
};

const A = {
  fade: (delay = 0): Animation => ({ preset: "fade-rise", trigger: "enter", delay, duration: 0.9 }),
  mask: (): Animation => ({ preset: "mask-reveal-text", trigger: "enter", duration: 1 }),
  chars: (): Animation => ({ preset: "split-chars", trigger: "enter", duration: 0.9, stagger: 0.03 }),
  shard: (): Animation => ({ preset: "shard-slide", trigger: "enter", duration: 1.1 }),
  tab: (): Animation => ({ preset: "tab-drop", trigger: "enter", duration: 1 }),
  clip: (): Animation => ({ preset: "image-clip-expand", trigger: "enter", duration: 1.2 }),
  parallax: (): Animation => ({ preset: "parallax-depth", trigger: "scrub" }),
  pin: (): Animation => ({ preset: "pin-and-scrub", trigger: "scrub" }),
  hero: (): Animation => ({ preset: "scale-hero", trigger: "scrub" }),
  count: (): Animation => ({ preset: "count-up", trigger: "enter", duration: 1.6 }),
  horizontal: (): Animation => ({ preset: "horizontal-gallery", trigger: "scrub" }),
  magnetic: (): Animation => ({ preset: "magnetic-hover", trigger: "hover" }),
};

// ---- building blocks ----
const shard = (corner: "tl" | "tr" | "bl" | "br", tone: "paper" | "gold" | "ink" = "paper") =>
  node("DecorShard", { corner, tone }, { name: `Shard ${corner}`, animation: A.shard() });
const tab = (variant: "logo" | "stub" = "logo") => node("BookmarkTab", { variant }, { name: "Bookmark tab", animation: A.tab() });
const stamp = (position: "tr" | "bl" = "tr") => node("BrandStamp", { text: C.COMPANY.shortName, position, dots: true }, { name: "Brand stamp", animation: A.fade(0.2) });
const heading = (text: L10n, level: 1 | 2 | 3 = 2, extra: StyleProps = {}, anim: Animation = A.mask()) =>
  node("Heading", { text, level }, { name: "Heading", style: S.displayHeading(extra), animation: anim });
const sub = (text: L10n, extra: StyleProps = {}) => node("Heading", { text, level: 3 }, { name: "Sub-heading", style: S.subHeading(extra), animation: A.fade() });
const para = (text: L10n, extra: StyleProps = {}, delay = 0.1) => node("Text", { text, justify: true }, { name: "Paragraph", style: S.body(extra), animation: A.fade(delay) });
const img = (media: string, extra: StyleProps = {}, alt?: L10n) => node("Image", { media, alt }, { name: "Image", style: S.imageRounded(extra), animation: A.clip() });
const container = (children: Node[], extra: StyleProps = {}) => node("Container", { width: "default" }, { name: "Container", style: S.container(extra), mobile: S.containerMobile(), children });
const grid2 = (children: Node[], extra: StyleProps = {}) => node("Grid", {}, { name: "Two columns", style: S.grid2(extra), tablet: { columns: 1, gap: 6 }, children });
const stack = (children: Node[], extra: StyleProps = {}, name = "Stack") => node("Stack", {}, { name, style: S.stack(extra), children });
const section = (preset: string, anchor: string, children: Node[], props: Record<string, any> = {}, extra: StyleProps = {}) =>
  node("Section", { preset, tone: "ink", fullHeight: false, ...props }, { name: preset.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), anchor, style: { bg: "token:ink", ...extra }, children });

// ---- page templates ----
export function coverTemplate(): Node {
  return section("cover", "top", [
    node("Image", { media: "factory-aerial-court-hero", priority: true, alt: { en: "Aerial view of the Liton Steel factory complex with its helipad, sports court and gardens", bn: "হেলিপ্যাড, খেলার কোর্ট ও বাগানসহ লিটন স্টিল কারখানা কমপ্লেক্সের আকাশ থেকে তোলা দৃশ্য" } },
      { name: "Hero photo", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", opacity: 1, zIndex: 0, objectFit: "cover" }, animation: A.hero() }),
    node("DecorShard", { corner: "tr", tone: "paper" }, { name: "Shard tr", animation: A.shard(), style: { width: "min(38%, 420px)", height: "min(40%, 380px)" } }),
    shard("br", "gold"),
    tab("logo"),
    container([
      grid2([
        stack([
          node("Label", { text: C.COVER.label }, { name: "Company label", style: { font: "token:label", size: "token:md", alignSelf: "flex-start" }, animation: A.fade() }),
          heading(C.COVER.heading, 1, { size: "token:display", color: "token:paper" }, A.chars()),
          node("Text", { text: C.COVER.address }, { name: "Address", style: S.small({ maxWidth: "none" }), animation: A.fade(0.3) }),
          node("Stack", {}, { name: "Buttons", style: { display: "flex", direction: "row", wrap: true, gap: 2, margin: [3, 0, 0, 0] }, animation: A.fade(0.4), children: [
            node("Button", { label: C.COVER.ctaProjects, href: "/#our-projects", variant: "gold" }, { name: "Button", animation: A.magnetic() }),
            node("Button", { label: C.COVER.ctaContact, href: "/#contact", variant: "outline" }, { name: "Button", animation: A.magnetic() }),
          ] }),
        ], { gap: 3, justifyContent: "center" }),
        node("Capsule", { text: C.COVER.year, vertical: true }, { name: "Year capsule", style: { justifySelf: "end", alignSelf: "center", size: "token:2xl" }, tablet: { justifySelf: "start" }, mobile: { display: "none" }, animation: A.fade(0.5) }),
      ], { alignItems: "center", columns: 2 }),
    ], { padding: ["calc(var(--tab-h) + 56px)", "clamp(20px, 5vw, 72px)", "clamp(120px, 16vh, 200px)", "clamp(20px, 5vw, 72px)"] }),
  ], { fullHeight: true });
}

export function welcomeTemplate(): Node {
  return section("welcome", "welcome", [
    tab("logo"), shard("br", "gold"), stamp("bl"),
    container([
      grid2([
        stack([
          heading(C.WELCOME.hi, 2, { size: "token:3xl" }),
          heading(C.WELCOME.heading, 2, { size: "token:3xl", color: "token:paper" }),
          node("Grid", {}, { name: "Stats", style: { display: "grid", columns: 3, gap: 4, margin: [4, 0, 0, 0] }, mobile: { columns: 1 }, children:
            C.WELCOME.stats.map((s) => node("Stat", { value: s.value, suffix: s.suffix, label: s.label }, { name: "Stat", animation: A.count() })) }),
        ]),
        img("warehouse-interior-1", { filter: "bw", aspectRatio: "4 / 3", shape: "rounded" }, { en: "Completed steel warehouse interior built by Liton Steel", bn: "লিটন স্টিলের নির্মিত সম্পন্ন স্টিল ওয়্যারহাউসের অভ্যন্তর" }),
      ], { alignItems: "center" }),
    ]),
  ]);
}

export function tocTemplate(): Node {
  return section("table-of-contents", "contents", [
    tab("logo"), stamp("tr"),
    container([
      stack([
        heading({ en: "TABLE OF<br>CONTENTS", bn: "সূচি-<br>পত্র" }, 2, { size: "token:3xl" }),
        node("NumberList", { items: C.NAV.map((n) => ({ id: uid(), label: n.label, href: n.href })), startAt: 1 }, { name: "Contents list", style: { margin: [4, 0, 0, 0] }, animation: A.pin() }),
      ]),
    ]),
  ]);
}

export function aboutTemplate(): Node {
  return section("about", "about", [
    shard("tl", "paper"), tab("logo"), shard("br", "gold"), stamp("bl"),
    container([
      grid2([
        stack([heading(C.ABOUT.heading), para(C.ABOUT.p1), para(C.ABOUT.p2, {}, 0.2)]),
        node("Stack", {}, { name: "Image with striped circle", style: { position: "relative" }, children: [
          img("about-building", { filter: "bw", aspectRatio: "1 / 1", shape: "rounded" }),
          node("StripedCircle", { size: 160 }, { name: "Striped circle", style: { position: "absolute", right: "-6%", top: "-8%", zIndex: 2 }, mobile: { display: "none" }, animation: A.fade(0.4) }),
        ] }),
      ]),
    ]),
  ]);
}

export function leaderTemplate(kind: "ceo" | "md"): Node {
  const c = kind === "ceo" ? C.CEO : C.MD;
  const media = kind === "ceo" ? "ceo-abu-hassan-liton" : "md-abu-miraj-rudro";
  return section(kind === "ceo" ? "ceo-message" : "md-message", kind === "ceo" ? "ceo-message" : "md-message", [
    tab("logo"), stamp("tr"),
    container([
      grid2([
        stack([heading(c.heading), para(c.p1), para(c.p2, {}, 0.2)]),
        node("PersonCard", { name: c.name, role: c.role, media, labelStyle: "overlap", ...(kind === "ceo" ? {} : { frame: "photo" }) }, { name: "Portrait", style: { maxWidth: "380px", width: "100%", justifySelf: "center" }, tablet: { justifySelf: "start" }, animation: A.clip() }),
      ], { columns: 2 }),
    ]),
  ]);
}

export function visionTemplate(): Node {
  return section("vision-mission", "vision-mission", [
    shard("tl", "paper"), tab("logo"), stamp("bl"),
    container([
      grid2([
        stack([heading(C.VISION.heading), sub(C.VISION.visionTitle), para(C.VISION.vision), sub(C.VISION.missionTitle, { margin: [2, 0, 0, 0] }), para(C.VISION.mission)]),
        img("site-team-1", { filter: "bw", aspectRatio: "3 / 4", shape: "shard-tl", radius: "0", alignSelf: "end" }, { en: "Liton Steel site team in safety vests", bn: "নিরাপত্তা ভেস্ট পরা লিটন স্টিলের সাইট টিম" }),
      ]),
    ]),
  ]);
}

export function milestoneTemplate(): Node {
  return section("milestone", "milestone", [
    shard("tl", "paper"), tab("logo"), stamp("tr"),
    container([
      stack([
        img("factory-aerial-helipad", { filter: "bw", aspectRatio: "21 / 9", shape: "rounded" }, { en: "Aerial view of a factory complex with helipad built by Liton Steel", bn: "লিটন স্টিলের নির্মিত হেলিপ্যাডসহ কারখানা কমপ্লেক্সের আকাশ-দৃশ্য" }),
        grid2([
          stack([heading(C.MILESTONE.heading, 2, { margin: [3, 0, 0, 0] }), para(C.MILESTONE.p1), para(C.MILESTONE.p2, {}, 0.2)]),
          node("ClientList", { title: C.MILESTONE.clientsTitle, items: C.MILESTONE.clients.map((n) => ({ id: uid(), name: n })) }, { name: "Valuable clients", style: { margin: [3, 0, 0, 0], padding: [4, 4, 4, 4], bg: "rgba(255,255,255,0.04)", radius: "token:lg", border: "1px solid rgba(248,219,99,0.18)" }, animation: A.fade(0.2) }),
        ]),
      ], { gap: 6 }),
    ]),
  ]);
}

export function serviceTemplate(): Node {
  return section("our-service", "our-service", [
    shard("tl", "paper"), tab("logo"), stamp("tr"), shard("br", "gold"),
    container([
      grid2([
        stack([heading(C.SERVICE.heading), para(C.SERVICE.intro), sub(C.SERVICE.individualTitle, { margin: [2, 0, 0, 0] }), para(C.SERVICE.individual), sub(C.SERVICE.companyTitle, { margin: [2, 0, 0, 0] }), para(C.SERVICE.company)]),
        img("warehouse-frame-worker", { filter: "bw", aspectRatio: "3 / 4", shape: "rounded", alignSelf: "end" }, { en: "Liton Steel engineer inside a steel warehouse frame", bn: "স্টিল ওয়্যারহাউস ফ্রেমের ভেতরে লিটন স্টিলের প্রকৌশলী" }),
      ]),
    ]),
  ]);
}

export function processTemplate(): Node {
  return section("the-process", "the-process", [
    tab("logo"), stamp("tr"),
    container([
      stack([
        heading(C.PROCESS.heading),
        sub(C.PROCESS.sub, { margin: [2, 0, 0, 0] }),
        para(C.PROCESS.intro),
        node("ProcessSteps", { items: C.PROCESS.steps.map((s) => ({ id: uid(), title: s.title, text: s.text })), media: ["steel-frame-portrait-2", "plant-works-3", "floor-works-4"] }, { name: "Process steps", style: { margin: [4, 0, 0, 0] }, animation: A.pin() }),
        node("Quote", { text: C.PROCESS.quote }, { name: "Quote", style: { margin: [8, 0, 0, 0] }, animation: A.fade() }),
        node("BrandStamp", { text: C.COMPANY.shortName, position: "inline", dots: true }, { name: "Brand stamp", style: { justifySelf: "center", alignSelf: "center", margin: [3, 0, 0, 0] } }),
      ]),
    ]),
  ]);
}

export function goalsTemplate(): Node {
  return section("our-goals", "our-goals", [
    tab("logo"), stamp("tr"), shard("bl", "paper"),
    container([
      stack([
        grid2([stack([heading(C.GOALS.heading), para(C.GOALS.intro)]), img("goals-handshake", { filter: "bw", aspectRatio: "16 / 10", shape: "rounded" })], { alignItems: "center" }),
        grid2([
          stack([sub(C.GOALS.p1Title), para(C.GOALS.p1)]),
          stack([sub(C.GOALS.p2Title), para(C.GOALS.p2)]),
        ], { margin: [4, 0, 0, 0] }),
      ], { gap: 6 }),
    ]),
  ]);
}

export function projectsTemplate(): Node {
  return section("our-projects", "our-projects", [
    shard("tl", "paper"), tab("stub"), stamp("tr"),
    container([
      stack([
        grid2([heading(C.PROJECTS_SECTION.heading), para(C.PROJECTS_SECTION.intro, { alignSelf: "end" })], { alignItems: "end" }),
        node("ProjectGallery", { layout: "horizontal", limit: 8, category: "all", showFilters: false, moreLabel: C.PROJECTS_SECTION.more }, { name: "Project gallery", style: { margin: [4, 0, 0, 0] }, animation: A.horizontal() }),
      ]),
    ], { padding: ["calc(var(--tab-h) + 48px)", "clamp(20px, 5vw, 72px)", "clamp(72px, 10vh, 140px)", "clamp(20px, 5vw, 72px)"] }),
  ]);
}

export function projectsPageTemplate(): Node {
  return section("projects-index", "projects", [
    shard("tl", "paper"), tab("stub"), stamp("tr"),
    container([
      stack([
        grid2([heading({ en: "OUR<br>PROJECTS", bn: "আমাদের<br>প্রকল্প" }, 1), para(C.PROJECTS_SECTION.intro, { alignSelf: "end" })], { alignItems: "end" }),
        node("ProjectGallery", { layout: "grid", category: "all", showFilters: true, headingLevel: 2 }, { name: "Project grid", style: { margin: [4, 0, 0, 0] } }),
      ]),
    ], { padding: ["calc(var(--tab-h) + 48px)", "clamp(20px, 5vw, 72px)", "clamp(72px, 10vh, 140px)", "clamp(20px, 5vw, 72px)"] }),
  ]);
}

export function adminTemplate(): Node {
  const person = (p: (typeof C.ADMIN.people)[number], i: number) =>
    node("PersonCard", { name: p.name, role: p.role, media: p.media, labelStyle: "below" }, { name: "Person", animation: A.fade(i * 0.1) });
  return section("administrative-panel", "administrative-panel", [
    tab("logo"), stamp("tr"),
    container([
      stack([
        heading(C.ADMIN.heading),
        // Two rows of two portraits. The max-width keeps each card the same size it had in the
        // previous three-up row, rather than stretching two cards across the whole container.
        node("Grid", { autoColumns: true }, { name: "Leadership", style: { display: "grid", gap: 5, margin: [4, 0, 0, 0], maxWidth: "880px", width: "100%", alignSelf: "center" }, mobile: { columns: 1, maxWidth: "380px" }, children: C.ADMIN.people.slice(0, 2).map(person) }),
        node("RichText", { text: C.ADMIN.text1 }, { name: "Leadership note", style: S.body({ maxWidth: "80ch", align: "center", alignSelf: "center", width: "100%" }), animation: A.fade() }),
        node("Grid", { autoColumns: true }, { name: "Advisors", style: { display: "grid", gap: 5, margin: [6, 0, 0, 0], maxWidth: "880px", width: "100%", alignSelf: "center" }, mobile: { columns: 1, maxWidth: "380px" }, children: C.ADMIN.people.slice(2).map(person) }),
      ], { gap: 4 }),
    ]),
  ]);
}

export function teamTemplate(): Node {
  return section("meet-the-team", "meet-the-team", [
    tab("logo"), stamp("tr"), shard("br", "gold"),
    container([
      grid2([
        node("Heading", { text: C.TEAM.heading, level: 2 }, { name: "Heading", style: S.displayHeading({ position: "sticky", top: "120px" }), tablet: { position: "static" }, animation: A.mask() }),
        node("TeamList", { groups: C.TEAM.groups.map((g) => ({ id: uid(), role: g.role, members: g.members.map((m) => ({ id: uid(), name: m })) })), accordionOnMobile: true }, { name: "Team list", animation: A.fade() }),
      ], { columns: 2 }),
    ]),
  ]);
}

export function contactTemplate(): Node {
  return section("contact", "contact", [
    tab("logo"), shard("br", "gold"),
    container([
      grid2([
        stack([
          heading(C.CONTACT.heading),
          para(C.CONTACT.text, { size: "token:md", color: "token:gold" }),
          node("ContactDetails", { items: [
            { id: uid(), icon: "phone", text: { en: C.COMPANY.phone }, href: `tel:+${C.COMPANY.whatsapp}` },
            { id: uid(), icon: "mail", text: { en: C.COMPANY.email }, href: `mailto:${C.COMPANY.email}` },
            { id: uid(), icon: "pin", text: C.COMPANY.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.COMPANY.mapQuery)}` },
            { id: uid(), icon: "whatsapp", text: { en: "Chat on WhatsApp", bn: "হোয়াটসঅ্যাপে কথা বলুন" }, href: `https://wa.me/${C.COMPANY.whatsapp}` },
          ] }, { name: "Contact details", style: { margin: [3, 0, 0, 0] }, animation: A.fade(0.1) }),
          node("Button", { label: { en: "Download company profile (PDF)", bn: "কোম্পানি প্রোফাইল ডাউনলোড (PDF)" }, href: "/Liton-Steel-Company-Profile.pdf", variant: "outline", icon: "download", download: true }, { name: "Download PDF", style: { alignSelf: "flex-start", margin: [2, 0, 0, 0] }, animation: A.fade(0.2) }),
        ]),
        stack([
          node("ContactForm", { title: C.CONTACT.formTitle }, { name: "Contact form", animation: A.fade(0.1) }),
          node("Map", { query: C.COMPANY.mapQuery }, { name: "Map", style: { margin: [3, 0, 0, 0] }, animation: A.fade(0.2) }),
        ]),
      ]),
    ]),
  ]);
}

// ---- generic templates ----
export function blankTemplate(): Node {
  return section("blank", `section-${uid()}`, [tab("stub"), container([stack([heading({ en: "NEW<br>SECTION", bn: "নতুন<br>সেকশন" }), para({ en: "Start typing…", bn: "লিখতে শুরু করুন…" })])])]);
}
export function textImageTemplate(): Node {
  return section("text-image", `section-${uid()}`, [tab("logo"), stamp("tr"), container([grid2([stack([heading({ en: "HEADING<br>HERE", bn: "শিরোনাম<br>এখানে" }), para({ en: "Describe this section here.", bn: "এই সেকশনের বিবরণ লিখুন।" })]), img("warehouse-interior-1", { aspectRatio: "4 / 3" })])])]);
}
export function collageTemplate(): Node {
  return section("collage", `section-${uid()}`, [shard("tl", "paper"), tab("stub"), stamp("tr"), container([stack([
    node("ImageCollage", { items: ["site-truck-1", "site-frame-1", "site-frame-2", "site-truck-2"].map((m) => ({ id: uid(), media: m })), layout: "auto", lightbox: true }, { name: "Collage", animation: A.parallax() }),
    heading({ en: "OUR<br>PROJECT", bn: "আমাদের<br>প্রকল্প" }, 2, { margin: [4, 0, 0, 0] }),
    para({ en: "Add a short caption for this collage.", bn: "এই কোলাজের জন্য সংক্ষিপ্ত ক্যাপশন লিখুন।" }),
  ])])]);
}
export function quoteTemplate(): Node {
  return section("quote", `section-${uid()}`, [container([node("Quote", { text: C.PROCESS.quote, cite: C.COMPANY.name }, { name: "Quote", animation: A.fade() })], { padding: ["clamp(64px, 10vh, 120px)", "clamp(20px, 5vw, 72px)", "clamp(64px, 10vh, 120px)", "clamp(20px, 5vw, 72px)"] })]);
}
export function statsTemplate(): Node {
  return section("stats", `section-${uid()}`, [container([node("Grid", {}, { name: "Stats", style: { display: "grid", columns: 3, gap: 6 }, mobile: { columns: 1 }, children: C.WELCOME.stats.map((s) => node("Stat", { value: s.value, suffix: s.suffix, label: s.label }, { name: "Stat", animation: A.count() })) })], { padding: ["clamp(48px, 8vh, 96px)", "clamp(20px, 5vw, 72px)", "clamp(48px, 8vh, 96px)", "clamp(20px, 5vw, 72px)"] })]);
}
export function galleryTemplate(): Node {
  return section("gallery", `section-${uid()}`, [tab("stub"), stamp("tr"), container([stack([heading({ en: "GALLERY", bn: "গ্যালারি" }), node("ImageCollage", { items: ["roof-frames-1", "roof-frames-2", "roof-frames-3", "roof-frames-4", "floor-works-1", "floor-works-2"].map((m) => ({ id: uid(), media: m })), layout: "masonry", lightbox: true }, { name: "Gallery", style: { margin: [3, 0, 0, 0] }, animation: A.fade() })])])]);
}

export const TEMPLATES: { id: string; label: L10n; group: "profile" | "generic"; make: () => Node }[] = [
  { id: "cover", label: { en: "Cover / Hero", bn: "কভার / হিরো" }, group: "profile", make: coverTemplate },
  { id: "welcome", label: { en: "Welcome", bn: "স্বাগতম" }, group: "profile", make: welcomeTemplate },
  { id: "toc", label: { en: "Table of Contents", bn: "সূচিপত্র" }, group: "profile", make: tocTemplate },
  { id: "about", label: { en: "About Company", bn: "কোম্পানি পরিচিতি" }, group: "profile", make: aboutTemplate },
  { id: "ceo", label: { en: "CEO Message", bn: "সিইও-র বার্তা" }, group: "profile", make: () => leaderTemplate("ceo") },
  { id: "md", label: { en: "Message from MD", bn: "এমডি-র বার্তা" }, group: "profile", make: () => leaderTemplate("md") },
  { id: "vision", label: { en: "Vision & Mission", bn: "ভিশন ও মিশন" }, group: "profile", make: visionTemplate },
  { id: "milestone", label: { en: "Milestone + Clients", bn: "মাইলফলক ও গ্রাহক" }, group: "profile", make: milestoneTemplate },
  { id: "service", label: { en: "Our Service", bn: "আমাদের সেবা" }, group: "profile", make: serviceTemplate },
  { id: "process", label: { en: "The Process", bn: "কার্যপ্রণালী" }, group: "profile", make: processTemplate },
  { id: "goals", label: { en: "Our Goals", bn: "আমাদের লক্ষ্য" }, group: "profile", make: goalsTemplate },
  { id: "projects", label: { en: "Projects (horizontal)", bn: "প্রকল্প (আনুভূমিক)" }, group: "profile", make: projectsTemplate },
  { id: "projects-grid", label: { en: "Projects (grid + filters)", bn: "প্রকল্প (গ্রিড)" }, group: "profile", make: projectsPageTemplate },
  { id: "admin", label: { en: "Administrative Panel", bn: "প্রশাসনিক পর্ষদ" }, group: "profile", make: adminTemplate },
  { id: "team", label: { en: "Meet the Team", bn: "আমাদের টিম" }, group: "profile", make: teamTemplate },
  { id: "contact", label: { en: "Let's Connect", bn: "যোগাযোগ" }, group: "profile", make: contactTemplate },
  { id: "blank", label: { en: "Blank", bn: "খালি" }, group: "generic", make: blankTemplate },
  { id: "text-image", label: { en: "Text + Image", bn: "লেখা + ছবি" }, group: "generic", make: textImageTemplate },
  { id: "collage", label: { en: "Photo collage", bn: "ফটো কোলাজ" }, group: "generic", make: collageTemplate },
  { id: "gallery", label: { en: "Gallery grid", bn: "গ্যালারি গ্রিড" }, group: "generic", make: galleryTemplate },
  { id: "quote", label: { en: "Quote band", bn: "উদ্ধৃতি" }, group: "generic", make: quoteTemplate },
  { id: "stats", label: { en: "Stats band", bn: "পরিসংখ্যান" }, group: "generic", make: statsTemplate },
];

/** New elements the "+" insertion point can add inside a container */
export function elementTemplate(type: Node["type"]): Node {
  switch (type) {
    case "Heading": return heading({ en: "NEW<br>HEADING", bn: "নতুন<br>শিরোনাম" });
    case "Text": return para({ en: "New paragraph. Double-click to edit.", bn: "নতুন অনুচ্ছেদ। সম্পাদনা করতে ডাবল-ক্লিক করুন।" });
    case "RichText": return node("RichText", { text: { en: "Rich <strong>text</strong> with <span class=\"gold\">gold</span> words.", bn: "<strong>রিচ</strong> টেক্সট" } }, { name: "Rich text", style: S.body() });
    case "Image": return img("warehouse-interior-2");
    case "ImageCollage": return node("ImageCollage", { items: ["site-truck-1", "site-frame-1"].map((m) => ({ id: uid(), media: m })), layout: "auto", lightbox: true }, { name: "Collage" });
    case "Gallery": return node("ImageCollage", { items: ["roof-frames-1", "roof-frames-2", "roof-frames-3"].map((m) => ({ id: uid(), media: m })), layout: "masonry", lightbox: true }, { name: "Gallery" });
    case "Button": return node("Button", { label: { en: "Button", bn: "বাটন" }, href: "/#contact", variant: "gold" }, { name: "Button", style: { alignSelf: "flex-start" } });
    case "Icon": return node("Icon", { name: "star", size: 32 }, { name: "Icon", style: { color: "token:gold" } });
    case "Logo": return node("Logo", { variant: "mark" }, { name: "Logo", style: { width: "96px", color: "token:gold" } });
    case "Capsule": return node("Capsule", { text: { en: "2026" }, vertical: true }, { name: "Capsule", style: { size: "token:xl" } });
    case "Label": return node("Label", { text: { en: "LABEL" } }, { name: "Label", style: { alignSelf: "flex-start" } });
    case "NumberList": return node("NumberList", { items: C.NAV.slice(0, 4).map((n) => ({ id: uid(), label: n.label, href: n.href })), startAt: 1 }, { name: "Number list" });
    case "ProcessSteps": return node("ProcessSteps", { items: C.PROCESS.steps.slice(0, 4).map((s) => ({ id: uid(), title: s.title, text: s.text })), media: ["steel-frame-portrait-2", "plant-works-3", "floor-works-4"] }, { name: "Process steps" });
    case "PersonCard": return node("PersonCard", { name: { en: "Name" }, role: { en: "Role" }, media: "md-abu-miraj-rudro", labelStyle: "below" }, { name: "Person", style: { maxWidth: "320px" } });
    case "TeamList": return node("TeamList", { groups: [{ id: uid(), role: { en: "Role" }, members: [{ id: uid(), name: { en: "Name" } }] }], accordionOnMobile: true }, { name: "Team list" });
    case "ClientList": return node("ClientList", { title: { en: "Clients" }, items: [{ id: uid(), name: { en: "Client name" } }] }, { name: "Client list" });
    case "ProjectGallery": return node("ProjectGallery", { layout: "grid", category: "all", showFilters: true }, { name: "Project gallery" });
    case "Quote": return node("Quote", { text: { en: "A memorable quote goes here." } }, { name: "Quote" });
    case "Divider": return node("Divider", {}, { name: "Divider", style: { height: "1px", bg: "rgba(255,255,255,0.12)", width: "100%" } });
    case "DecorShard": return shard("br", "gold");
    case "BookmarkTab": return tab("logo");
    case "BrandStamp": return node("BrandStamp", { text: C.COMPANY.shortName, position: "inline", dots: true }, { name: "Brand stamp" });
    case "StripedCircle": return node("StripedCircle", { size: 140 }, { name: "Striped circle" });
    case "Map": return node("Map", { query: C.COMPANY.mapQuery }, { name: "Map" });
    case "ContactForm": return node("ContactForm", { title: C.CONTACT.formTitle }, { name: "Contact form" });
    case "ContactDetails": return node("ContactDetails", { items: [{ id: uid(), icon: "phone", text: { en: C.COMPANY.phone }, href: `tel:+${C.COMPANY.whatsapp}` }] }, { name: "Contact details" });
    case "Video": return node("Video", { src: "", autoplay: false, loop: true }, { name: "Video", style: { shape: "rounded", aspectRatio: "16 / 9", width: "100%" } });
    case "Spacer": return node("Spacer", { size: 6 }, { name: "Spacer" });
    case "Embed": return node("Embed", { html: "<div style=\"padding:24px;border:1px dashed #F8DB63;border-radius:16px\">Embed HTML</div>" }, { name: "Embed" });
    case "Stat": return node("Stat", { value: 35, suffix: "+", label: { en: "Years", bn: "বছর" } }, { name: "Stat", animation: A.count() });
    case "Container": return container([stack([para({ en: "Container" })])], { padding: [4, 4, 4, 4] });
    case "Grid": return grid2([para({ en: "Column 1" }), para({ en: "Column 2" })]);
    case "Stack": return stack([para({ en: "Stack" })]);
    default: return para({ en: "New element" });
  }
}

export const ELEMENT_TYPES: { type: Node["type"]; label: string; group: string }[] = [
  { type: "Heading", label: "Heading", group: "Text" }, { type: "Text", label: "Paragraph", group: "Text" }, { type: "RichText", label: "Rich text", group: "Text" },
  { type: "Quote", label: "Quote", group: "Text" }, { type: "Label", label: "Label chip", group: "Text" }, { type: "Stat", label: "Stat / counter", group: "Text" },
  { type: "Image", label: "Image", group: "Media" }, { type: "ImageCollage", label: "Image collage", group: "Media" }, { type: "Gallery", label: "Gallery", group: "Media" }, { type: "Video", label: "Video", group: "Media" },
  { type: "Button", label: "Button", group: "Actions" }, { type: "Icon", label: "Icon", group: "Actions" }, { type: "Logo", label: "Logo", group: "Brand" },
  { type: "Capsule", label: "Gold capsule", group: "Brand" }, { type: "BookmarkTab", label: "Bookmark tab", group: "Brand" }, { type: "BrandStamp", label: "Brand stamp", group: "Brand" },
  { type: "DecorShard", label: "Diagonal shard", group: "Brand" }, { type: "StripedCircle", label: "Striped circle", group: "Brand" },
  { type: "NumberList", label: "Numbered contents", group: "Lists" }, { type: "ProcessSteps", label: "Process steps", group: "Lists" }, { type: "TeamList", label: "Team list", group: "Lists" },
  { type: "ClientList", label: "Client list", group: "Lists" }, { type: "PersonCard", label: "Person card", group: "Lists" }, { type: "ProjectGallery", label: "Project gallery", group: "Lists" },
  { type: "ContactForm", label: "Contact form", group: "Contact" }, { type: "ContactDetails", label: "Contact details", group: "Contact" }, { type: "Map", label: "Map", group: "Contact" },
  { type: "Container", label: "Container", group: "Layout" }, { type: "Grid", label: "Grid", group: "Layout" }, { type: "Stack", label: "Stack", group: "Layout" },
  { type: "Spacer", label: "Spacer", group: "Layout" }, { type: "Divider", label: "Divider", group: "Layout" }, { type: "Embed", label: "Embed HTML", group: "Layout" },
];
