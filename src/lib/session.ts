/** Edge-safe session helpers (used by middleware and route handlers). */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ls_session";
export type Role = "owner" | "editor";
export interface Session { role: Role; sub: string; exp?: number }

function secret() {
  const s = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me";
  return new TextEncoder().encode(s);
}

export async function signSession(s: Omit<Session, "exp">, days = 7) {
  return new SignJWT({ role: s.role }).setProtectedHeader({ alg: "HS256" }).setSubject(s.sub).setIssuedAt().setExpirationTime(`${days}d`).sign(secret());
}

export async function verifySessionToken(token?: string | null): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = payload.role === "owner" ? "owner" : payload.role === "editor" ? "editor" : null;
    if (!role) return null;
    return { role, sub: String(payload.sub ?? ""), exp: payload.exp };
  } catch { return null; }
}
