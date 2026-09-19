import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { adapter } from "@/lib/data";
import { uid } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
  company: z.string().optional(),        // honeypot
  token: z.string().optional(),          // turnstile
  locale: z.string().optional(),
});

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}

async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret, response: token }) });
  const j = await r.json().catch(() => ({ success: false }));
  return !!j.success;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages, please wait a minute." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // honeypot filled → pretend success
  if (!(await verifyTurnstile(d.token))) return NextResponse.json({ error: "Spam check failed" }, { status: 400 });

  const msg = { id: uid(), name: d.name, email: d.email, phone: d.phone || undefined, message: d.message, locale: d.locale, createdAt: new Date().toISOString() };
  await adapter().saveMessage(msg);

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const tr = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await tr.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL || "liton.steel.kst@gmail.com",
        replyTo: d.email,
        subject: `Website enquiry from ${d.name}`,
        text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "-"}\nLanguage: ${d.locale || "en"}\n\n${d.message}`,
      });
    } catch (e) { console.error("contact mail failed", e); }
  }
  return NextResponse.json({ ok: true });
}
