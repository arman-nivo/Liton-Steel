import { promises as fs } from "fs";
import path from "path";
import type { Site, SiteVersion } from "../schema/types";
import type { ContactMessage, DataAdapter, SiteKind } from "./adapter";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const VERSIONS = path.join(DATA, "versions");
const UPLOADS = path.join(ROOT, "public", "uploads");

async function ensure() {
  await fs.mkdir(VERSIONS, { recursive: true });
  await fs.mkdir(UPLOADS, { recursive: true });
}
async function readJson<T>(file: string): Promise<T | null> {
  try { return JSON.parse(await fs.readFile(file, "utf8")) as T; } catch { return null; }
}
async function writeJson(file: string, data: unknown) {
  await ensure();
  const tmp = `${file}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 1), "utf8");
  await fs.rename(tmp, file);
}

export const localAdapter: DataAdapter = {
  async getSite(kind: SiteKind) { return readJson<Site>(path.join(DATA, `site.${kind}.json`)); },
  async saveSite(kind, site) { await writeJson(path.join(DATA, `site.${kind}.json`), site); },
  async listVersions() {
    await ensure();
    const files = (await fs.readdir(VERSIONS)).filter((f) => f.endsWith(".json"));
    const out: Omit<SiteVersion, "site">[] = [];
    for (const f of files) {
      const v = await readJson<SiteVersion>(path.join(VERSIONS, f));
      if (v) out.push({ id: v.id, label: v.label, createdAt: v.createdAt });
    }
    return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getVersion(id) { return readJson<SiteVersion>(path.join(VERSIONS, `${id.replace(/[^a-z0-9-]/gi, "")}.json`)); },
  async addVersion(v, keep = 50) {
    await writeJson(path.join(VERSIONS, `${v.id}.json`), v);
    const all = await this.listVersions();
    for (const old of all.slice(keep)) await fs.unlink(path.join(VERSIONS, `${old.id}.json`)).catch(() => {});
  },
  async saveMessage(m) {
    const file = path.join(DATA, "messages.json");
    const list = (await readJson<ContactMessage[]>(file)) ?? [];
    list.unshift(m);
    await writeJson(file, list.slice(0, 1000));
  },
  async uploadFile(name, data) {
    await ensure();
    await fs.writeFile(path.join(UPLOADS, name), data);
    return `/uploads/${name}`;
  },
  async deleteFile(url) {
    if (!url.startsWith("/uploads/")) return;
    await fs.unlink(path.join(UPLOADS, path.basename(url))).catch(() => {});
  },
};
