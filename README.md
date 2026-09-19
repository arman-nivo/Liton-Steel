# M/S Liton Steel — corporate website + built-in visual editor

A production-grade Next.js 15 site for **M/S Liton Steel** (steel structure & civil construction, Kushtia, Bangladesh) that translates the company-profile PDF (black + gold + white, bookmark tab, diagonal shards, arch portraits, gold capsules) into a cinematic, bilingual (English/বাংলা) web experience — with a password-protected **in-place visual editor** and a **self-optimisation engine** that re-balances layout, type, images and motion after every edit.

```
Public site   →  /            (English)    /bn         (Bangla)
Projects      →  /projects    /projects/<slug>
Editor        →  /admin       (login)      /edit       (WYSIWYG editor)
Draft preview →  /preview/en?token=…        (shareable link from the editor's "Preview" button)
```

## 1. Quick start

```bash
cp .env.example .env.local        # set AUTH_SECRET and ADMIN_PASSWORD at minimum
npm install
npm run dev                       # http://localhost:3000  — editor at /admin
```

The first request seeds `data/site.draft.json` + `data/site.published.json` from the PDF content (`src/lib/content/`) and the 68 extracted photos in `public/media/`. No database is needed in `local` mode.

Other scripts: `npm test` (optimizer unit tests, vitest) · `npm run typecheck` · `npm run lint` · `npm run build && npm start` · `npm run lighthouse` (Lighthouse CI against a running production build).

## 2. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `AUTH_SECRET` | yes | signs the editor session cookie and the preview token |
| `ADMIN_PASSWORD` | yes | Owner login (publish, theme, versions) |
| `EDITOR_PASSWORD` | no | Editor login (content only, cannot publish) |
| `ADMIN_TOTP_SECRET` | no | base32 secret → 6-digit 2FA code required for the owner |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | absolute URL for sitemap, JSON-LD, Open Graph |
| `DATA_BACKEND` | no | `local` (default, JSON files) or `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_MEDIA_BUCKET` | with supabase | Postgres + Storage backend (run `supabase/migrations/001_init.sql`) |
| `CONTACT_TO_EMAIL`, `SMTP_*` | no | contact form e-mail delivery (nodemailer). Messages are always saved to the DB/`data/messages.json` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | no | Cloudflare Turnstile spam protection (honeypot + rate-limit are always on) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_GA_ID` | no | analytics (GA4 waits for cookie consent) |
| `CRON_SECRET` | no | enables `/api/publish/cron` for scheduled publishing |

## 3. How to edit (for the owner)

1. Open `/admin`, sign in, you land in `/edit`.
2. **Click** any element to select it; the right-hand **Inspector** has five tabs:
   *Content* (text in EN + BN, images, list items, collection editors) · *Style* (typography, colour tokens or custom colours, background, shape presets — arch, pill, diagonal shard —, B&W/duotone filter, shadows) · *Layout* (display, columns, gap, padding/margin box model, size, position, z-index, aspect ratio) · *Motion* (12 presets, trigger, delay, duration, easing, stagger, live preview) · *Advanced* (anchor id, class, per-device visibility, custom CSS).
3. **Double-click** any text to type in place. A floating toolbar lets you make a selected word **gold / white / outline / bold / italic** or change its tracking (micro edits).
4. Hover between blocks for the **+** insertion point (elements inside containers, section templates between sections). The **Templates** panel lists every company-profile page as a template (Cover, Welcome, Contents, About, CEO, MD, Vision, Milestone+Clients, Services, Process, Goals, Projects, Admin Panel, Team, Contact) plus generic ones.
5. **Layers** panel: drag to reorder, double-click to rename, eye = hide, lock. **Pages** panel: add pages (they become `/<slug>` routes), SEO title/description. **Media** panel: drag-and-drop upload (auto WebP, EXIF stripped, blur placeholder, brightness, focal point, low-res warning), set focal point by clicking the image, *Replace everywhere*.
6. Top bar: **Desktop / Tablet / Mobile** canvas, zoom, **EN / বাং** editing language, motion preview, undo/redo (150 steps), autosave status, **Theme** (global tokens: colours, font pairings, type scale, spacing unit, radius scale, shard angle, animation intensity, container; plus company/nav/footer/SEO), **Optimize** (what the engine changed + warnings with one-click fixes + DOM audit), **Versions** (compare & restore, scheduled publish), **Preview** (shareable draft link), **Publish**.
7. Shortcuts: ⌘Z / ⇧⌘Z undo-redo · ⌘D duplicate · Del delete (toast with Undo) · ⌥⌘C / ⌥⌘V copy-paste style · ⌘G group · ⌥↑/↓ reorder · ⌘S save now · Esc.

Publishing runs the optimisation engine at build settings and **refuses to publish** while an image has no alt text (accessibility gate); "Publish anyway" is available for owners.

## 4. Architecture

```
Site (theme tokens, company, nav, footer, seo, settings, media, collections.projects)
 └─ Page (slug, seo)
     └─ Section (tone, full-height, bg photo; shards / bookmark tab / brand stamp are child elements)
         └─ Container / Grid / Stack   (responsive style per breakpoint: base / tablet / mobile)
             └─ Element  Heading · Text · RichText · Image · ImageCollage · Gallery · Button · Icon · Logo · Capsule · Label ·
                          NumberList · ProcessSteps · PersonCard · TeamList · ClientList · ProjectGallery · Quote · Divider ·
                          DecorShard · BookmarkTab · BrandStamp · StripedCircle · Map · ContactForm · ContactDetails · Video · Spacer · Embed · Stat
