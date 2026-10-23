"use client";
import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "../render/elements/icons";

export interface LightboxItem { src: string; alt?: string; width?: number; height?: number }

export function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prevOverflow; };
  }, [onClose, prev, next]);
  const it = items[index];
  if (!it?.src) return null;
  // Portalled to <body>: inside the page, the section's isolation and the page's container query box would trap
  // this fixed overlay under the header (and size it to the page instead of the screen). Only mounted after a click.
  return createPortal(
    <div className="ls-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      {/* optimized and sized to the screen (a phone gets ~1 MP instead of the original upload); eager because
          the visitor just asked for it, and a lazy image sized `auto` is a 0×0 box the browser never fetches */}
      <Image key={it.src} src={it.src} alt={it.alt ?? ""} width={it.width ?? 1600} height={it.height ?? 1200} sizes="(max-width: 1520px) 92vw, 1400px" loading="eager" unoptimized={it.src.startsWith("data:") || it.src.startsWith("blob:")} onClick={(e) => e.stopPropagation()} />
      <button className="close" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
      {items.length > 1 ? <>
        <button className="prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev(); }}><Icon name="chevron-left" /></button>
        <button className="next" aria-label="Next" onClick={(e) => { e.stopPropagation(); next(); }}><Icon name="chevron-right" /></button>
      </> : null}
    </div>,
    document.body,
  );
}
