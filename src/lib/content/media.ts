import manifest from "@/content/media.json";
import type { MediaItem, Site } from "../schema/types";

export const SEED_MEDIA: MediaItem[] = (manifest as any[]).map((m) => ({
  id: m.id, src: m.src, width: m.width, height: m.height, alt: m.alt, blur: m.blur,
  brightness: m.brightness, bytes: m.bytes, folder: m.folder, tags: m.tags,
}));

export function mediaMap(site: Pick<Site, "media">): Map<string, MediaItem> {
  return new Map(site.media.map((m) => [m.id, m]));
}
