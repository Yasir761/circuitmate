import { MODE_META } from "../../lib/constant";
import { SectionLabel } from "../ui/SectionLabel";
import type { ChatMode } from "../../types";

export function WorkspaceHeader({ mode }: { mode: ChatMode }) {
  const meta = MODE_META[mode];

  return (
    <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        <SectionLabel tone="blue">{meta.eyebrow}</SectionLabel>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {meta.title}
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B716D]">
          {meta.description}
        </p>
      </div>

      <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-black/10 bg-white px-3 py-1.5 lg:self-auto">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
        <SectionLabel as="span">Grounded in your notes</SectionLabel>
      </span>
    </div>
  );
}
