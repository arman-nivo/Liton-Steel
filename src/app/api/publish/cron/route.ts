import { NextResponse } from "next/server";
import { adapter, getDraft, revalidateSite } from "@/lib/data";
import { optimize, hasBlockingIssues } from "@/lib/optimize";
import { uid } from "@/lib/utils";

/** Scheduled publish: call every few minutes (Vercel Cron / any scheduler) with ?key=CRON_SECRET. */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const draft = await getDraft();
  const at = (draft.settings as { scheduledPublishAt?: string }).scheduledPublishAt;
  if (!at || new Date(at).getTime() > Date.now()) return NextResponse.json({ ok: true, skipped: true });
  const r = optimize(draft, 1440);
  if (hasBlockingIssues(r.warnings)) return NextResponse.json({ ok: false, blocked: r.warnings.filter((w) => w.level === "error") }, { status: 422 });
  const published = { ...r.site, updatedAt: new Date().toISOString() };
  (published.settings as { scheduledPublishAt?: string }).scheduledPublishAt = undefined;
  await adapter().saveSite("published", published);
  await adapter().saveSite("draft", published);
  await adapter().addVersion({ id: `${Date.now()}-${uid().slice(0, 4)}`, label: `Scheduled publish ${new Date().toLocaleString("en-GB")}`, createdAt: new Date().toISOString(), site: published });
  await revalidateSite();
  return NextResponse.json({ ok: true, publishedAt: published.updatedAt });
}
