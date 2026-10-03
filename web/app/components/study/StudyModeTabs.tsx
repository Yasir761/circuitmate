"use client";

import type { KeyboardEvent } from "react";
import { MODE_ORDER, TAB_LABELS } from "../../lib/constant";
import { focusRing } from "../ui/focus";
import type { StudyMode } from "../../types";

export function StudyModeTabs({
  mode,
  onSelect,
  examBusy,
}: {
  mode: StudyMode;
  onSelect: (mode: StudyMode) => void;
  examBusy: boolean;
}) {
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = MODE_ORDER.length - 1;
    let next: number;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    const target = MODE_ORDER[next];
    if (target === "exam" && examBusy) return;

    onSelect(target);
    document.getElementById(`mode-tab-${target}`)?.focus();
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div
        role="tablist"
        aria-label="Study tools"
        className="flex min-w-max gap-1 border-b border-black/10"
      >
        {MODE_ORDER.map((item, index) => {
          const active = item === mode;

          return (
            <button
              key={item}
              id={`mode-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="study-panel"
              tabIndex={active ? 0 : -1}
              disabled={item === "exam" && examBusy}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => handleKey(event, index)}
              className={`relative whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${
                active
                  ? "text-[#151817]"
                  : "text-[#6B716D] hover:text-[#151817]"
              }`}
            >
              {TAB_LABELS[item]}

              <span
                aria-hidden="true"
                className={`absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-[#2563EB] transition-transform duration-200 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
