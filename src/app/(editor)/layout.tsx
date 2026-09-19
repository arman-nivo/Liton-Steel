import type { Metadata } from "next";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = { title: "Liton Steel — Editor", robots: { index: false, follow: false } };

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="ls-editor-ui" style={{ background: "#0b0b0a", color: "#eee", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
