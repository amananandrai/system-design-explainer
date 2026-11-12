/** A small "disconnected nodes" drawing for empty states and the 404 page. */
export default function EmptyIllustration({ className = "h-24 w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 96" className={className} aria-hidden>
      <path d="M44 48 H70" stroke="var(--line-strong)" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 48 H116" stroke="var(--line-strong)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      <rect x="8" y="30" width="36" height="36" rx="10" fill="var(--primary)" stroke="var(--edge)" strokeWidth="3" />
      <rect x="116" y="30" width="36" height="36" rx="10" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="3" />
      <circle cx="80" cy="48" r="10" fill="var(--surface)" stroke="var(--edge)" strokeWidth="3" />
      <path d="M76 44 L84 52 M84 44 L76 52" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
