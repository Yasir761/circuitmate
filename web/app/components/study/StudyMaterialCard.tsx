import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";
import { StatusIndicator } from "../ui/StatusIndicator";
import type { DocumentInfo } from "../../types";

export function StudyMaterialCard({ material }: { material: DocumentInfo }) {
  return (
    <CircuitCard accent="blue" className="min-w-0 p-5">
      <SectionLabel tone="blue">Current material</SectionLabel>

      <h2 className="mt-2 truncate text-lg font-semibold" title={material.filename}>
        {material.filename}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B716D]">
        <span>{material.pages} pages</span>
        <span aria-hidden="true">·</span>
        <span>{material.chunks} indexed sections</span>
        <span aria-hidden="true">·</span>
        <StatusIndicator tone="ready" label="Ready" />
      </div>
    </CircuitCard>
  );
}
