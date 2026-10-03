import type { CSSProperties, ReactNode } from "react";

type Accent = "none" | "blue" | "green" | "amber";

const ACCENTS: Record<Accent, string> = {
  none: "",
  blue: "border-l-2 border-l-[#2563EB]",
  green: "border-l-2 border-l-[#10B981]",
  amber: "border-l-2 border-l-[#F59E0B]",
};

export function CircuitCard({
  as: Tag = "div",
  accent = "none",
  className = "",
  style,
  children,
}: {
  as?: "div" | "section" | "article";
  accent?: Accent;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag
      style={style}
      className={`rounded-xl border border-black/10 bg-white ${ACCENTS[accent]} ${className}`}
    >
      {children}
    </Tag>
  );
}
