import { splitContentBlocks } from "../../lib/parsing";

function formatInlineMath(text: string): string {
  return text
    // Remove inline LaTeX delimiters.
    .replace(/\$([^$]+)\$/g, "$1")
    // Convert common LaTeX commands to readable Unicode.
    .replace(/\\phi/g, "φ")
    .replace(/\\Phi/g, "Φ")
    .replace(/\\mu/g, "μ")
    .replace(/\\omega/g, "ω")
    .replace(/\\theta/g, "θ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\pi/g, "π")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\delta/g, "δ")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    // Common subscript notation: R_{th} → R₍th₎
    .replace(/_\{([^}]+)\}/g, "₍$1₎")
    // Simple subscript: R_L → Rₗ
    .replace(/_([A-Za-z0-9])/g, "₍$1₎");
}

/** Renders prose and equation-like lines into readable technical blocks. */
export function EquationText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const blocks = splitContentBlocks(text);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, index) =>
        block.type === "equation" ? (
          <pre
            key={index}
            className="cm-mono overflow-x-auto rounded-lg border border-[#2563EB]/15 bg-[#EFF6FF] px-4 py-2.5 text-[13px] leading-6 text-[#1E3A8A]"
          >
            {formatInlineMath(block.text)}
          </pre>
        ) : (
          <p
            key={index}
            className="whitespace-pre-wrap"
          >
            {formatInlineMath(block.text)}
          </p>
        ),
      )}
    </div>
  );
}