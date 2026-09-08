export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none text-gold/40 ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="18" stroke="currentColor" strokeWidth="0.6" />
      <path d="M60 8v16M60 96v16M8 60h16M96 60h16" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

export function CornerMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-3 text-gold/50 ${className}`} aria-hidden>
      <span className="absolute left-0 top-0 h-4 w-4 border-l border-t" />
      <span className="absolute right-0 top-0 h-4 w-4 border-r border-t" />
      <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l" />
      <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r" />
    </div>
  );
}
