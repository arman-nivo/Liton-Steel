"use client";
import { useEffect, useCallback } from "react";
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
  if (!it) return null;
  return (
    <div className="ls-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose}>
      <img src={it.src} alt={it.alt ?? ""} onClick={(e) => e.stopPropagation()} />
      <button className="close" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
      {items.length > 1 ? <>
        <button className="prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev(); }}><Icon name="chevron-left" /></button>
        <button className="next" aria-label="Next" onClick={(e) => { e.stopPropagation(); next(); }}><Icon name="chevron-right" /></button>
      </> : null}
    </div>
  );
}