```

* `src/lib/schema/types.ts` — node schema (`{ id, type, props, style:{base,tablet,mobile}, auto, computed, animation, visibility, locked, children }`).
* `src/lib/schema/tokens.ts` / `css.ts` — design tokens → CSS custom properties; node styles → one generated stylesheet. Breakpoints are **container queries** on `.ls-page`, so the editor canvas can be resized without an iframe; fluid type uses `clamp()` with `cqw`.
* `src/lib/content/` — copy (EN + BN), projects, media manifest, **section templates**, seed document.
* `src/components/render/` — the renderer used by both the public site (RSC) and the editor canvas (client). Interactive blocks are client components.
* `src/lib/motion/` — GSAP + ScrollTrigger + Lenis runtime; presets in `presets.ts`; `capability.ts` downgrades on `prefers-reduced-motion`, save-data and low-core devices.
* `src/lib/optimize/` — the engine (`optimize(site, viewport) → { site, warnings, adjustments }`) with one file per rule and tests in `__tests__/`.
* `src/lib/store/editor.ts` — zustand + immer store with undo/redo; `src/components/editor/` — editor UI.
* `src/lib/data/` — storage adapters (`local` JSON files, `supabase`); `src/app/api/` — auth, site draft, publish, versions, media upload (sharp), contact.

### Adding a new section template
1. Add a factory in `src/lib/content/templates.ts` that returns a `Section` node (use the `heading/para/img/container/grid2/stack` helpers).
2. Register it in the `TEMPLATES` array (id, bilingual label, group). It appears in the Templates panel and the "+" menu immediately.
3. For a brand-new element type: add it to `NodeType`, add a component in `src/components/render/elements/`, register it in `RenderNode.tsx`'s `REGISTRY`, add a default in `elementTemplate()` and (optionally) content fields in `inspector/ContentTab.tsx`.

## 5. Self-optimisation engine (§6 of the brief)

| Rule | What it does |
|---|---|
| fluid-type | headings get `clamp()` sizes from the type-scale token; long headings step down (min 55 %) to fit ≤3 lines; `text-wrap: balance/pretty`, justified body switches to left-align in narrow containers (CSS) |
| auto-layout | collages re-arrange by image count (1 hero · 2 offset pair · 3 one-large+two · 4 overlapping quad · 5+ masonry); person/stat grids rebalance columns and centre the last row; empty containers collapse; heavy full-height sections release the viewport lock |
| rhythm | raw pixel spacing snaps to the base unit |
| images | responsive `sizes` from the column layout, hero preload, > 400 KB and low-resolution warnings |
| contrast | WCAG AA check for every text/background pair incl. text over photos (image brightness); auto dark-gradient overlay or a one-click gold/white fix |
| overflow | fixed widths capped for phones, 44 px tap targets; the editor's DOM audit adds runtime overlap / clipping / horizontal-scroll checks |
| consistency | off-palette colours / non-system fonts get a "snap to nearest token" suggestion |
| motion-budget | > 18 animated elements in a section downgrade heavy presets to fade-rise |
| seo | title/description derived from the first heading/paragraph, exactly one H1, alt text required (blocks publish), JSON-LD Organization + LocalBusiness, sitemap.xml, robots.txt, Open Graph image in brand style |

Lighthouse CI budget (`lighthouserc.cjs`, GitHub Actions `ci.yml`): Performance ≥ 90 mobile, LCP < 2.5 s, CLS < 0.05, INP < 200 ms, Accessibility ≥ 95, SEO ≥ 95.

Measured on the production build (Lighthouse 12, mobile emulation with 4× CPU slowdown and throttled 4G, local server):

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` (home, 15 sections) | 91 | 100 | 100 | 100 | 3.5 s | 0 | 20 ms |
| `/projects` | 92 | 100 | 100 | 100 | 3.4 s | 0 | 10 ms |
| `/projects/<slug>` | 87 | 100 | 100 | 100 | 4.0 s | 0 | 10 ms |
| `/bn` (Bangla home) | 83 | 100 | 100 | 100 | 4.4 s | 0 | 10 ms |

