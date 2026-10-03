import type { ReactNode } from "react";
import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";

const glyphProps = {
  width: 28,
  height: 24,
  viewBox: "0 0 28 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const STAGES: { label: string; detail: string; glyph: ReactNode }[] = [
  {
    label: "Notes",
    detail: "Your PDF, indexed page by page",
    glyph: (
      <svg {...glyphProps}>
        <path d="M8 3h9l4 4v14H8z" />
        <path d="M17 3v4h4M11 12h7M11 16h7" />
      </svg>
    ),
  },
  {
    label: "Circuit",
    detail: "A network, theorem or problem",
    glyph: (
      <svg {...glyphProps}>
        <path d="M2 12h6l2-5 4 10 2-5h2" />
        <path d="M20 12h6" />
        <circle cx="2" cy="12" r="1.2" fill="currentColor" />
        <circle cx="26" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "AI",
    detail: "Reads your notes before it answers",
    glyph: (
      <svg {...glyphProps}>
        <circle cx="14" cy="12" r="3" fill="#2563EB" stroke="none" />
        <path d="M11 12H3M17 12h8M14 9V3M14 15v6" />
        <circle cx="3" cy="12" r="1.2" fill="currentColor" />
        <circle cx="25" cy="12" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Solution",
    detail: "Steps that point back to pages",
    glyph: (
      <svg {...glyphProps}>
        <path d="M4 9h12M4 15h12" />
        <path d="M19 12l2.5 2.5L26 8" />
      </svg>
    ),
  },
];

export function EngineeringMotif() {
  return (
    <CircuitCard className="relative overflow-hidden p-6 sm:p-7">
      <SectionLabel>From notes to solution</SectionLabel>

      <ol className="relative mt-6 space-y-6 pl-9">
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[7px] top-3 w-px bg-[#2563EB]/25"
        />

        {STAGES.map((stage, index) => (
          <li key={stage.label} className="relative flex items-center gap-4">
            <span
              aria-hidden="true"
              className={`absolute -left-9 top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full border-2 border-[#2563EB] ${
                index === STAGES.length - 1 ? "bg-[#2563EB]" : "bg-white"
              }`}
            />

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-[#F5F6F4] text-[#151817]">
              {stage.glyph}
            </span>

            <span>
              <span className="block text-sm font-semibold">{stage.label}</span>
              <span className="block text-sm text-[#6B716D]">{stage.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-7 flex items-end justify-between gap-4 border-t border-black/10 pt-5">
        <div className="cm-mono rounded-lg bg-[#EFF6FF] px-3 py-2 text-[13px] text-[#1E3A8A]">
          P_max = V_th² / 4R_th
        </div>

        <svg
          viewBox="0 0 160 36"
          className="h-9 w-40 shrink-0 text-[#2563EB]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M0 18C10 0 20 0 30 18S50 36 60 18 80 0 90 18s20 18 30 0 20-18 30 0 10 9 10 9" />
        </svg>
      </div>
    </CircuitCard>
  );
}
