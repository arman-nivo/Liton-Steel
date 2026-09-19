import type { Locale, Site } from "@/lib/schema/types";
import { fontVariables } from "@/lib/fonts";
import { t } from "@/lib/utils";
import { ThemeStyle } from "./ThemeStyle";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppButton, CookieNotice, Analytics, PageTransition } from "./Extras";
import { MotionRuntime } from "@/lib/motion/MotionRuntime";

/** The <html>/<body> chrome shared by the public site and the draft preview. */
export function SiteFrame({ site, locale, children, banner }: { site: Site; locale: Locale; children: React.ReactNode; banner?: React.ReactNode }) {
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head><ThemeStyle theme={site.theme} /></head>
      <body data-locale={locale}>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#main" className="skip">Skip to content</a>
        {banner}
        <Nav items={site.nav} locale={locale} brand={t(site.company.shortName, locale)} pdfUrl={site.settings.pdfUrl} />
        <PageTransition />
        <main id="main">{children}</main>
        <Footer site={site} locale={locale} />
        {site.settings.showWhatsApp && site.company.whatsapp ? <WhatsAppButton number={site.company.whatsapp} locale={locale} /> : null}
        <CookieNotice locale={locale} enabled={site.settings.cookieNotice && !!process.env.NEXT_PUBLIC_GA_ID} />
        <Analytics />
        <MotionRuntime theme={site.theme.motion} />
        <style>{`.skip{position:absolute;left:-9999px;top:0}.skip:focus{left:16px;top:16px;z-index:100;background:var(--gold);color:var(--ink);padding:12px;border-radius:8px}`}</style>
      </body>
    </html>
  );
}
