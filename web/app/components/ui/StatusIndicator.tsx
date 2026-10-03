type Tone = "ready" | "busy" | "idle" | "error";

const DOT: Record<Tone, string> = {
  ready: "bg-[#10B981]",
  busy: "cm-node bg-[#2563EB]",
  idle: "bg-black/25",
  error: "bg-red-500",
};

const TEXT: Record<Tone, string> = {
  ready: "text-[#047857]",
  busy: "text-[#2563EB]",
  idle: "text-[#6B716D]",
  error: "text-red-700",
};

export function StatusIndicator({
  tone,
  label,
  className = "",
}: {
  tone: Tone;
  label: string;
  className?: string;
}) {
  return (
    <span
      role={tone === "busy" ? "status" : undefined}
      className={`inline-flex items-center gap-2 text-xs font-medium ${TEXT[tone]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[tone]}`}
      />
      {label}
    </span>
  );
}
