import Link from "next/link";
export default function NotFound() {
  return (
    <section className="ls-section" style={{ minHeight: "70svh", display: "grid", placeItems: "center", padding: "160px 24px 80px" }}>
      <div className="ls-shard" data-corner="tl" data-tone="paper" />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display)", color: "var(--gold)", lineHeight: 1 }}>404</div>
        <p style={{ opacity: 0.8 }}>Page not found · পৃষ্ঠা পাওয়া যায়নি</p>
        <Link className="ls-btn" data-variant="gold" href="/">Home</Link>
      </div>
    </section>
  );
}
