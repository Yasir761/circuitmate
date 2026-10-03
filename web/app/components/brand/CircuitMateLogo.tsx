import { CircuitMateMark } from "./CircuitMateMark";

const SIZES = {
  sm: { mark: 20, text: "text-sm" },
  md: { mark: 28, text: "text-lg" },
} as const;

export function CircuitMateLogo({
  size = "md",
  showTagline = false,
  className = "",
}: {
  size?: keyof typeof SIZES;
  showTagline?: boolean;
  className?: string;
}) {
  const config = SIZES[size];

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <CircuitMateMark size={config.mark} className="shrink-0 text-[#151817]" />

      <span className="flex flex-col text-left leading-tight">
        <span className={`${config.text} font-semibold tracking-tight`}>
          CircuitMate
        </span>
        {showTagline && (
          <span className="hidden text-xs text-[#6B716D] sm:block">
            AI lab partner for ECE
          </span>
        )}
      </span>
    </span>
  );
}
