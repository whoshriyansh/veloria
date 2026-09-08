import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function IconCard({
  icon: Icon,
  title,
  body,
  index,
  variant = "feature",
  dark = false,
  href,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index?: string;
  variant?: "service" | "feature" | "step" | "row";
  dark?: boolean;
  href?: string;
}) {
  const className = [
    "icon-card",
    `icon-card-${variant}`,
    dark ? "icon-card-dark" : "",
    "group",
    href ? "block" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {index ? <span className="icon-card-index">{index}</span> : null}
      <Icon className="icon-glyph" strokeWidth={1.2} aria-hidden />
      <h3>{title}</h3>
      <p>{body}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} data-cursor className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <article data-cursor className={className}>
      {inner}
    </article>
  );
}
