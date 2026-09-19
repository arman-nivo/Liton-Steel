import type { FontKey, Theme } from "./types";

export const FONTS: Record<FontKey, { label: string; css: string; group: "display" | "body" | "bangla" }> = {
  archivo: { label: "Archivo Black", css: "var(--font-archivo), Impact, sans-serif", group: "display" },
  league: { label: "League Spartan", css: "var(--font-league), 'Arial Black', sans-serif", group: "display" },
  jost: { label: "Jost (Glacial Indifference alternative)", css: "var(--font-jost), Montserrat, system-ui, sans-serif", group: "body" },
  glacial: { label: "Glacial Indifference (self-hosted)", css: "var(--font-glacial)", group: "body" },
  montserrat: { label: "Montserrat", css: "var(--font-montserrat), system-ui, sans-serif", group: "body" },
  dm: { label: "DM Sans", css: "var(--font-dm), system-ui, sans-serif", group: "body" },
  michroma: { label: "Michroma (HK Modular alternative)", css: "var(--font-michroma), monospace", group: "display" },
  hind: { label: "Hind Siliguri", css: "var(--font-hind), 'Noto Sans Bengali', sans-serif", group: "bangla" },
  noto: { label: "Noto Sans Bengali", css: "var(--font-noto), 'Hind Siliguri', sans-serif", group: "bangla" },
  system: { label: "System UI", css: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", group: "body" },
};

export const DEFAULT_THEME: Theme = {
  colors: { ink: "#0F0F0E", black: "#000000", gold: "#F8DB63", goldSoft: "#FFDE59", paper: "#FFFFFF", mute: "#9E9670" },
  fonts: { display: "archivo", display2: "league", body: "jost", label: "dm", digit: "michroma", bangla: "hind" },
  type: { base: 16, ratio: 1.25 },
  space: 8,
  radius: { sm: 8, md: 16, lg: 24, xl: 40 },
  shardAngle: 12,
  motion: "cinematic",
  container: 1280,
};

export const TYPE_STEPS: Record<string, number> = {
  xs: -2, sm: -1, base: 0, md: 1, lg: 2, xl: 3, "2xl": 4, "3xl": 5, "4xl": 6, display: 7,
};
export const TYPE_SIZE_KEYS = Object.keys(TYPE_STEPS);

export const COLOR_TOKENS = ["ink", "black", "gold", "goldSoft", "paper", "mute"] as const;
export const RADIUS_TOKENS = ["sm", "md", "lg", "xl"] as const;

/** fluid clamp() between a min at 360px and max at 1440px container width */
export function fluid(min: number, max: number): string {
  if (Math.abs(max - min) < 0.5) return `${round(max)}px`;
  return `clamp(${round(min)}px, calc(${round(min)}px + ${round(max - min)} * ((100cqw - 360px) / 1080)), ${round(max)}px)`;
}
const round = (n: number) => Math.round(n * 100) / 100;

export function typeSize(theme: Theme, key: string, shrink = 1): { min: number; max: number } {
  const step = TYPE_STEPS[key] ?? 0;
  const max = theme.type.base * Math.pow(theme.type.ratio, step) * shrink;
  const minScale = step <= 0 ? 0.94 : Math.max(0.55, 1 - 0.065 * step);
  return { min: max * minScale, max };
}

export function cssVarForColor(key: string) {
  return key === "goldSoft" ? "--gold-soft" : `--${key}`;
}

/** Generates the :root token block for a theme. */
export function themeToCss(theme: Theme): string {
  const c = theme.colors;
  const lines: string[] = [];
  lines.push(`--ink:${c.ink};--black:${c.black};--gold:${c.gold};--gold-soft:${c.goldSoft};--paper:${c.paper};--mute:${c.mute};`);
  lines.push(`--font-display:${FONTS[theme.fonts.display].css};--font-display2:${FONTS[theme.fonts.display2].css};--font-body:${FONTS[theme.fonts.body].css};--font-label:${FONTS[theme.fonts.label].css};--font-digit:${FONTS[theme.fonts.digit].css};--font-bangla:${FONTS[theme.fonts.bangla].css};`);
  for (const k of TYPE_SIZE_KEYS) {
    const { min, max } = typeSize(theme, k);
    lines.push(`--text-${k}:${fluid(min, max)};`);
  }
  lines.push(`--space:${theme.space}px;--radius-sm:${theme.radius.sm}px;--radius-md:${theme.radius.md}px;--radius-lg:${theme.radius.lg}px;--radius-xl:${theme.radius.xl}px;`);
  const pct = Math.min(40, Math.max(6, Math.tan((theme.shardAngle * Math.PI) / 180) * 100));
  lines.push(`--shard-angle:${theme.shardAngle}deg;--shard-pct:${round(pct)}%;--container:${theme.container}px;--motion:${theme.motion};`);
  return `:root{${lines.join("")}}`;
}