LCP under throttled mobile 4G is above the 2.5 s target because the hero photo (extracted from the PDF at 864 px) is the LCP element; a real high-resolution hero photo served through `next/image` at ~1600 px, or a CDN, closes that gap. Desktop scores are all 95+.

How the budget is met: the first section animates with pure CSS (so the hero paints before any JavaScript), GSAP + Lenis load after hydration, scroll presets are attached lazily as blocks approach the viewport, and only the five first-paint font files are preloaded.

## 5b. QA scripts

`scripts/qa/` contains the Puppeteer scripts used to verify the build: `shoot.mjs` renders every section at 360 / 390 / 768 / 1024 / 1440 / 1920 px, and `acceptance.mjs` performs the §10 acceptance test end-to-end (change the gold token, retype the CEO message inline, delete two team members and add three, upload eight photos, delete a section and reorder two others, undo/redo, autosave, publish, and verify the live site). See `scripts/qa/README.md`.

## 6. Deploying

**Vercel (recommended)** — the filesystem is read-only, so set `DATA_BACKEND=supabase` and the Supabase variables (run the SQL migration once, create the public `media` bucket). Set `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`. `vercel.json` schedules the cron for scheduled publishing (set `CRON_SECRET`).

**VPS / Docker / any Node host** — `local` mode works as-is: `npm run build && npm start`; keep `data/` and `public/uploads/` on a persistent volume.

The company profile PDF is served from `/Liton-Steel-Company-Profile.pdf` (compressed to ~8.6 MB). Glacial Indifference is not on Google Fonts; drop the `.woff2` files into `public/fonts/` (see the README there) and pick it in Theme → Fonts. Until then the site uses Jost.

## 7. Known limitations / next steps

* **Photos** — all 68 images were extracted from the PDF, so the largest is 1120 px wide. The optimisation engine flags the hero and a few wide slots as "may look soft"; upload the original camera files through the Media panel (they are converted to WebP, given blur placeholders and a focal point automatically) and use *Replace everywhere*.
* **Fonts** — Glacial Indifference and HK Modular are not bundled (licence/source); Jost and Michroma stand in and both are theme tokens.
* **Local backend on Vercel** — the JSON backend cannot write on Vercel; use Supabase there (see §6). Scheduled publish needs `CRON_SECRET`.
* **E-mail / spam protection / analytics** are wired but off until their env vars are set.
* **Editor drag & drop** — reordering is drag-and-drop in the Layers panel and via ⌥↑/↓ or the selection toolbar on the canvas; dragging blocks directly on the canvas is not implemented.
