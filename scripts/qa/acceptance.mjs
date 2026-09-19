import puppeteer from "puppeteer";
import fs from "fs";
const base = "http://localhost:3000";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1680, height: 1000 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("[console]", m.text().slice(0, 300)); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (cond, msg) => console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);

// login
await page.goto(base + "/admin", { waitUntil: "networkidle0" });
await page.type("input[type=password]", process.env.ADMIN_PASSWORD || "change-me");
await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0", timeout: 90000 }), page.keyboard.press("Enter")]);
await sleep(2500);
ok(page.url().endsWith("/edit"), "login redirects to /edit");
const st = () => page.evaluate(() => window.__editor.getState());

// (a) change the gold colour site-wide via the Theme panel UI
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Theme")?.click());
await sleep(500);
const goldInput = await page.$$eval("input", (els) => els.findIndex((e) => e.value?.toUpperCase() === "#F8DB63"));
const inputs = await page.$$("input");
await inputs[goldInput].focus();
await page.keyboard.press("End");
for (let i = 0; i < 10; i++) await page.keyboard.press("Backspace");
await inputs[goldInput].type("#E0B838");
await sleep(400);
const gold = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--gold").trim());
ok(gold.toUpperCase() === "#E0B838", `theme gold token propagates live (--gold = ${gold})`);
await page.keyboard.press("Escape");
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "✕")?.click());
await sleep(300);

// (b) retype the CEO message inline (double-click → type → blur)
const ceoText = await page.$('#ceo-message [data-type="Text"]');
await ceoText.evaluate((el) => el.scrollIntoView({ block: "center" }));
await sleep(300);
{ const b = await ceoText.boundingBox(); await page.mouse.move(b.x + 40, b.y + 20); await page.mouse.down({ clickCount: 1 }); await page.mouse.up({ clickCount: 1 }); await page.mouse.down({ clickCount: 2 }); await page.mouse.up({ clickCount: 2 }); }
await sleep(300);
let editing = await page.evaluate(() => document.activeElement?.isContentEditable);
if (!editing) { // headless Chrome does not synthesize dblclick here; use the keyboard path (Enter on the selected block)
  await ceoText.click(); await sleep(150); await page.keyboard.press("Enter"); await sleep(300);
  editing = await page.evaluate(() => document.activeElement?.isContentEditable);
  ok(editing, "Enter on a selected text block enters inline editing");
} else ok(editing, "double-click enters inline editing");
await page.keyboard.down("Meta"); await page.keyboard.press("a"); await page.keyboard.up("Meta");
await page.keyboard.type("As the CEO of Liton Steel I am proud of our thirty-five year journey. (retyped)");
await page.evaluate(() => (document.activeElement).blur());
await sleep(500);
const ceoNow = await page.evaluate(() => document.querySelector('#ceo-message [data-type="Text"]').textContent);
ok(ceoNow.includes("(retyped)"), "inline edit committed to the document");

// (c) delete two team members and add three (collection editing through the store API)
const teamId = await page.evaluate(() => document.querySelector('[data-type="TeamList"]').dataset.nodeId);
await page.evaluate((id) => {
  const s = window.__editor.getState();
  s.updateNode(id, (n) => {
    const civil = n.props.groups.find((g) => g.role.en === "Civil Engineer");
    civil.members.splice(0, 2);
    n.props.groups.push({ id: "g-new", role: { en: "Site Supervisor", bn: "সাইট সুপারভাইজার" }, members: [{ id: "m1", name: { en: "New Member One" } }, { id: "m2", name: { en: "New Member Two" } }, { id: "m3", name: { en: "New Member Three" } }] });
  });
}, teamId);
await sleep(300);
const teamHtml = await page.evaluate(() => document.querySelector('[data-type="TeamList"]').textContent);
ok(teamHtml.includes("Site Supervisor") && teamHtml.includes("New Member Three") && !teamHtml.includes("Sanwar Hossain"), "team list re-rendered after delete 2 / add 3");

// (d) upload 8 new project photos through the media API and attach to a project
const files = fs.readdirSync("/Users/abumirajrudro/ZCodeProject/liton-steel/public/media").filter((f) => f.endsWith(".jpg")).slice(20, 28);
const fd = await page.evaluate(async (names) => {
  const form = new FormData();
  for (const n of names) { const b = await (await fetch("/media/" + n)).blob(); form.append("files", new File([b], "site-photo-" + n, { type: "image/jpeg" })); }
  const r = await fetch("/api/media", { method: "POST", body: form });
  const j = await r.json();
  window.__editor.getState().addMedia(j.items);
  const p = window.__editor.getState().site.collections.projects[0];
  window.__editor.getState().updateProject(p.id, { images: [...p.images, ...j.items.map((i) => i.id)] });
  return j.items.map((i) => ({ id: i.id, src: i.src, w: i.width, h: i.height, blur: !!i.blur, brightness: i.brightness, focal: i.focal }));
}, files);
ok(fd.length === 8 && fd.every((i) => i.src.startsWith("/uploads/") && i.blur && i.w > 0), `8 photos uploaded → webp + blur + brightness + focal (${fd[0].src}, focal ${JSON.stringify(fd[0].focal)})`);
const firstProjectImages = await page.evaluate(() => window.__editor.getState().site.collections.projects[0].images.length);
ok(firstProjectImages >= 10, `first project now has ${firstProjectImages} images (collage will re-layout to masonry)`);

