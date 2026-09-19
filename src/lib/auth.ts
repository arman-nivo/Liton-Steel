import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { SESSION_COOKIE, verifySessionToken, type Role, type Session } from "./session";

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession(min: Role = "editor"): Promise<Session> {
  const s = await getSession();
  if (!s) throw new AuthError(401, "Not signed in");
  if (min === "owner" && s.role !== "owner") throw new AuthError(403, "Owner role required");
  return s;
}
export class AuthError extends Error { constructor(public status: number, msg: string) { super(msg); } }

function safeEq(a: string, b: string) {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Returns the role for a password, or null. */
export function roleForPassword(pw: string): Role | null {
  const admin = process.env.ADMIN_PASSWORD;
  const editor = process.env.EDITOR_PASSWORD;
  if (admin && safeEq(pw, admin)) return "owner";
  if (editor && safeEq(pw, editor)) return "editor";
  return null;
}

export function totpEnabled() { return Boolean(process.env.ADMIN_TOTP_SECRET); }

function base32Decode(s: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = s.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of clean) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

/** RFC 6238 TOTP (SHA-1, 30s, 6 digits), ±1 window. */
export function verifyTotp(code: string, secretB32 = process.env.ADMIN_TOTP_SECRET ?? ""): boolean {
  if (!secretB32) return true;
  const key = base32Decode(secretB32);
  const now = Math.floor(Date.now() / 1000 / 30);
  for (const step of [now - 1, now, now + 1]) {
    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(Math.floor(step / 0x100000000), 0);
    buf.writeUInt32BE(step >>> 0, 4);
    const h = createHmac("sha1", key).update(buf).digest();
    const off = h[h.length - 1] & 0xf;
    const v = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
    const otp = String(v % 1_000_000).padStart(6, "0");
    if (safeEq(otp, code.replace(/\s/g, ""))) return true;
  }
  return false;
}
