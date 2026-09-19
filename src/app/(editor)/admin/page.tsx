import { LoginForm } from "@/components/editor/LoginForm";
import { totpEnabled } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const s = await getSession();
  const { next } = await searchParams;
  if (s) redirect(next && next.startsWith("/") ? next : "/edit");
  return <LoginForm totp={totpEnabled()} next={next && next.startsWith("/") ? next : "/edit"} editorEnabled={!!process.env.EDITOR_PASSWORD} configured={!!process.env.ADMIN_PASSWORD} />;
}
