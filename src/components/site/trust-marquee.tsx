export function TrustMarquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="trust-marquee border-b border-ink/10 bg-[#fbfaf6]">
      <div className="trust-track">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-[#727a75]"
          >
            {item}
            <span className="ml-16 inline-block h-[3px] w-[3px] rounded-full bg-gold/70 align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}
