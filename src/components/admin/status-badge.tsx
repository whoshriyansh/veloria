import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  NEW: "bg-sky-500/15 text-sky-300 border-sky-500/25",
  CONTACTED: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  QUALIFIED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  CLOSED: "bg-white/10 text-white/70 border-white/15",
  LOST: "bg-red-500/15 text-red-300 border-red-500/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        statusStyles[status] ?? "bg-white/10 text-white/70 border-white/15",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function ReadinessBadge({ readiness }: { readiness: string }) {
  const styles: Record<string, string> = {
    "Investment Ready": "text-[#6ef0a4]",
    "Nearly Ready": "text-emerald-300",
    "Needs Work": "text-amber-300",
    "Critical Gaps": "text-red-300",
  };
  return (
    <span className={cn("text-sm font-medium", styles[readiness] ?? "text-white/70")}>
      {readiness}
    </span>
  );
}
