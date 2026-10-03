import { CircuitCard } from "../ui/CircuitCard";
import { SourceReferences } from "../study/SourceReferences";
import type { Source } from "../../types";

export function ExamSources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <CircuitCard className="p-6">
      <SourceReferences sources={sources} label="Evidence" />
      <p className="mt-3 text-sm text-[#6B716D]">
        Pages from your uploaded material that the evaluation used.
      </p>
    </CircuitCard>
  );
}
