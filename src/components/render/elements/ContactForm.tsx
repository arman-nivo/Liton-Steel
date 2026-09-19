"use client";
import { useEffect, useRef, useState } from "react";
import type { Node } from "@/lib/schema/types";
import { t } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import { attrs, type RenderCtx } from "../context";

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void } } }

export function ContactForm({ node, ctx }: { node: Node; ctx: RenderCtx }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [token, setToken] = useState("");
  const tsRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || ctx.editable) return;
    const render = () => { if (tsRef.current && window.turnstile && !tsRef.current.hasChildNodes()) window.turnstile.render(tsRef.current, { sitekey: siteKey, theme: "dark", callback: (tk: string) => setToken(tk) }); };
    if (window.turnstile) render();
    else { const s = document.createElement("script"); s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; s.async = true; s.onload = render; document.head.appendChild(s); }
  }, [siteKey, ctx.editable]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ctx.editable) return;
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, token, locale: ctx.locale }) });
      if (!res.ok) throw new Error(await res.text());
      setStatus("sent");
      e.currentTarget.reset();
    } catch { setStatus("error"); }
  };

  const a = attrs(node, "ls-form", ctx);
  const title = t(node.props.title, ctx.locale);
  return (
    <form {...a} onSubmit={onSubmit} noValidate={ctx.editable}>
      {title ? <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-display2)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--gold)" }}>{title}</h3> : null}
      <div className="row">
        <label>{ui("name", ctx.locale)}<input name="name" required autoComplete="name" /></label>
        <label>{ui("email", ctx.locale)}<input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <label>{ui("phone", ctx.locale)}<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>{ui("message", ctx.locale)}<textarea name="message" rows={5} required /></label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />
      {siteKey ? <div ref={tsRef} /> : null}
      <button className="ls-btn" data-variant="gold" type="submit" disabled={status === "sending"} style={{ border: 0, cursor: "pointer", justifySelf: "start" }}>
        {status === "sending" ? ui("sending", ctx.locale) : t(node.props.buttonLabel, ctx.locale) || ui("send", ctx.locale)}
      </button>
      {status === "sent" ? <p className="status" role="status">{t(node.props.successText, ctx.locale) || ui("sent", ctx.locale)}</p> : null}
      {status === "error" ? <p className="status" role="alert">{ui("failed", ctx.locale)}</p> : null}
    </form>
  );
}
