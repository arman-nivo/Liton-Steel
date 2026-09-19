import puppeteer from "puppeteer";
import fs from "fs";
const base = "http://localhost:3000";
const mode = process.argv[2] || "all";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-gpu"] });
const SECTIONS = ["top","welcome","contents","about","ceo-message","md-message","vision-mission","milestone","our-service","the-process","our-goals","our-projects","administrative-panel","meet-the-team","contact"];

async function newPage(w, h, reduce) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  if (reduce) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.on("pageerror", (e) => console.log(`[pageerror ${w}]`, e.message));
  page.on("console", (m) => { if (m.type() === "error") console.log(`[console ${w}]`, m.text().slice(0, 200)); });
  return page;
}

if (mode === "all" || mode === "strips") {
  for (const w of [360, 390, 768, 1024, 1440, 1920]) {
    const page = await newPage(w, w < 768 ? 800 : 900, true);
    await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 800));
    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth, document.body.scrollHeight]);
    console.log(`width ${w}: scrollWidth=${sw[0]} clientWidth=${sw[1]} height=${sw[2]}${sw[0] > sw[1] ? "  <-- HORIZONTAL OVERFLOW" : ""}`);
    await page.screenshot({ path: `out/home-${w}.png`, fullPage: true });
    await page.close();
  }
}
if (mode === "all" || mode === "sections") {
  for (const w of [1440, 390]) {
    const page = await newPage(w, w < 768 ? 800 : 900, false);
    await page.goto(base + "/", { waitUntil: "networkidle0", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1200));
    for (const id of SECTIONS) {
      await page.evaluate((id) => { document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" }); }, id);
      await new Promise((r) => setTimeout(r, 1600));
      await page.screenshot({ path: `out/sec-${w}-${id}.png` });
    }
    await page.close();
  }
}
if (mode === "all" || mode === "pages") {
  const page = await newPage(1440, 900, false);
  for (const [name, url] of [["projects", "/projects"], ["project-detail", "/projects/large-span-warehouse-frame"], ["bn-home", "/bn"], ["bn-projects", "/bn/projects"]]) {
    await page.goto(base + url, { waitUntil: "networkidle0", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: `out/page-${name}.png` });
    if (name === "project-detail" || name === "bn-home") {
      await page.evaluate(() => window.scrollTo(0, 900));
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: `out/page-${name}-2.png` });
    }
  }
  await page.close();
}
if (mode === "all" || mode === "editor") {
  const page = await newPage(1680, 1000, true);
  await page.goto(base + "/admin", { waitUntil: "networkidle0" });
  await page.screenshot({ path: "out/editor-login.png" });
  await page.type("input[type=password]", process.env.ADMIN_PASSWORD || "change-me");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0", timeout: 90000 }), page.keyboard.press("Enter")]);
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: "out/editor-1.png" });
  // select the about heading
  await page.evaluate(() => { const el = [...document.querySelectorAll('[data-type="Heading"]')][3]; el?.scrollIntoView({ block: "center" }); });
  await new Promise((r) => setTimeout(r, 500));
  const el = await page.$('[data-type="Heading"]:nth-of-type(1)');
  const hs = await page.$$('[data-type="Heading"]');
  if (hs[3]) await hs[3].click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "out/editor-2.png" });
  await page.close();
}
await browser.close();
console.log("done");
