import type { Locale } from "./schema/types";
export { t } from "./utils";
export const DEFAULT_LOCALE: Locale = "en";
export const isLocale = (s: string): s is Locale => s === "en" || s === "bn";
/** builds a locale-prefixed path; English lives at "/" (middleware rewrites to /en) */
export function localePath(locale: Locale, path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? (p === "/" ? "/" : p) : `/bn${p === "/" ? "" : p}`;
}
export const UI: Record<string, { en: string; bn: string }> = {
  menu: { en: "Menu", bn: "মেনু" },
  close: { en: "Close", bn: "বন্ধ" },
  contents: { en: "Table of Contents", bn: "সূচিপত্র" },
  allProjects: { en: "All projects", bn: "সব প্রকল্প" },
  viewProject: { en: "View project", bn: "প্রকল্প দেখুন" },
  backToProjects: { en: "Back to projects", bn: "প্রকল্পে ফিরুন" },
  location: { en: "Location", bn: "অবস্থান" },
  year: { en: "Year", bn: "বছর" },
  client: { en: "Client", bn: "গ্রাহক" },
  category: { en: "Category", bn: "শ্রেণি" },
  all: { en: "All", bn: "সব" },
  name: { en: "Your name", bn: "আপনার নাম" },
  email: { en: "Email", bn: "ইমেইল" },
  phone: { en: "Phone", bn: "ফোন" },
  message: { en: "Message", bn: "বার্তা" },
  send: { en: "Send message", bn: "বার্তা পাঠান" },
  sending: { en: "Sending…", bn: "পাঠানো হচ্ছে…" },
  sent: { en: "Thank you — we will get back to you shortly.", bn: "ধন্যবাদ—আমরা শিগগিরই আপনার সঙ্গে যোগাযোগ করব।" },
  failed: { en: "Could not send. Please call or email us instead.", bn: "পাঠানো যায়নি। অনুগ্রহ করে ফোন বা ইমেইল করুন।" },
  whatsapp: { en: "Chat on WhatsApp", bn: "হোয়াটসঅ্যাপে কথা বলুন" },
  downloadProfile: { en: "Download company profile", bn: "কোম্পানি প্রোফাইল ডাউনলোড" },
  cookieText: { en: "We use cookies for anonymous analytics to improve this site.", bn: "সাইট উন্নয়নে আমরা বেনামী বিশ্লেষণের জন্য কুকি ব্যবহার করি।" },
  accept: { en: "Accept", bn: "সম্মতি" },
  decline: { en: "Decline", bn: "প্রত্যাখ্যান" },
  notFound: { en: "Page not found", bn: "পৃষ্ঠা পাওয়া যায়নি" },
  home: { en: "Home", bn: "হোম" },
  projectsTitle: { en: "Our Projects", bn: "আমাদের প্রকল্প" },
  gallery: { en: "Gallery", bn: "গ্যালারি" },
  rights: { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
};
export const ui = (k: keyof typeof UI, locale: Locale) => UI[k]?.[locale] ?? UI[k]?.en ?? String(k);
