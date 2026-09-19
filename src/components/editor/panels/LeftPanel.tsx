"use client";
import { useEditor } from "@/lib/store/editor";
import { C, IconBtn } from "../ui";
import { Layers, FileText, LayoutTemplate, Images } from "lucide-react";
import { LayersPanel } from "./LayersPanel";
import { PagesPanel } from "./PagesPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { MediaPanel } from "./MediaPanel";

export function LeftPanel() {
  const panel = useEditor((s) => s.panel);
  const setPanel = useEditor((s) => s.setPanel);
  return (
    <aside style={{ display: "grid", gridTemplateColumns: "44px 1fr", borderRight: `1px solid ${C.line}`, background: C.panel, minHeight: 0 }}>
      <div style={{ display: "grid", alignContent: "start", gap: 4, padding: 6, borderRight: `1px solid ${C.line}` }}>
        <IconBtn title="Layers" active={panel === "layers"} onClick={() => setPanel("layers")}><Layers size={17} /></IconBtn>
        <IconBtn title="Pages" active={panel === "pages"} onClick={() => setPanel("pages")}><FileText size={17} /></IconBtn>
        <IconBtn title="Section templates" active={panel === "templates"} onClick={() => setPanel("templates")}><LayoutTemplate size={17} /></IconBtn>
        <IconBtn title="Media library" active={panel === "media"} onClick={() => setPanel("media")}><Images size={17} /></IconBtn>
      </div>
      <div style={{ overflow: "auto", minHeight: 0 }}>
        {panel === "layers" ? <LayersPanel /> : panel === "pages" ? <PagesPanel /> : panel === "templates" ? <TemplatesPanel /> : <MediaPanel />}
      </div>
    </aside>
  );
}
