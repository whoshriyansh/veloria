import type { CSSProperties } from "react";

export function Photo({
  src,
  alt = "",
  className,
  priority = false,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      draggable={false}
    />
  );
}
