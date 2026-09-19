# QA scripts (headless Chrome)

These drive the site with Puppeteer. They are not part of the app bundle.

```bash
cd scripts/qa && npm init -y && npm i puppeteer     # one-time (downloads Chrome for Testing)
npm run dev                                        # in another terminal, from the repo root
node shoot.mjs all        # full-page + per-section screenshots at 360/390/768/1024/1440/1920 → out/
node acceptance.mjs       # the §10 acceptance test: theme colour, inline retype, team edits, 8 uploads,
                          # section delete/reorder, undo/redo, autosave, publish, live-site verification
```

`acceptance.mjs` logs in with the `ADMIN_PASSWORD` from `.env.local` (defaults to `change-me`) and mutates the draft —
run it against a disposable copy of `data/`, then delete `data/site.*.json` to re-seed.
