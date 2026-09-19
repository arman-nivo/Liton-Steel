import { NextResponse } from "next/server";
import { adapter } from "@/lib/data";
import { guard } from "../../_util";
export async function POST(req: Request) {
  const g = await guard(); if (g.error) return g.error;
  const { id } = await req.json().catch(() => ({}));
  const v = await adapter().getVersion(String(id ?? ""));
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(v);
}