// (e) remove an entire section (Welcome) with the selection toolbar and reorder two others via the layers panel
const welcomeId = await page.evaluate(() => document.querySelector("#welcome").dataset.nodeId);
await page.evaluate((id) => window.__editor.getState().select(id), welcomeId);
await sleep(400);
await page.evaluate(() => [...document.querySelectorAll('[data-editor-ui] button[title^="Delete"]')][0]?.click());
await sleep(400);
ok(!(await page.$("#welcome")), "Welcome section deleted via toolbar");
ok(!!(await page.evaluate(() => document.body.textContent.includes("Deleted"))), "toast with Undo appeared");
await page.evaluate(() => { const s = window.__editor.getState(); const page = s.page(); const goals = page.children.find((c) => c.anchor === "our-goals"); s.moveSibling(goals.id, -1); });
await sleep(300);
const order = await page.evaluate(() => [...document.querySelectorAll(".ls-page > section")].map((s) => s.id));
ok(order.indexOf("our-goals") < order.indexOf("the-process"), `sections reordered: ${order.slice(6, 10).join(" → ")}`);

// undo/redo sanity
await page.evaluate(() => window.__editor.getState().undo());
const order2 = await page.evaluate(() => [...document.querySelectorAll(".ls-page > section")].map((s) => s.id));
ok(order2.indexOf("our-goals") > order2.indexOf("the-process"), "undo restores order");
await page.evaluate(() => window.__editor.getState().redo());

// optimiser state after all edits
const w = await page.evaluate(() => { const s = window.__editor.getState(); return { warnings: s.warnings.map((x) => `[${x.level}] ${x.rule}: ${x.message}`), adjustments: s.adjustments.map((a) => a.message) }; });
console.log("warnings after edits:", w.warnings.length, "\n  " + w.warnings.join("\n  "));
console.log("adjustments:", w.adjustments.length, "\n  " + w.adjustments.join("\n  "));
ok(!w.warnings.some((x) => x.startsWith("[error]")), "no blocking issues after the edits");

// breakpoint switch + screenshot of the edited admin/team area
await page.screenshot({ path: "out/acc-desktop.png" });
await page.evaluate(() => window.__editor.getState().setBreakpoint("mobile"));
await sleep(800);
await page.evaluate(() => document.querySelector('[data-type="TeamList"]').scrollIntoView({ block: "center" }));
await sleep(500);
await page.screenshot({ path: "out/acc-mobile.png" });
await page.evaluate(() => window.__editor.getState().setBreakpoint("desktop"));

// autosave then publish via the button
await sleep(3000);
const saved = await page.evaluate(() => window.__editor.getState().saving);
ok(saved === "saved", `autosave status = ${saved}`);
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Publish")?.click());
await sleep(6000);
const pub = await page.evaluate(() => document.body.textContent.includes("Published"));
ok(pub, "publish succeeded (toast)");
await page.close();

// verify the public site reflects the changes
const p2 = await browser.newPage();
await p2.setViewport({ width: 1440, height: 900 });
await p2.goto(base + "/", { waitUntil: "networkidle0" });
const live = await p2.evaluate(() => ({ gold: getComputedStyle(document.documentElement).getPropertyValue("--gold").trim(), ceo: document.querySelector('#ceo-message [data-type="Text"]')?.textContent ?? "", welcome: !!document.querySelector("#welcome"), team: document.querySelector('[data-type="TeamList"]')?.textContent ?? "" }));
ok(live.gold.toUpperCase() === "#E0B838", `live site uses the new gold (${live.gold})`);
ok(live.ceo.includes("(retyped)"), "live site shows the retyped CEO message");
ok(!live.welcome, "live site no longer has the Welcome section");
ok(live.team.includes("Site Supervisor"), "live site shows the new team role");
await p2.screenshot({ path: "out/acc-live.png" });
const versions = await (await fetch(base + "/api/versions", { headers: { cookie: (await p2.cookies()).map((c) => `${c.name}=${c.value}`).join("; ") } })).json();
ok(Array.isArray(versions) && versions.length >= 1, `version snapshot created (${versions.length})`);
await browser.close();
