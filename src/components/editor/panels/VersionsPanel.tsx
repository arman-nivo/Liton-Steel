"use client";
import { useEffect, useMemo, useState } from "react";
import { useEditor } from "@/lib/store/editor";
import type { Node, Site, SiteVersion } from "@/lib/schema/types";
import { Btn, C, Field, Input, Modal } from "../ui";
import { stripHtml } from "@/lib/utils";

type Row = Omit<SiteVersion, "site">;

/** Structural diff between the current draft and a version: added / removed / changed blocks. */
function diffSites(a: Site, b: Site) {
  const index = (s: Site) => { const m = new Map<string, Node>(); const w = (n: Node) => { m.set(n.id, n); n.children?.forEach(w); }; s.pages.forEach((p) => w(p as Node)); return m; };
  const ma = index(a), mb = index(b);
  const added: Node[] = [], removed: Node[] = [], changed: { node: Node; what: string }[] = [];
  for (const [id, n] of mb) if (!ma.has(id)) added.push(n);
  for (const [id, n] of ma) if (!mb.has(id)) removed.push(n);
  for (const [id, n] of ma) {
    const o = mb.get(id); if (!o) continue;
    const what: string[] = [];
    if (JSON.stringify(n.props) !== JSON.stringify(o.props)) what.push(n.props.text ? `text “${stripHtml(String(o.props.text?.en ?? "")).slice(0, 30)}…”` : "content");
    if (JSON.stringify(n.style) !== JSON.stringify(o.style)) what.push("style");
    if (JSON.stringify(n.animation) !== JSON.stringify(o.animation)) what.push("motion");
    if (what.length) changed.push({ node: n, what: what.join(", ") });
  }
  const theme = JSON.stringify(a.theme) !== JSON.stringify(b.theme);
  const projects = a.collections.projects.length !== b.collections.projects.length || JSON.stringify(a.collections.projects) !== JSON.stringify(b.collections.projects);
  return { added, removed, changed, theme, projects };
}

export function VersionsPanel({ onClose }: { onClose: () => void }) {
  const site = useEditor((s) => s.site)!;
  const role = useEditor((s) => s.role);
  const load = useEditor((s) => s.load);
  const showToast = useEditor((s) => s.showToast);
  const mutate = useEditor((s) => s.mutate);
  const [rows, setRows] = useState<Row[]>([]);
  const [cur, setCur] = useState<SiteVersion | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/versions").then((r) => r.json()).then(setRows).catch(() => setRows([])); }, []);
  const diff = useMemo(() => (cur ? diffSites(site, cur.site) : null), [cur, site]);
  const view = async (id: string) => {
    setBusy(true);
    const r = await fetch("/api/versions/view", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    setBusy(false);
    if (r.ok) setCur(await r.json());
  };
  const restore = async (id: string) => {
    if (!confirm("Restore this version into the draft? Your current draft is kept in history (undo).")) return;
    setBusy(true);
    const r = await fetch("/api/versions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    setBusy(false);
    if (!r.ok) { showToast("Restore failed"); return; }
    const { site: restored } = await r.json();
    load(restored, role);
    useEditor.setState({ dirty: true });
    showToast("Version restored into the draft. Publish to make it live.");
    onClose();
  };
  const sched = (site.settings as { scheduledPublishAt?: string }).scheduledPublishAt ?? "";
  return (
    <Modal title="Version history" onClose={onClose} width={860}>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <div>
          {rows.length ? rows.map((v) => (
            <div key={v.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}`, display: "grid", gap: 4 }}>
              <div style={{ fontSize: 13 }}>{v.label}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{new Date(v.createdAt).toLocaleString()}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="outline" disabled={busy} onClick={() => view(v.id)}>Compare</Btn>
                {role === "owner" ? <Btn small variant="gold" disabled={busy} onClick={() => restore(v.id)}>Restore</Btn> : null}
              </div>
            </div>
          )) : <p style={{ color: C.dim, fontSize: 12 }}>No versions yet. Every publish creates one.</p>}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
            <Field label="Scheduled publish (optional)" hint="Publishes automatically at this time when the cron endpoint is configured (see README).">
              <Input type="datetime-local" value={sched ? sched.slice(0, 16) : ""} onChange={(e) => mutate((d) => { (d.settings as { scheduledPublishAt?: string }).scheduledPublishAt = e.target.value ? new Date(e.target.value).toISOString() : undefined; })} />
            </Field>
          </div>
        </div>
        <div>
          {!cur ? <p style={{ color: C.dim, fontSize: 12 }}>Pick “Compare” to see what differs between the current draft and that version.</p> : diff ? (
            <div style={{ fontSize: 13 }}>
              <h4 style={{ margin: "0 0 8px" }}>Draft vs “{cur.label}”</h4>
              {diff.theme ? <p style={{ color: C.gold }}>Theme tokens differ.</p> : null}
              {diff.projects ? <p style={{ color: C.gold }}>Projects collection differs.</p> : null}
              <DiffList title={`Blocks only in the draft (${diff.removed.length})`} items={diff.removed.map((n) => n.name ?? n.type)} color={C.ok} />
              <DiffList title={`Blocks only in the version (${diff.added.length})`} items={diff.added.map((n) => n.name ?? n.type)} color={C.danger} />
              <DiffList title={`Changed blocks (${diff.changed.length})`} items={diff.changed.map((c) => `${c.node.name ?? c.node.type}: ${c.what}`)} color={C.gold} />
              {!diff.theme && !diff.projects && !diff.added.length && !diff.removed.length && !diff.changed.length ? <p style={{ color: C.ok }}>Identical.</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
function DiffList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return <div style={{ marginBottom: 10 }}><div style={{ color, fontSize: 12, marginBottom: 4 }}>{title}</div><ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#ccc" }}>{items.slice(0, 40).map((s, i) => <li key={i}>{s}</li>)}{items.length > 40 ? <li>…and {items.length - 40} more</li> : null}</ul></div>;
}
