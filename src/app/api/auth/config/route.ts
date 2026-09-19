import { NextResponse } from "next/server";
import { totpEnabled } from "@/lib/auth";
export function GET() {
  return NextResponse.json({ totp: totpEnabled(), editor: !!process.env.EDITOR_PASSWORD, configured: !!process.env.ADMIN_PASSWORD });
}
