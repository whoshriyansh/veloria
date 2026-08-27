import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.14em] text-white/45",
        props.className,
      )}
    />
  );
}

const controlClass =
  "w-full rounded-lg border border-white/10 bg-[#0f1412] px-3 py-2 text-sm text-[#e8ebe9] outline-none transition placeholder:text-white/30 focus:border-[#6ef0a4]/40 focus:ring-1 focus:ring-[#6ef0a4]/25";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(controlClass, "min-h-[100px] resize-y", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, props.className)} />;
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-white/80">
      <input
        type="checkbox"
        {...props}
        className={cn(
          "size-4 rounded border-white/20 bg-[#0f1412] text-[#2bb673] focus:ring-[#6ef0a4]/30",
          props.className,
        )}
      />
      {label}
    </label>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2bb673] text-[#061410] hover:bg-[#6ef0a4] disabled:opacity-50",
  secondary:
    "border border-white/12 bg-white/5 text-[#e8ebe9] hover:bg-white/10 disabled:opacity-50",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-50",
  ghost: "text-white/60 hover:bg-white/5 hover:text-white disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed",
        buttonVariants[variant],
        className,
      )}
    />
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? (
          <div className="mt-1 text-sm text-white/50">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("admin-card p-5", className)}>{children}</div>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-white/8 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-white/[0.04] px-3 py-3 align-middle text-white/85", className)}>
      {children}
    </td>
  );
}

export function Flash({
  tone = "success",
  children,
}: {
  tone?: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        tone === "success"
          ? "border-[#6ef0a4]/25 bg-[#6ef0a4]/10 text-[#6ef0a4]"
          : "border-red-500/30 bg-red-500/10 text-red-300",
      )}
    >
      {children}
    </div>
  );
}
