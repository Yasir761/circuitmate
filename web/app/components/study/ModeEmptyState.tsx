import type { ReactNode } from "react";
import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";

export function ModeEmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <CircuitCard className="p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
        <SectionLabel tone="green">Ready when you are</SectionLabel>
      </div>

      <p className="mt-4 text-lg font-semibold tracking-tight">{title}</p>

      <div className="mt-6">{children}</div>
    </CircuitCard>
  );
}
