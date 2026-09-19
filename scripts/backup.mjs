#!/usr/bin/env node
/**
 * Snapshots everything the editor owns (site content + uploaded photos) into backups/<timestamp>/.
 * Run it before any rebuild, restore or deploy:  npm run backup
 */
import { cp, mkdir, readdir } from "fs/promises";
import { existsSync } from "fs";

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dest = `backups/${stamp}`;
await mkdir(dest, { recursive: true });
for (const dir of ["data", "public/uploads"]) {
  if (existsSync(dir)) await cp(dir, `${dest}/${dir}`, { recursive: true });
}
const versions = existsSync("data/versions") ? (await readdir("data/versions")).length : 0;
console.log(`Backup written to ${dest}  (${versions} published version snapshot(s) included)`);
console.log("Restore by copying data/ and public/uploads/ back, then: npm run build:share");
