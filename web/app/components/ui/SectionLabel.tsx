import type { ReactNode } from "react";

type Tone = "muted" | "blue" | "green" | "amber";

const TONES: Record<Tone, string> = {
  muted: "text-[#6B716D]",
  blue: "text-[#2563EB]",
  green: "text-[#047857]",
  amber: "text-[#B45309]",
};

export function SectionLabel({
  children,
  tone = "muted",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  as?: "p" | "span";
  className?: string;
}) {
  return (
    <Tag
      className={`cm-mono text-[10px] font-medium uppercase tracking-[0.14em] ${TONES[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}
