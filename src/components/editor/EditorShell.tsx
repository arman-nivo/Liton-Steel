"use client";
import { useEffect } from "react";
import type { Site } from "@/lib/schema/types";
import type { Role } from "@/lib/session";
import { useEditor } from "@/lib/store/editor";
import { useAutosave, useShortcuts } from "./hooks";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { LeftPanel } from "./panels/LeftPanel";
import { Inspector } from "./inspector/Inspector";
import { ThemePanel } from "./panels/ThemePanel";
import { OptimizationPanel } from "./panels/OptimizationPanel";
import { VersionsPanel } from "./panels/VersionsPanel";
import { Toast } from "./Toast";
import { C } from "./ui";

export function EditorShell({ initialSite, role, previewToken }: { initialSite: Site; role: Role; previewToken: string }) {
  const load = useEditor((s) => s.load);
  const loaded = useEditor((s) => !!s.site);
  const modal = useEditor((s) => s.modal);
  const setModal = useEditor((s) => s.setModal);
  useEffect(() => { load(initialSite, role); }, [initialSite, role, load]);
  // expose the store for QA automation / debugging (not in production builds)
  useEffect(() => { if (process.env.NODE_ENV !== "production") (window as unknown as { __editor?: typeof useEditor }).__editor = useEditor; }, []);
  useAutosave();
  useShortcuts();
  if (!loaded) return <div style={{ padding: 40, color: C.dim }}>Loading editor…</div>;
  return (
    <div style={{ height: "100vh", display: "grid", gridTemplateRows: "50px 1fr", background: C.bg, color: C.text, fontSize: 13 }}>
      <TopBar previewToken={previewToken} />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 330px", minHeight: 0 }}>
        <LeftPanel />
        <Canvas />
        <Inspector />
      </div>
      {modal === "theme" ? <ThemePanel onClose={() => setModal(null)} /> : null}
      {modal === "optimize" ? <OptimizationPanel onClose={() => setModal(null)} /> : null}
      {modal === "versions" ? <VersionsPanel onClose={() => setModal(null)} /> : null}
      <Toast />
    </div>
  );
}
