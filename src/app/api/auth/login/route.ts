import { NextResponse } from "next/server";
import { roleForPassword, totpEnabled, verifyTotp } from "@/lib/auth";
import { SESSION_COOKIE, signSession } from "@/lib/session";

const attempts = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const a = attempts.get(ip) ?? { n: 0, t: Date.now() };
  if (Date.now() - a.t > 15 * 60_000) { a.n = 0; a.t = Date.now(); }
  if (a.n >= 10) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const role = roleForPassword(String(body.password ?? ""));
  if (!role) { a.n++; attempts.set(ip, a); return NextResponse.json({ error: "Wrong password" }, { status: 401 }); }
  if (role === "owner" && totpEnabled() && !verifyTotp(String(body.code ?? ""))) { a.n++; attempts.set(ip, a); return NextResponse.json({ error: "Wrong 2FA code" }, { status: 401 }); }
  attempts.delete(ip);
  const token = await signSession({ role, sub: role });
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 24 * 3600 });
  return res;
}
