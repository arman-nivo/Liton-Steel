import "server-only";
import { cache } from "react";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import type { Site } from "../schema/types";
import { seedSite } from "../content/seed";
import { optimize } from "../optimize";
import type { DataAdapter } from "./adapter";
import { localAdapter } from "./local";
import { supabaseAdapter } from "./supabase";

/**
 * Picks the storage backend. Both are imported statically so the bundler can resolve them
 * (a dynamic require breaks in a production server bundle); the Supabase client itself is
 * only constructed on first use, so the local backend never touches it.
 */
export function adapter(): DataAdapter {
  return process.env.DATA_BACKEND === "supabase" ? supabaseAdapter : localAdapter;
}

/** Draft document (editor). Seeds from the PDF content on first run. */
export async function getDraft(): Promise<Site> {
  const a = adapter();
  const draft = await a.getSite("draft");
  if (draft) return draft;
  const published = await a.getSite("published");
  if (published) { await a.saveSite("draft", published); return published; }
  const seed = optimize(seedSite(), 1440).site;
  await a.saveSite("draft", seed);
  await a.saveSite("published", seed);
  return seed;
}

/** The stored published document. Cached across requests and tagged so publish can revalidate. */
const readPublished = unstable_cache(async (): Promise<Site> => {
  const a = adapter();
  return (await a.getSite("published")) ?? (await getDraft());
}, ["site-published-raw"], { tags: ["site"] });

/**
 * Published document (public site) with the optimisation engine applied (idempotent). The engine runs per
 * render, deduped per request, rather than inside the cross-request cache: that cache outlives deploys, so
 * caching its output would keep serving the old rules' results until the next publish.
 */
export const getPublished = cache(async (): Promise<Site> => optimize(await readPublished(), 1440).site);

export async function revalidateSite() {
  revalidateTag("site");
  revalidatePath("/", "layout");
}
