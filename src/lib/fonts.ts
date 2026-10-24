import localFont from "next/font/local";

// Self-hosted copies of the Google Fonts files (src/assets/fonts, SIL OFL — see OFL.txt). Loading them through
// next/font/google made builds fail at random: Google sometimes answers with dynamic `/l/font?kit=…` URLs that
// next/font can't parse. Only the fonts needed for first paint are preloaded; the rest are declared (available to the
// theme) but load on demand. Every face carries Google's unicode-range, so the browser skips (and never downloads) a
// font for characters it can't draw. next/font only accepts literal options, so values are written out in each call.

export const archivo = localFont({ src: "../assets/fonts/archivo-black-latin-400.woff2", weight: "400", style: "normal", variable: "--font-archivo", display: "swap", declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });
export const league = localFont({ src: "../assets/fonts/league-spartan-latin-700.woff2", weight: "700", style: "normal", variable: "--font-league", display: "swap", declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });
// Upright only: the italic file (30 KB, preloaded on every page) served a few team names far down the page;
// Jost's italic is a plain oblique, which the browser synthesises from the upright face.
export const jost = localFont({ src: "../assets/fonts/jost-latin-400-600.woff2", weight: "400 600", style: "normal", variable: "--font-jost", display: "swap", declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });
export const montserrat = localFont({ src: "../assets/fonts/montserrat-latin-400-600.woff2", weight: "400 600", style: "normal", variable: "--font-montserrat", display: "swap", preload: false, declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });
export const dmSans = localFont({ src: "../assets/fonts/dm-sans-latin-500-700.woff2", weight: "500 700", style: "normal", variable: "--font-dm", display: "swap", declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });
export const michroma = localFont({ src: "../assets/fonts/michroma-latin-400.woff2", weight: "400", style: "normal", variable: "--font-michroma", display: "swap", preload: false, declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }] });

// The Bangla fonts come as two files per weight, Bengali glyphs and Latin glyphs (Google's subsets). Each half is its
// own face limited by unicode-range, and globals.css joins them back into one family (--font-hind, --font-noto).
// The Bengali half gets no metric fallback: it would catch Latin characters before the Latin half is tried.
const hindBengali = localFont({
  src: [
    { path: "../assets/fonts/hind-siliguri-bengali-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/hind-siliguri-bengali-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/hind-siliguri-bengali-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-hind-bn",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1" }],
});
const hindLatin = localFont({
  src: [
    { path: "../assets/fonts/hind-siliguri-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/hind-siliguri-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/hind-siliguri-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-hind-latin",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const notoBengali = localFont({
  src: "../assets/fonts/noto-sans-bengali-bengali-400-700.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-noto-bn",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1" }],
});
const notoLatin = localFont({
  src: "../assets/fonts/noto-sans-bengali-latin-400-700.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-noto-latin",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

export const fontVariables = [archivo, league, jost, montserrat, dmSans, michroma, hindBengali, hindLatin, notoBengali, notoLatin].map((f) => f.variable).join(" ");
