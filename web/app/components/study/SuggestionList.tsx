import { SectionLabel } from "../ui/SectionLabel";
import { focusRing } from "../ui/focus";

export function SuggestionList({
  items,
  onPick,
  label,
}: {
  items: string[];
  onPick: (text: string) => void;
  label: string;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>

      <ul className="mt-3 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onPick(item)}
              className={`h-full w-full rounded-xl border border-black/10 bg-[#F5F6F4] p-4 text-left text-sm leading-6 transition duration-150 hover:-translate-y-px hover:border-[#2563EB]/40 hover:bg-white ${focusRing}`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
