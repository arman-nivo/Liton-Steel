import { describe, it, expect } from "vitest";
import { optimize } from "../index";
import { fluidType } from "../rules/fluid-type";
import { autoLayout, bestColumns, collageLayoutFor, personTracks } from "../rules/layout";
import { rhythm } from "../rules/rhythm";
import { images } from "../rules/images";
import { contrast } from "../rules/contrast";
import { overflow } from "../rules/overflow";
import { consistency } from "../rules/consistency";
import { motionBudget, SECTION_BUDGET } from "../rules/motion";
import { seo } from "../rules/seo";
import { siteWith, node, section, findByType } from "./helpers";
import { seedSite } from "@/lib/content/seed";

describe("fluid-type", () => {
  it("steps long headings down and leaves short ones alone", () => {
    const short = node("Heading", { text: { en: "ABOUT<br>COMPANY" }, level: 2 }, { style: { size: "token:4xl" } });
    const long = node("Heading", { text: { en: "A VERY LONG HEADING THAT WOULD NEVER FIT" }, level: 2 }, { style: { size: "token:4xl" } });
    const r = optimize(siteWith([section([short, long])]), 1440, [fluidType]);
    const [s, l] = findByType(r.site.pages[0], "Heading");
    expect(s.auto?.size).toContain("clamp(");
    expect(l.auto?.size).toContain("clamp(");
    const max = (v: string) => parseFloat(v.split(",").pop()!);
    expect(max(l.auto!.size!)).toBeLessThan(max(s.auto!.size!));
    expect(r.adjustments.some((a) => a.rule === "fluid-type")).toBe(true);
  });
  it("respects explicit raw sizes", () => {
    const h = node("Heading", { text: { en: "A VERY LONG HEADING THAT WOULD NEVER FIT" }, level: 2 }, { style: { size: "72px" } });
    const r = optimize(siteWith([section([h])]), 1440, [fluidType]);
    expect(findByType(r.site.pages[0], "Heading")[0].auto?.size).toBeUndefined();
  });
  it("caps headings with a long unbreakable word to the column width", () => {
    const long = node("Heading", { text: { en: "ADMINISTRATIVE<br>PANEL" }, level: 2 }, { style: { size: "token:4xl" } });
    const short = node("Heading", { text: { en: "OUR<br>GOALS" }, level: 2 }, { style: { size: "token:4xl" } });
    const r = optimize(siteWith([section([long, short])]), 1440, [fluidType]);
    const [l, s] = findByType(r.site.pages[0], "Heading");
    expect(l.auto?.size).toMatch(/^min\(clamp\(.*\), calc\(\(100cqw - 48px\) \/ 10\.08\)\)$/);
    expect(s.auto?.size).toMatch(/^clamp\(/);
  });
});

describe("auto-layout", () => {
  it("picks collage layouts by image count", () => {
    expect([1, 2, 3, 4, 7].map(collageLayoutFor)).toEqual(["hero", "pair", "trio", "quad", "masonry"]);
    expect([3, 4, 5, 6, 7, 8].map(bestColumns)).toEqual([3, 4, 3, 3, 4, 4]);
  });
  it("re-arranges a collage when images are added", () => {
    const c = node("ImageCollage", { items: [{ id: "a", media: "site-truck-1" }, { id: "b", media: "site-frame-1" }], layout: "auto" });
    let r = optimize(siteWith([section([c])]), 1440, [autoLayout]);
    expect(findByType(r.site.pages[0], "ImageCollage")[0].computed?.layout).toBe("pair");
    const s2 = structuredClone(r.site);
    const col = findByType(s2.pages[0], "ImageCollage")[0];
    col.props.items.push({ id: "c", media: "site-frame-2" }, { id: "d", media: "site-truck-2" });
    r = optimize(s2, 1440, [autoLayout]);
    expect(findByType(r.site.pages[0], "ImageCollage")[0].computed?.layout).toBe("quad");
    expect(r.adjustments[0].message).toMatch(/quad/);
  });
  it("rebalances person grids and collapses empty stacks", () => {
    const people = Array.from({ length: 5 }, (_, i) => node("PersonCard", { name: { en: `P${i}` }, role: { en: "r" }, media: "riana-ferdoush" }));
    const grid = node("Grid", { autoColumns: true }, { style: { display: "grid" }, children: people });
    const empty = node("Stack", {}, { children: [] });
    const r = optimize(siteWith([section([grid, empty])]), 1440, [autoLayout]);
    expect(findByType(r.site.pages[0], "Grid")[0].auto?.columnsTemplate).toBe(personTracks(3, "0px"));
    expect(findByType(r.site.pages[0], "Stack")[0].auto?.display).toBe("none");
    expect(r.warnings.some((w) => w.message.includes("Empty Stack"))).toBe(true);
  });
  it("gives a lone person card the same size as the cards in another row of the section", () => {
    const card = (i: number) => node("PersonCard", { name: { en: `P${i}` }, role: { en: "r" }, media: "riana-ferdoush" });
    const pair = node("Grid", { autoColumns: true }, { style: { display: "grid", gap: 5 }, children: [card(1), card(2)] });
    const lone = node("Grid", { autoColumns: true }, { style: { display: "grid", gap: 5 }, children: [card(3)] });
    const r = optimize(siteWith([section([pair, node("Text", { text: { en: "bio" } }), lone])]), 1440, [autoLayout]);
    const [a, b] = findByType(r.site.pages[0], "Grid");
    expect(a.auto?.columnsTemplate).toBe(personTracks(2, "calc(var(--space) * 5)"));
    expect(b.auto?.columnsTemplate).toBe(a.auto?.columnsTemplate);
    expect(b.auto?.justifyContent).toBe("center");
    expect(b.auto?.columns).toBeUndefined();
  });
  it("keeps stat grids on plain columns", () => {
    const stats = Array.from({ length: 3 }, (_, i) => node("Stat", { value: i, label: { en: "x" } }));
    const r = optimize(siteWith([section([node("Grid", {}, { style: { display: "grid" }, children: stats })])]), 1440, [autoLayout]);
    const g = findByType(r.site.pages[0], "Grid")[0];
    expect(g.auto?.columns).toBe(3);
    expect(g.auto?.columnsTemplate).toBeUndefined();
  });
});

describe("rhythm", () => {
  it("snaps raw px spacing to the base unit", () => {
    const s = node("Stack", {}, { style: { padding: ["13px", "0", "21px", "0"], gap: "9px" }, children: [node("Text", { text: { en: "x" } })] });
    const r = optimize(siteWith([section([s])]), 1440, [rhythm]);
    const st = findByType(r.site.pages[0], "Stack")[0];
    expect(st.auto?.padding).toEqual(["16px", "0", "24px", "0"]);
    expect(st.auto?.gap).toBe("8px");
  });
});

describe("images", () => {
  it("derives sizes from grid columns and preloads the first image", () => {
    const img = node("Image", { media: "resort-pool" });
    const grid = node("Grid", {}, { style: { display: "grid", columns: 2 }, children: [img] });
    const r = optimize(siteWith([section([grid])]), 1440, [images]);
    const i = findByType(r.site.pages[0], "Image")[0];
    expect(i.computed?.sizes).toContain("640px");
    expect(i.computed?.priority).toBe(true);
  });
  it("warns for missing media", () => {
    const r = optimize(siteWith([section([node("Image", { media: "does-not-exist" })])]), 1440, [images]);
    expect(r.warnings.some((w) => w.message.includes("missing from the media library"))).toBe(true);
  });
  it("only preloads an image in the first section", () => {
    const later = node("Image", { media: "resort-pool" });
    const r = optimize(siteWith([section([node("Text", { text: { en: "intro" } })]), section([later])]), 1440, [images]);
    expect(findByType(r.site.pages[0], "Image")[0].computed?.priority).toBeUndefined();
  });
  it("treats a full-bleed absolute image as a 100vw background", () => {
    const bg = node("Image", { media: "resort-pool" }, { style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%" } });
    const r = optimize(siteWith([section([bg])]), 1440, [images]);
    const i = findByType(r.site.pages[0], "Image")[0];
    expect(i.computed?.sizes).toBe("100vw");
    expect(i.computed?.priority).toBe(true);
  });
  it("preloads a section background photo only in the first section", () => {
    const r = optimize(siteWith([section([], { bgMedia: "resort-pool" }), section([], { bgMedia: "resort-pool" })]), 1440, [images]);
    const [first, second] = findByType(r.site.pages[0], "Section");
    expect(first.computed?.bgPriority).toBe(true);
    expect(second.computed?.bgPriority).toBeUndefined();
  });
});

describe("contrast", () => {
  it("passes gold on ink and flags mute on ink for body text", () => {
    const ok = node("Heading", { text: { en: "X" }, level: 2 }, { style: { color: "token:gold" } });
    const bad = node("Text", { text: { en: "body" } }, { style: { color: "#3a3a3a" } });
    const r = optimize(siteWith([section([ok, bad])]), 1440, [contrast]);
    expect(r.warnings.filter((w) => w.rule === "contrast")).toHaveLength(1);
    expect(r.warnings[0].fix?.patch?.color).toMatch(/token:/);
  });
  it("adds a dark overlay when text sits over a bright photo", () => {
    const site = siteWith([section([node("Text", { text: { en: "over photo" } })], { bgMedia: "resort-pool", bgOverlay: 0 })]);
    site.media.find((m) => m.id === "resort-pool")!.brightness = 0.9;
    const r = optimize(site, 1440, [contrast]);
    expect(findByType(r.site.pages[0], "Section")[0].computed?.overlay).toContain("gradient");
    expect(r.adjustments.some((a) => a.rule === "contrast")).toBe(true);
  });
  it("leaves a dark hero photo clear and removes an overlay it no longer needs", () => {
    const hero = node("Image", { media: "resort-pool" }, { style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%" } });
    const site = siteWith([section([hero, node("Text", { text: { en: "address" } }, { style: { color: "token:gold" } })])]);
    site.media.find((m) => m.id === "resort-pool")!.brightness = 0.36; // a dusk aerial: gold and white text read fine over it
    findByType(site.pages[0], "Section")[0].computed = { overlay: "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.65))" }; // saved by an earlier run
    const r = optimize(site, 1440, [contrast]);
    expect(findByType(r.site.pages[0], "Section")[0].computed?.overlay).toBeUndefined();
    expect(r.adjustments.some((a) => a.message.includes("removed"))).toBe(true);
  });
});

describe("overflow", () => {
  it("caps wide fixed widths and raises small buttons", () => {
    const wide = node("Image", { media: "resort-pool" }, { style: { width: "900px" } });
    const btn = node("Button", { label: { en: "Go" }, href: "/", variant: "gold" }, { style: { height: "30px" } });
    const r = optimize(siteWith([section([wide, btn])]), 1440, [overflow]);
    expect(findByType(r.site.pages[0], "Image")[0].auto?.maxWidth).toBe("100%");
    expect(findByType(r.site.pages[0], "Button")[0].auto?.minHeight).toBe("44px");
  });
});

describe("consistency", () => {
  it("suggests the nearest token for off-palette colours", () => {
    const n = node("Text", { text: { en: "x" } }, { style: { color: "#ff0000" } });
    const r = optimize(siteWith([section([n])]), 1440, [consistency]);
    const w = r.warnings.find((x) => x.rule === "consistency")!;
    expect(w.fix?.patch?.color).toMatch(/^token:/);
  });
  it("accepts near-token colours silently", () => {
    const n = node("Text", { text: { en: "x" } }, { style: { color: "#F8DB64" } });
    const r = optimize(siteWith([section([n])]), 1440, [consistency]);
    expect(r.warnings.filter((x) => x.rule === "consistency")).toHaveLength(0);
  });
});

describe("motion-budget", () => {
  it("downgrades heavy presets when a section is over budget", () => {
    const many = Array.from({ length: SECTION_BUDGET + 2 }, () => node("Text", { text: { en: "t" } }, { animation: { preset: "split-chars" } }));
    const r = optimize(siteWith([section(many)]), 1440, [motionBudget]);
    expect(findByType(r.site.pages[0], "Text").every((n) => n.computed?.motionDowngrade)).toBe(true);
    const few = Array.from({ length: 3 }, () => node("Text", { text: { en: "t" } }, { animation: { preset: "split-chars" } }));
    const r2 = optimize(siteWith([section(few)]), 1440, [motionBudget]);
    expect(findByType(r2.site.pages[0], "Text").some((n) => n.computed?.motionDowngrade)).toBe(false);
  });
});

describe("seo", () => {
  it("derives title/description and requires alt text + one H1", () => {
    const h = node("Heading", { text: { en: "OUR<br>PROJECT" }, level: 2 });
    const p = node("Text", { text: { en: "First paragraph here." } });
    const img = node("Image", { media: "resort-pool" });
    const site = siteWith([section([h, p, img])]);
    site.media.find((m) => m.id === "resort-pool")!.alt = "";
    const r = optimize(site, 1440, [seo]);
    expect(r.site.pages[0].computed?.title).toContain("OUR PROJECT");
    expect(r.site.pages[0].computed?.description).toBe("First paragraph here.");
    expect(r.warnings.some((w) => w.level === "error" && w.message.includes("alt"))).toBe(true);
    expect(r.warnings.some((w) => w.message.includes("no H1"))).toBe(true);
  });
});

describe("full pipeline on the seed site", () => {
  it("runs every rule without blocking errors", () => {
    const r = optimize(seedSite(), 1440);
    expect(r.warnings.filter((w) => w.level === "error")).toHaveLength(0);
    expect(r.site.pages[0].children.length).toBeGreaterThan(10);
  });
});
