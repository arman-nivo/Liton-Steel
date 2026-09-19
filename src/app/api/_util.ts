import { NextResponse } from "next/server";
import { AuthError, requireSession } from "@/lib/auth";
import type { Role } from "@/lib/session";

export async function guard(min: Role = "editor") {
  try { return { session: await requireSession(min), error: null }; }
  catch (e) { const err = e as AuthError; return { session: null, error: NextResponse.json({ error: err.message }, { status: err.status ?? 401 }) }; }
}
