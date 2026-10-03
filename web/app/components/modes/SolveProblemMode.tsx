import { SOLVE_EXAMPLES } from "../../lib/constant";
import { ModeEmptyState } from "../study/ModeEmptyState";
import { SectionLabel } from "../ui/SectionLabel";
import { SuggestionList } from "../study/SuggestionList";

const STEPS = ["Problem", "Given", "Approach", "Solution", "Result", "Exam note"];

export function SolveProblemMode({
  onPick,
}: {
  onPick: (text: string) => void;
}) {
  return (
    <ModeEmptyState title="Paste a problem from your notes.">
      <div>
        <SectionLabel>Every solution is laid out as</SectionLabel>

        <ol className="mt-3 flex flex-wrap items-center gap-y-2">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center">
              <span className="cm-mono rounded-md border border-black/10 bg-[#F5F6F4] px-2.5 py-1.5 text-[11px] text-[#4B514D]">
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <span aria-hidden="true" className="h-px w-3 bg-[#2563EB]/40" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <SuggestionList
          label="Example prompts (fills the box so you can edit it)"
          items={SOLVE_EXAMPLES}
          onPick={onPick}
        />
      </div>
    </ModeEmptyState>
  );
}
