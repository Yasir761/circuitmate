function NodeTrace() {
  return (
    <span aria-hidden="true" className="inline-flex items-center">
      {[0, 1, 2].map((index) => (
        <span key={index} className="inline-flex items-center">
          <span
            className="cm-node h-1.5 w-1.5 rounded-full bg-[#2563EB]"
            style={{ animationDelay: `${index * 180}ms` }}
          />
          {index < 2 && <span className="h-px w-2.5 bg-[#2563EB]/30" />}
        </span>
      ))}
    </span>
  );
}

export function LoadingState({
  label,
  hint,
  variant = "inline",
  className = "",
}: {
  label: string;
  hint?: string;
  variant?: "inline" | "block";
  className?: string;
}) {
  if (variant === "block") {
    return (
      <div
        role="status"
        className={`flex min-h-[280px] flex-col items-center justify-center gap-4 text-center ${className}`}
      >
        <NodeTrace />
        <div>
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="mt-1 text-sm text-[#6B716D]">{hint}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={`flex items-center gap-3 text-sm text-[#6B716D] ${className}`}
    >
      <NodeTrace />
      {label}
    </div>
  );
}
