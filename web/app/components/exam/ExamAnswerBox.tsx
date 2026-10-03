import { Button } from "../ui/Button";
import { LoadingState } from "../ui/LoadingState";
import { SectionLabel } from "../ui/SectionLabel";

export function ExamAnswerBox({
  answer,
  evaluated,
  evaluating,
  onChange,
  onSubmit,
}: {
  answer: string;
  evaluated: boolean;
  evaluating: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  if (evaluated) {
    return (
      <div className="mt-7 border-t border-black/10 pt-5">
        <SectionLabel>Your answer</SectionLabel>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#2B312E]">
          {answer}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <label htmlFor="exam-answer" className="sr-only">
        Your answer
      </label>

      <textarea
        id="exam-answer"
        value={answer}
        onChange={(event) => onChange(event.target.value)}
        disabled={evaluating}
        rows={9}
        placeholder="Write your answer as you would in an ECE exam..."
        className="w-full resize-y rounded-xl border border-black/10 bg-[#F5F6F4] p-5 text-sm leading-7 outline-none transition placeholder:text-[#8A908C] focus:border-[#2563EB]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {evaluating ? (
          <LoadingState label="Checking your answer against your notes..." />
        ) : (
          <p className="text-xs text-[#6B716D]">
            Include definitions, equations, reasoning and the terms from your notes.
          </p>
        )}

        <Button
          onClick={onSubmit}
          disabled={evaluating || !answer.trim()}
          className="sm:ml-auto"
        >
          {evaluating ? "Evaluating..." : "Submit answer"}
        </Button>
      </div>
    </div>
  );
}
