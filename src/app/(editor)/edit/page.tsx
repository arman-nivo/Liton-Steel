import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDraft } from "@/lib/data";
import { EditorShell } from "@/components/editor/EditorShell";
import { previewToken } from "@/lib/preview";

export const dynamic = "force-dynamic";

export default async function EditPage() {
  const s = await getSession();
  if (!s) redirect("/admin?next=/edit");
  const site = await getDraft();
  return <EditorShell initialSite={site} role={s.role} previewToken={previewToken()} />;
}
