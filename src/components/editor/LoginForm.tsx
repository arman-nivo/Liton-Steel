"use client";
import { useState } from "react";
import { LogoMark } from "../render/elements/media";
import { Btn, C, Input } from "./ui";

export function LoginForm({ totp, next, editorEnabled, configured }: { totp: boolean; next: string; editorEnabled: boolean; configured: boolean }) {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password, code }) });
    setBusy(false);
    if (!r.ok) { setErr((await r.json().catch(() => ({}))).error ?? "Login failed"); return; }
    window.location.href = next;
  };
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--ink)" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 28, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--gold)" }}>
          <span style={{ width: 48, height: 48, borderRadius: 24, background: "var(--gold)", color: "var(--ink)", display: "grid", placeItems: "center" }}><LogoMark style={{ width: "68%" }} /></span>
          <div><div style={{ fontWeight: 800, letterSpacing: ".04em" }}>LITON STEEL</div><div style={{ fontSize: 12, color: C.dim }}>Site editor</div></div>
        </div>
        {!configured ? <p style={{ fontSize: 13, color: C.danger, margin: 0 }}>ADMIN_PASSWORD is not set. Add it to <code>.env.local</code> and restart the server.</p> : null}
        <label style={{ fontSize: 12, color: C.dim, display: "grid", gap: 6 }}>Password<Input type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {totp ? <label style={{ fontSize: 12, color: C.dim, display: "grid", gap: 6 }}>2FA code (owner)<Input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" /></label> : null}
        {err ? <p role="alert" style={{ color: C.danger, fontSize: 13, margin: 0 }}>{err}</p> : null}
        <Btn type="submit" variant="gold" disabled={busy || !configured} style={{ justifyContent: "center" }}>{busy ? "Signing in…" : "Sign in"}</Btn>
        <p style={{ fontSize: 11, color: C.dim, margin: 0 }}>{editorEnabled ? "Owner and Editor passwords are accepted. Editors can change content but not publish." : "Roles: Owner (ADMIN_PASSWORD). Set EDITOR_PASSWORD to add a content-only editor."}</p>
      </form>
    </main>
  );
}
