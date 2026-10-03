import { SectionLabel } from "./SectionLabel";
import { focusRing } from "./focus";

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id}>
        <SectionLabel as="span">{label}</SectionLabel>
      </label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-lg border border-black/10 bg-[#F5F6F4] px-3 py-2.5 text-sm font-medium transition-colors hover:border-black/25 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
