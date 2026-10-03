import { Button } from "../ui/Button";
import { CircuitCard } from "../ui/CircuitCard";
import { SelectField } from "../ui/SelectField";
import type {
  Difficulty,
  ExamSettings,
  Marks,
  QuestionType,
} from "../../types";

const DIFFICULTY = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

const MARKS = [
  { value: "2", label: "2 marks" },
  { value: "5", label: "5 marks" },
  { value: "10", label: "10 marks" },
] as const;

const TYPES = [
  { value: "theory", label: "Theory" },
  { value: "numerical", label: "Numerical" },
  { value: "conceptual", label: "Conceptual" },
  { value: "mixed", label: "Mixed" },
] as const;

export function ExamControls({
  settings,
  dirty,
  busy,
  hasQuestion,
  onChange,
  onGenerate,
}: {
  settings: ExamSettings;
  dirty: boolean;
  busy: boolean;
  hasQuestion: boolean;
  onChange: (patch: Partial<ExamSettings>) => void;
  onGenerate: () => void;
}) {
  return (
    <CircuitCard className="p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <SelectField
          id="exam-difficulty"
          label="Difficulty"
          value={settings.difficulty}
          options={DIFFICULTY}
          disabled={busy}
          onChange={(value) => onChange({ difficulty: value as Difficulty })}
        />

        <SelectField
          id="exam-marks"
          label="Marks"
          value={String(settings.marks)}
          options={MARKS}
          disabled={busy}
          onChange={(value) => onChange({ marks: Number(value) as Marks })}
        />

        <SelectField
          id="exam-type"
          label="Question type"
          value={settings.questionType}
          options={TYPES}
          disabled={busy}
          onChange={(value) =>
            onChange({ questionType: value as QuestionType })
          }
        />

        <Button
          onClick={onGenerate}
          disabled={busy}
          className="sm:col-span-2 lg:col-span-1"
        >
          {busy
            ? "Generating..."
            : hasQuestion && dirty
              ? "Apply and regenerate"
              : "Generate question"}
        </Button>
      </div>

      {hasQuestion && dirty && !busy && (
        <p className="mt-3 text-xs text-[#6B716D]">
          Settings changed. Regenerate to get a question that matches them.
        </p>
      )}
    </CircuitCard>
  );
}
