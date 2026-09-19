import { Phone, Mail, MapPin, MessageCircle, Clock, Download, ArrowRight, ArrowLeft, Star, ChevronLeft, ChevronRight, X, Menu, ExternalLink, Building2, Hammer, Ruler, ShieldCheck, Sparkles, Check, Plus, Globe, type LucideProps } from "lucide-react";

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  phone: Phone, mail: Mail, pin: MapPin, whatsapp: MessageCircle, clock: Clock, download: Download, "arrow-right": ArrowRight, "arrow-left": ArrowLeft,
  star: Star, "chevron-left": ChevronLeft, "chevron-right": ChevronRight, x: X, menu: Menu, external: ExternalLink, building: Building2, hammer: Hammer,
  ruler: Ruler, shield: ShieldCheck, sparkles: Sparkles, check: Check, plus: Plus, globe: Globe,
};
export const ICON_NAMES = Object.keys(MAP);

export function Icon({ name, size = 20, ...rest }: { name?: string } & LucideProps) {
  const C = MAP[name ?? ""] ?? Star;
  return <C size={size} strokeWidth={2} aria-hidden="true" {...rest} />;
}
