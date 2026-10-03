import { SUBJECTS } from "../../lib/constant";
import { CircuitCard } from "../ui/CircuitCard";
import { SelectField } from "../ui/SelectField";

const OPTIONS = SUBJECTS.map((item) => ({ value: item, label: item }));

export function SubjectSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <CircuitCard className="p-5">
      <SelectField
        id="study-subject"
        label="Study subject"
        value={value}
        options={OPTIONS}
        onChange={onChange}
      />
    </CircuitCard>
  );
}
