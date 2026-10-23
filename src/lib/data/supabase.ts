import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Site, SiteVersion } from "../schema/types";
import type { ContactMessage, DataAdapter, SiteKind } from "./adapter";

let client: SupabaseClient | null = null;
function sb() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase backend selected but NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are missing");
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
const bucket = () => process.env.SUPABASE_MEDIA_BUCKET || "media";

export const supabaseAdapter: DataAdapter = {
  async getSite(kind: SiteKind) {
    const { data, error } = await sb().from("site_documents").select("data").eq("id", kind).maybeSingle();
    if (error) throw error;
    return (data?.data as Site) ?? null;
  },
  async saveSite(kind, site) {
    const { error } = await sb().from("site_documents").upsert({ id: kind, data: site, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
  async listVersions() {
    const { data, error } = await sb().from("site_versions").select("id,label,created_at").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return (data ?? []).map((v) => ({ id: v.id, label: v.label, createdAt: v.created_at }));
  },
  async getVersion(id) {
    const { data, error } = await sb().from("site_versions").select("id,label,created_at,data").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? { id: data.id, label: data.label, createdAt: data.created_at, site: data.data as Site } : null;
  },
  async addVersion(v: SiteVersion, keep = 50) {
    const { error } = await sb().from("site_versions").insert({ id: v.id, label: v.label, created_at: v.createdAt, data: v.site });
    if (error) throw error;
    const all = await this.listVersions();
    const stale = all.slice(keep).map((x) => x.id);
    if (stale.length) await sb().from("site_versions").delete().in("id", stale);
  },
  async saveMessage(m: ContactMessage) {
    const { error } = await sb().from("contact_messages").insert({ id: m.id, name: m.name, email: m.email, phone: m.phone, message: m.message, locale: m.locale, created_at: m.createdAt });
    if (error) throw error;
  },
  async uploadFile(name, data, contentType) {
    const { error } = await sb().storage.from(bucket()).upload(name, data, { contentType, upsert: true });
    if (error) throw error;
    return sb().storage.from(bucket()).getPublicUrl(name).data.publicUrl;
  },
  async deleteFile(url) {
    const marker = `/object/public/${bucket()}/`;
    const i = url.indexOf(marker);
    if (i < 0) return;
    await sb().storage.from(bucket()).remove([url.slice(i + marker.length)]);
  },
};
