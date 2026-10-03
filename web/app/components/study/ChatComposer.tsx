import type { FormEvent } from "react";
import { MODE_META } from "../../lib/constant";
import { Button } from "../ui/Button";
import { SectionLabel } from "../ui/SectionLabel";
import { focusRing } from "../ui/focus";
import type { ChatMode } from "../../types";

export const COMPOSER_ID = "cm-composer";

const ACTION_LABEL: Record<ChatMode, string> = {
  chat: "Ask",
  explain: "Explain",
  solve: "Solve",
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  loading,
  mode,
  subject,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  mode: ChatMode;
  subject: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 -mx-4 mt-8 bg-gradient-to-t from-[#F5F6F4] via-[#F5F6F4] to-transparent px-4 pb-4 pt-6 sm:mx-0 sm:px-0"
    >
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-black/10 bg-white p-2 shadow-sm transition-colors focus-within:border-[#2563EB]/50">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <textarea
            id={COMPOSER_ID}
            aria-label={MODE_META[mode].placeholder.replace(/\.\.\.$/, "")}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={MODE_META[mode].placeholder}
            rows={3}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className="min-h-16 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-[#8A908C]"
          />

          <Button
            type="submit"
            disabled={loading || !value.trim()}
            className={`w-full sm:w-auto ${focusRing}`}
          >
            {loading ? "Working..." : ACTION_LABEL[mode]}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
          <SectionLabel as="span">
            {subject} · Grounded in your notes
          </SectionLabel>
          <span className="hidden text-[11px] text-[#6B716D] sm:block">
            Enter to send · Shift + Enter for new line
          </span>
        </div>
      </div>
    </form>
  );
}
