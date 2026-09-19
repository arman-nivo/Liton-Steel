import "server-only";
import { createHash } from "crypto";
/** Shareable preview token derived from AUTH_SECRET (no DB needed). */
export function previewToken() {
  return createHash("sha256").update(`${process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me"}::preview`).digest("hex").slice(0, 20);
}
