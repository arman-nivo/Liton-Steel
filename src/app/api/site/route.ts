import { NextResponse } from "next/server";
import { adapter, getDraft } from "@/lib/data";
import { guard } from "../_util";
import type { Site } from "@/lib/schema/types";

export async function GET() {
  const g = await guard(); if (g.error) return g.error;
  return NextResponse.json(await getDraft());
}

export async function PUT(req: Request) {
  const g = await guard(); if (g.error) return g.error;
  const site = (await req.json()) as Site;
  if (!site || site.id !== "site" || !Array.isArray(site.pages) || !site.theme || !site.media) return NextResponse.json({ error: "Invalid site document" }, { status: 400 });
  site.updatedAt = new Date().toISOString();
  site.version = (site.version ?? 0) + 1;
  await adapter().saveSite("draft", site);
  return NextResponse.json({ ok: true, version: site.version, updatedAt: site.updatedAt });
}
