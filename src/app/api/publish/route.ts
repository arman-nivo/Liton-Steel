import { NextResponse } from "next/server";
import { adapter, getDraft, revalidateSite } from "@/lib/data";
import { optimize, hasBlockingIssues } from "@/lib/optimize";
import { guard } from "../_util";
import { uid } from "@/lib/utils";

/** Publishes the draft: runs the optimisation engine at build-time settings, refuses on blocking (accessibility) issues, snapshots a version and revalidates. */
export async function POST(req: Request) {
  const g = await guard("owner"); if (g.error) return g.error;
  const body = await req.json().catch(() => ({}));
  const draft = await getDraft();
  const r = optimize(draft, 1440);
  const force = body.force === true;
  if (hasBlockingIssues(r.warnings) && !force) {
    return NextResponse.json({ error: "Publish blocked: fix the accessibility issues below (or publish with force).", warnings: r.warnings.filter((w) => w.level === "error") }, { status: 422 });
  }
  const a = adapter();
  const published = { ...r.site, updatedAt: new Date().toISOString() };
  await a.saveSite("published", published);
  await a.addVersion({ id: `${Date.now()}-${uid().slice(0, 4)}`, label: body.label || `Published ${new Date().toLocaleString("en-GB")}`, createdAt: new Date().toISOString(), site: published });
  await revalidateSite();
  return NextResponse.json({ ok: true, warnings: r.warnings, adjustments: r.adjustments, publishedAt: published.updatedAt });
}
