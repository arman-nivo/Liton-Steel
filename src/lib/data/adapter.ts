import type { Site, SiteVersion } from "../schema/types";

export type SiteKind = "draft" | "published";
export interface ContactMessage { id: string; name: string; email: string; phone?: string; message: string; createdAt: string; locale?: string }

export interface DataAdapter {
  getSite(kind: SiteKind): Promise<Site | null>;
  saveSite(kind: SiteKind, site: Site): Promise<void>;
  listVersions(): Promise<Omit<SiteVersion, "site">[]>;
  getVersion(id: string): Promise<SiteVersion | null>;
  addVersion(v: SiteVersion, keep?: number): Promise<void>;
  saveMessage(m: ContactMessage): Promise<void>;
  uploadFile(name: string, data: Buffer, contentType: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
}
