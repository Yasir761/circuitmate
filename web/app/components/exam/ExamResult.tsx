import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { getScoreLabel, parseEvaluation } from "../../lib/parsing";
import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";
import { EquationText } from "../study/EquationText";
import { ExamSources } from "./ExamSources";
import type { Marks, Source } from "../../types";

function Step({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div
      className="cm-rise"
      style={{ "--d": `${index * 110}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function FeedbackList({
  items,
  tone,
  title,
  mark,
}: {
  items: string[];
  tone: "green" | "amber";
  title: string;
  mark: string;
}) {
  const dot = tone === "green" ? "bg-[#10B981]" : "bg-[#F59E0B]";
  const badge =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <CircuitCard accent={tone} className="p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${badge}`}
        >
          {mark}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm leading-7 text-[#2B312E]"
          >
            <span
              aria-hidden="true"
              className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </CircuitCard>
  );
}

export function ExamResult({
  evaluation,
  marks,
  sources,
}: {
  evaluation: string;
  marks: Marks;
  sources: Source[];
}) {
  const parsed = useMemo(() => parseEvaluation(evaluation), [evaluation]);

  const hasStructure =
    parsed.right.length > 0 ||
    parsed.improve.length > 0 ||
    parsed.modelAnswer.length > 0;

  let step = 0;

  return (
    <div className="mt-5 space-y-4" aria-live="polite">
      <Step index={step++}>
        <CircuitCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <SectionLabel>Your result</SectionLabel>
              <h3 className="mt-2 text-xl font-semibold">
                {getScoreLabel(parsed.score, marks)}
              </h3>
            </div>

            {parsed.score !== null && (
              <div className="text-right">
                <p className="text-5xl font-semibold tracking-tight">
                  {parsed.score}
                  <span className="ml-1 text-xl text-[#8A908C]">/ {marks}</span>
                </p>
                <p className="mt-1 text-xs text-[#6B716D]">
                  checked against your notes
                </p>
              </div>
            )}
          </div>
        </CircuitCard>
      </Step>

      {parsed.right.length > 0 && (
        <Step index={step++}>
          <FeedbackList
            items={parsed.right}
            tone="green"
            title="What you got right"
            mark="✓"
          />
        </Step>
      )}

      {parsed.improve.length > 0 && (
        <Step index={step++}>
          <FeedbackList
            items={parsed.improve}
            tone="amber"
            title="What to improve"
            mark="→"
          />
        </Step>
      )}

      {parsed.modelAnswer && (
        <Step index={step++}>
          <CircuitCard className="p-6">
            <SectionLabel tone="blue">Model answer · based on your notes</SectionLabel>
            <div className="mt-4 rounded-lg bg-[#F5F6F4] p-5">
              <EquationText
                text={parsed.modelAnswer}
                className="text-sm leading-7 text-[#2B312E]"
              />
            </div>
          </CircuitCard>
        </Step>
      )}

      {!hasStructure && (
        <Step index={step++}>
          <CircuitCard className="p-6">
            <SectionLabel>Feedback</SectionLabel>
            <div className="mt-4">
              <EquationText
                text={parsed.raw}
                className="text-sm leading-7 text-[#2B312E]"
              />
            </div>
          </CircuitCard>
        </Step>
      )}

      <Step index={step++}>
        <ExamSources sources={sources} />
      </Step>
    </div>
  );
}
