import type { Page, Site } from "../schema/types";
import { DEFAULT_THEME } from "../schema/tokens";
import { uid } from "../utils";
import * as C from "./copy";
import { PROJECTS } from "./projects";
import { SEED_MEDIA } from "./media";
import * as T from "./templates";

export function homePage(): Page {
  return {
    id: uid(), type: "Page", name: "Home",
    props: { slug: "home", title: { en: "M/S Liton Steel — Steel Structure & Civil Construction, Kushtia", bn: "মেসার্স লিটন স্টিল — স্টিল স্ট্রাকচার ও সিভিল নির্মাণ, কুষ্টিয়া" }, description: { en: "Liton Steel is a 35-year-old steel structure and civil construction company in Kushtia, Bangladesh: industrial sheds, warehouses, factories, foundations, resorts and more.", bn: "লিটন স্টিল কুষ্টিয়া, বাংলাদেশের ৩৫ বছরের পুরোনো স্টিল স্ট্রাকচার ও সিভিল নির্মাণ প্রতিষ্ঠান: ইন্ডাস্ট্রিয়াল শেড, ওয়্যারহাউস, কারখানা, ফাউন্ডেশন, রিসোর্ট ও আরও অনেক কিছু।" }, inNav: false },
    style: { base: {} },
    children: [
      T.coverTemplate(), T.welcomeTemplate(), T.tocTemplate(), T.aboutTemplate(), T.leaderTemplate("ceo"), T.leaderTemplate("md"),
      T.visionTemplate(), T.milestoneTemplate(), T.serviceTemplate(), T.processTemplate(), T.goalsTemplate(), T.projectsTemplate(),
      T.adminTemplate(), T.teamTemplate(), T.contactTemplate(),
    ],
  };
}

export function projectsPage(): Page {
  return {
    id: uid(), type: "Page", name: "Projects",
    props: { slug: "projects", title: { en: "Our Projects — Liton Steel", bn: "আমাদের প্রকল্প — লিটন স্টিল" }, description: { en: "Steel structures, industrial sheds, warehouses, factories, foundations and leisure facilities built by Liton Steel.", bn: "লিটন স্টিলের নির্মিত স্টিল স্ট্রাকচার, ইন্ডাস্ট্রিয়াল শেড, ওয়্যারহাউস, কারখানা, ফাউন্ডেশন ও অবসর স্থাপনা।" }, inNav: false },
    style: { base: {} },
    children: [T.projectsPageTemplate()],
  };
}

export function seedSite(): Site {
  return {
    id: "site",
    version: 1,
    updatedAt: new Date().toISOString(),
    theme: structuredClone(DEFAULT_THEME),
    company: { ...C.COMPANY, social: [] },
    nav: [...C.NAV, { id: "contact", label: { en: "Contact", bn: "যোগাযোগ" }, href: "/#contact" }],
    footer: {
      about: C.FOOTER.about,
      columns: [
        { id: uid(), title: { en: "Company", bn: "কোম্পানি" }, links: C.NAV.slice(0, 5) },
        { id: uid(), title: { en: "Work", bn: "কাজ" }, links: [C.NAV[5], C.NAV[6], { id: "projects-page", label: { en: "All projects", bn: "সব প্রকল্প" }, href: "/projects" }, C.NAV[8]] },
      ],
      note: C.FOOTER.note,
    },
    seo: { titleTemplate: "%s", defaultDescription: C.FOOTER.about, keywords: ["steel structure", "civil construction", "Kushtia", "Bangladesh", "industrial shed", "warehouse", "factory construction", "Liton Steel"] },
    settings: { pdfUrl: "/Liton-Steel-Company-Profile.pdf", showWhatsApp: true, cookieNotice: true },
    pages: [homePage(), projectsPage()],
    collections: { projects: structuredClone(PROJECTS) },
    media: structuredClone(SEED_MEDIA),
  };
}
