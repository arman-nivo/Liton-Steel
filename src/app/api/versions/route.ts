import { NextResponse } from "next/server";
import { adapter } from "@/lib/data";
import { guard } from "../_util";

export async function GET() {
  const g = await guard(); if (g.error) return g.error;
  return NextResponse.json(await adapter().listVersions());
}

/** Restore: copies a version into the draft (publish afterwards to make it live). */
export async function POST(req: Request) {
  const g = await guard("owner"); if (g.error) return g.error;
  const { id } = await req.json().catch(() => ({}));
  const v = await adapter().getVersion(String(id ?? ""));
  if (!v) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  const site = { ...v.site, updatedAt: new Date().toISOString() };
  await adapter().saveSite("draft", site);
  return NextResponse.json({ ok: true, site });
}
