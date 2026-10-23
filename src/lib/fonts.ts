import { Archivo_Black, League_Spartan, Jost, Montserrat, DM_Sans, Michroma, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";

// Only the fonts needed for first paint are preloaded; the rest are declared (available to the theme) but load on demand.
export const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo", display: "swap" });
export const league = League_Spartan({ weight: ["700"], subsets: ["latin"], variable: "--font-league", display: "swap" });
// Upright only: the italic file (30 KB, preloaded on every page) served a few team names far down the page;
// Jost's italic is a plain oblique, which the browser synthesises from the upright face.
export const jost = Jost({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-jost", display: "swap" });
export const montserrat = Montserrat({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-montserrat", display: "swap", preload: false });
export const dmSans = DM_Sans({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-dm", display: "swap" });
export const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma", display: "swap", preload: false });
export const hind = Hind_Siliguri({ weight: ["400", "500", "700"], subsets: ["bengali", "latin"], variable: "--font-hind", display: "swap", preload: false });
export const noto = Noto_Sans_Bengali({ weight: ["400", "700"], subsets: ["bengali"], variable: "--font-noto", display: "swap", preload: false });

export const fontVariables = [archivo, league, jost, montserrat, dmSans, michroma, hind, noto].map((f) => f.variable).join(" ");
