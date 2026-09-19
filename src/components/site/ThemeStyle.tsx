import type { Theme } from "@/lib/schema/types";
import { themeToCss } from "@/lib/schema/tokens";
export function ThemeStyle({ theme }: { theme: Theme }) {
  return <style id="ls-theme" dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />;
}
