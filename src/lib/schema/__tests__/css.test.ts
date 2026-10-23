import { describe, it, expect } from "vitest";
import { buildPageCss, isBackgroundImage, styleToDecls } from "../css";
import { DEFAULT_THEME } from "../tokens";
import type { Node, Page } from "../types";

const n = (id: string, style: Node["style"], type: Node["type"] = "Stack"): Node => ({ id, type, props: {}, style });
const page = (children: Node[]): Page => ({ id: "p", type: "Page", props: { slug: "t", title: { en: "" } }, style: { base: {} }, children });

describe("buildPageCss", () => {
  it("emits one container query per breakpoint and merges identical blocks", () => {
    const css = buildPageCss(page([
      n("a", { base: { gap: 2 }, tablet: { gap: 1 }, mobile: { display: "none" } }),
      n("b", { base: { gap: 2 }, tablet: { gap: 1 } }),
    ]), DEFAULT_THEME);
    expect(css).toBe(
      ".n_a,.n_b{gap:calc(var(--space) * 2);}" +
      "@container page (max-width:1199px){.n_a,.n_b{gap:calc(var(--space) * 1);}}" +
      "@container page (max-width:767px){.n_a{display:none;}}",
    );
  });
  it("keeps base before tablet before phone for the same node", () => {
    const css = buildPageCss(page([n("a", { base: { width: "50%" }, tablet: { width: "80%" }, mobile: { width: "100%" } })]), DEFAULT_THEME);
    expect(css.indexOf("width:50%")).toBeLessThan(css.indexOf("width:80%"));
    expect(css.indexOf("width:80%")).toBeLessThan(css.indexOf("width:100%"));
  });
  it("shows CSS background photos at full width on tablet and phone", () => {
    const media = new Map([["m", { id: "m", src: "/m.jpg", width: 1600, height: 900, alt: "" }]]);
    const plain = buildPageCss(page([n("a", { base: { bgMedia: "m" } })]), DEFAULT_THEME, media);
    expect(plain).toContain("@container page (max-width:1199px){.n_a{background-size:100% auto;background-position:50% 0;background-repeat:no-repeat;}}");
    const overlay = buildPageCss(page([n("a", { base: { bgMedia: "m", bgOverlay: "rgba(0,0,0,.5)" } })]), DEFAULT_THEME, media);
    expect(overlay).toContain("background-size:100% 100%,100% auto;");
    const explicit = buildPageCss(page([n("a", { base: { bgMedia: "m", bgSize: "contain" } })]), DEFAULT_THEME, media);
    expect(explicit).not.toContain("1199px");
  });
});

describe("image helpers", () => {
  it("passes object-fit and object-position down to the img as variables", () => {
    expect(styleToDecls({ objectFit: "contain", objectPosition: "50% 20%" })).toBe("object-fit:contain;--ls-fit:contain;object-position:50% 20%;--ls-pos:50% 20%;");
  });
  it("recognises a full-bleed absolute image as a background", () => {
    expect(isBackgroundImage(n("i", { base: { position: "absolute", width: "100%", height: "100%" } }, "Image"))).toBe(true);
    expect(isBackgroundImage(n("i", { base: { position: "absolute", width: "40%", height: "100%" } }, "Image"))).toBe(false);
    expect(isBackgroundImage(n("s", { base: { position: "absolute", width: "100%", height: "100%" } }, "Stack"))).toBe(false);
  });
});
