/**
 * Liton Steel site schema — "everything is a block".
 * Site → Page → Section → Container/Grid/Stack → Element.
 */
export type Locale = "en" | "bn";
export const LOCALES: Locale[] = ["en", "bn"];
export type L10n = { en: string; bn?: string };

export type Breakpoint = "base" | "tablet" | "mobile";
export const BREAKPOINTS: Breakpoint[] = ["base", "tablet", "mobile"];
export type Device = "desktop" | "tablet" | "mobile";

export type ShapePreset =
  | "none" | "rounded" | "arch" | "pill" | "circle"
  | "shard-tl" | "shard-tr" | "shard-bl" | "shard-br";

export type Box = number | string | [number | string, number | string, number | string, number | string];

/** Style values may reference tokens: "token:gold", "token:display", "token:xl", "token:md" (radius). */
export interface StyleProps {
  // typography
  font?: string;
  size?: string;
  weight?: number | string;
  letterSpacing?: string;
  lineHeight?: string | number;
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  align?: "left" | "center" | "right" | "justify";
  italic?: boolean;
  maxLines?: number;
  // colour
  color?: string;
  opacity?: number;
  // background
  bg?: string;
  bgMedia?: string;
  bgOverlay?: string;
  bgPosition?: string;
  bgSize?: string;
  // border / radius / shadow / shape / filter
  radius?: string;
  border?: string;
  shadow?: string;
  shape?: ShapePreset;
  filter?: "none" | "bw" | "duotone";
  // layout
  display?: "block" | "flex" | "grid" | "inline-flex" | "none";
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: boolean;
  columns?: number;
  gap?: number | string;
  rowGap?: number | string;
  padding?: Box;
  margin?: Box;
  alignItems?: string;
  justifyContent?: string;
  alignSelf?: string;
  justifySelf?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  minWidth?: string;
  maxWidth?: string;
  position?: "static" | "relative" | "absolute" | "sticky" | "fixed";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  overflow?: "visible" | "hidden" | "auto";
  order?: number;
  flex?: string;
  gridColumn?: string;
  gridRow?: string;
  rotate?: string;
  translate?: string;
  /** raw CSS appended verbatim (Advanced tab) */
  css?: string;
}

export type MotionPreset =
  | "none" | "fade-rise" | "mask-reveal-text" | "split-chars" | "shard-slide" | "tab-drop"
  | "image-clip-expand" | "parallax-depth" | "pin-and-scrub" | "scale-hero" | "count-up"
  | "horizontal-gallery" | "magnetic-hover";

export const MOTION_PRESETS: MotionPreset[] = [
  "none", "fade-rise", "mask-reveal-text", "split-chars", "shard-slide", "tab-drop", "image-clip-expand",
  "parallax-depth", "pin-and-scrub", "scale-hero", "count-up", "horizontal-gallery", "magnetic-hover",
];

export interface Animation {
  preset: MotionPreset;
  trigger?: "load" | "enter" | "scrub" | "hover";
  delay?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  intensity?: number;
}

export interface Visibility { desktop: boolean; tablet: boolean; mobile: boolean }

export type NodeType =
  | "Page" | "Section" | "Container" | "Grid" | "Stack"
  | "Heading" | "Text" | "RichText" | "Image" | "ImageCollage" | "Gallery" | "Button" | "Icon" | "Logo"
  | "Capsule" | "Label" | "NumberList" | "ProcessSteps" | "PersonCard" | "TeamList" | "ClientList"
  | "ProjectGallery" | "Quote" | "Divider" | "DecorShard" | "BookmarkTab" | "BrandStamp" | "StripedCircle"
  | "Map" | "ContactForm" | "ContactDetails" | "Video" | "Spacer" | "Embed" | "Stat";

export const CONTAINER_TYPES: NodeType[] = ["Page", "Section", "Container", "Grid", "Stack"];

export interface NodeStyle { base: StyleProps; tablet?: StyleProps; mobile?: StyleProps }

export interface BaseNode {
  id: string;
  type: NodeType;
  name?: string;
  props: Record<string, any>;
  style: NodeStyle;
  /** engine-computed style: only set for keys whose explicit value is a token or unset, so it wins the cascade */
  auto?: StyleProps;
  /** engine-computed non-CSS outputs (collage layout, image sizes, motion downgrade, seo) */
  computed?: Record<string, any>;
  animation?: Animation;
  visibility?: Visibility;
  locked?: boolean;
  anchor?: string;
  className?: string;
  ariaLabel?: string;
  children?: Node[];
}
export type Node = BaseNode;

