import type { CSSProperties } from "react";
import { SectionLabel } from "../ui/SectionLabel";
import type { Source } from "../../types";

/** Page numbers only: titles are never invented when the backend sends none. */
export function SourceReferences({
  sources,
  label = "Source",
  className = "",
}: {
  sources: Source[];
  label?: string;
  className?: string;
}) {
  const pages = Array.from(new Set(sources.map((source) => source.page)));

  if (pages.length === 0) return null;

  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>

      <ul aria-label={`${label} pages`} className="mt-2 flex flex-wrap gap-2">
        {pages.map((page, index) => (
          <li
            key={page}
            style={{ "--d": `${index * 60}ms` } as CSSProperties}
            className="cm-fade cm-mono rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-[11px] text-[#4B514D]"
          >
            Source page {page}
          </li>
        ))}
      </ul>
    </div>
  );
}
