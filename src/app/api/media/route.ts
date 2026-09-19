import { NextResponse } from "next/server";
import { adapter } from "@/lib/data";
import { processUpload } from "@/lib/media-pipeline";
import { guard } from "../_util";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const g = await guard(); if (g.error) return g.error;
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });
  const out = [];
  for (const f of files.slice(0, 20)) {
    if (!/^image\//.test(f.type)) continue;
    if (f.size > 25 * 1024 * 1024) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const p = await processUpload(buf, f.name);
    p.item.src = await adapter().uploadFile(p.name, p.buffer, p.contentType);
    p.item.alt = f.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
    out.push(p.item);
  }
  return NextResponse.json({ items: out });
}

export async function DELETE(req: Request) {
  const g = await guard(); if (g.error) return g.error;
  const { src } = await req.json().catch(() => ({}));
  if (typeof src === "string" && (src.startsWith("/uploads/") || src.includes("/object/public/"))) await adapter().deleteFile(src);
  return NextResponse.json({ ok: true });
}