// ---- element prop shapes (props are stored loosely; these document/type them for components) ----
export interface HeadingProps { text: L10n; level: 1 | 2 | 3 | 4 | 5 | 6 }
export interface TextProps { text: L10n; justify?: boolean }
export interface ImageProps { media?: string; src?: string; alt?: L10n; caption?: L10n; priority?: boolean; focal?: [number, number] }
export interface CollageItem { id: string; media: string; alt?: L10n }
export interface ImageCollageProps { items: CollageItem[]; layout?: "auto" | "hero" | "pair" | "trio" | "quad" | "masonry" | "row"; lightbox?: boolean }
export interface ButtonProps { label: L10n; href: string; variant: "gold" | "outline" | "paper" | "ghost"; icon?: string; newTab?: boolean; download?: boolean }
export interface CapsuleProps { text: L10n; vertical?: boolean }
export interface LabelProps { text: L10n }
export interface NumberListItem { id: string; label: L10n; href: string }
export interface NumberListProps { items: NumberListItem[]; startAt?: number }
export interface ProcessStep { id: string; title: L10n; text?: L10n }
export interface ProcessStepsProps { items: ProcessStep[]; media: string[] }
export interface PersonCardProps { name: L10n; role: L10n; media?: string; bio?: L10n; labelStyle?: "overlap" | "below" }
export interface TeamMember { id: string; name: L10n }
export interface TeamGroup { id: string; role: L10n; members: TeamMember[] }
export interface TeamListProps { groups: TeamGroup[]; accordionOnMobile?: boolean }
export interface ClientItem { id: string; name: L10n }
export interface ClientListProps { title?: L10n; items: ClientItem[] }
export interface ProjectGalleryProps { layout: "horizontal" | "grid"; limit?: number; category?: ProjectCategory | "all"; showFilters?: boolean; moreLabel?: L10n }
export interface QuoteProps { text: L10n; cite?: L10n }
export interface DecorShardProps { corner: "tl" | "tr" | "bl" | "br"; tone: "paper" | "gold" | "ink" }
export interface BookmarkTabProps { variant: "logo" | "stub" }
export interface BrandStampProps { text: L10n; position: "tr" | "bl" | "inline"; dots?: boolean }
export interface StripedCircleProps { size?: number }
export interface MapProps { embed?: string; query?: string }
export interface ContactFormProps { title?: L10n; successText?: L10n; buttonLabel?: L10n }
export interface ContactDetailItem { id: string; icon: "phone" | "mail" | "pin" | "whatsapp" | "clock"; text: L10n; href?: string }
export interface ContactDetailsProps { items: ContactDetailItem[] }
export interface VideoProps { src: string; poster?: string; autoplay?: boolean; loop?: boolean }
export interface SpacerProps { size: number }
export interface EmbedProps { html: string }
export interface StatProps { value: number; prefix?: string; suffix?: string; label: L10n }
export interface SectionProps { preset?: string; fullHeight?: boolean; tone: "ink" | "paper" | "gold" | "black"; bgMedia?: string; bgFilter?: "bw" | "none"; bgOverlay?: number }
export interface ContainerProps { width: "default" | "narrow" | "wide" | "full" }
export interface PageProps { slug: string; title: L10n; description?: L10n; ogImage?: string; noindex?: boolean; inNav?: boolean }

export interface Page extends BaseNode { type: "Page"; props: PageProps; children: Node[] }

// ---- site-level ----
export type FontKey = "archivo" | "league" | "jost" | "glacial" | "montserrat" | "dm" | "michroma" | "hind" | "noto" | "system";

export interface Theme {
  colors: { ink: string; black: string; gold: string; goldSoft: string; paper: string; mute: string };
  fonts: { display: FontKey; display2: FontKey; body: FontKey; label: FontKey; digit: FontKey; bangla: FontKey };
  type: { base: number; ratio: number };
  space: number;
  radius: { sm: number; md: number; lg: number; xl: number };
  shardAngle: number;
  motion: "off" | "subtle" | "cinematic";
  container: number;
}

export type ProjectCategory = "industrial-shed" | "warehouse" | "factory" | "resort-leisure" | "civil-foundation";
export const PROJECT_CATEGORIES: { id: ProjectCategory; label: L10n }[] = [
  { id: "industrial-shed", label: { en: "Industrial Shed", bn: "ইন্ডাস্ট্রিয়াল শেড" } },
  { id: "warehouse", label: { en: "Warehouse", bn: "ওয়্যারহাউস" } },
  { id: "factory", label: { en: "Factory", bn: "কারখানা" } },
  { id: "resort-leisure", label: { en: "Resort / Leisure", bn: "রিসোর্ট / অবসর" } },
  { id: "civil-foundation", label: { en: "Civil / Foundation", bn: "সিভিল / ফাউন্ডেশন" } },
];

export interface Project {
  id: string;
  slug: string;
  title: L10n;
  caption: L10n;
  category: ProjectCategory;
  images: string[];
  location?: L10n;
  year?: string;
  client?: L10n;
  featured?: boolean;
}

export interface MediaItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blur?: string;
  brightness?: number;
  bytes?: number;
  focal?: [number, number];
  folder?: string;
  tags?: string[];
  createdAt?: string;
  lowRes?: boolean;
}

export interface NavItem { id: string; label: L10n; href: string }

export interface Company {
  name: L10n;
  shortName: L10n;
  tagline: L10n;
  phone: string;
  whatsapp: string;
  email: string;
  address: L10n;
  mapQuery: string;
  founded: number;
  social: { label: string; href: string }[];
}

export interface Site {
  id: "site";
  version: number;
  updatedAt: string;
  theme: Theme;
  company: Company;
  nav: NavItem[];
  footer: { about: L10n; columns: { id: string; title: L10n; links: NavItem[] }[]; note: L10n };
  seo: { titleTemplate: string; defaultDescription: L10n; keywords: string[] };
  settings: { pdfUrl: string; showWhatsApp: boolean; cookieNotice: boolean };
  pages: Page[];
  collections: { projects: Project[] };
  media: MediaItem[];
}

export interface SiteVersion { id: string; label: string; createdAt: string; site: Site }

export interface Warning {
  id: string;
  level: "info" | "warn" | "error";
  rule: string;
  nodeId?: string;
  message: string;
  fix?: { label: string; patch?: Partial<StyleProps>; action?: string };
}
export interface Adjustment { rule: string; nodeId?: string; message: string }
