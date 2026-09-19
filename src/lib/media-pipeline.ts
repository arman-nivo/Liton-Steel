import "server-only";
import sharp from "sharp";
import type { MediaItem } from "./schema/types";
import { slugify, uid } from "./utils";

export interface Processed { item: MediaItem; buffer: Buffer; name: string; contentType: string }

/** Upload pipeline: auto-orient, strip EXIF, resize ≤2400px, WebP, blur placeholder, brightness, focal point, low-res flag. */
export async function processUpload(input: Buffer, originalName: string): Promise<Processed> {
  const base = sharp(input, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  const isVector = meta.format === "svg";
  const id = `${slugify(originalName.replace(/\.[a-z0-9]+$/i, "")).slice(0, 40) || "image"}-${uid().slice(0, 5)}`;

  if (isVector) {
    return { item: { id, src: "", width: meta.width ?? 512, height: meta.height ?? 512, alt: "", folder: "uploads", createdAt: new Date().toISOString() }, buffer: input, name: `${id}.svg`, contentType: "image/svg+xml" };
  }

  const out = await sharp(input, { failOn: "none" }).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer({ resolveWithObject: true });
  const tiny = await sharp(out.data).resize(24, 24, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  const stats = await sharp(out.data).stats();
  const brightness = stats.channels.slice(0, 3).reduce((s, c) => s + c.mean, 0) / 3 / 255;

  let focal: [number, number] = [0.5, 0.5];
  try {
    const att = await sharp(out.data).resize(200, 200, { fit: "cover", position: sharp.strategy.attention }).toBuffer({ resolveWithObject: true });
    const info = att.info as typeof att.info & { attentionX?: number; attentionY?: number };
    if (typeof info.attentionX === "number" && typeof info.attentionY === "number") {
      focal = [Math.min(1, Math.max(0, info.attentionX / out.info.width)), Math.min(1, Math.max(0, info.attentionY / out.info.height))];
    }
  } catch { /* attention strategy unavailable */ }

  const item: MediaItem = {
    id, src: "", width: out.info.width, height: out.info.height, alt: "",
    blur: `data:image/jpeg;base64,${tiny.toString("base64")}`,
    brightness: Math.round(brightness * 1000) / 1000, bytes: out.data.length, focal,
    folder: "uploads", tags: ["upload"], createdAt: new Date().toISOString(), lowRes: out.info.width < 1000,
  };
  return { item, buffer: out.data, name: `${id}.webp`, contentType: "image/webp" };
}
