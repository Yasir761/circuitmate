import type { ReactNode } from "react";
import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";
import { EquationText } from "../study/EquationText";
import type { ExamState } from "../../types";

export function ExamQuestion({
  number,
  exam,
  children,
}: {
  number: number;
  exam: ExamState;
  children: ReactNode;
}) {
  const meta = [
    exam.subject,
    `${exam.settings.marks} marks`,
    exam.settings.questionType,
    exam.settings.difficulty,
  ];

  return (
    <CircuitCard
      as="section"
      accent="blue"
      className="p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel tone="blue">
          Question {String(number).padStart(2, "0")}
        </SectionLabel>

        <ul
          className="flex flex-wrap gap-2"
          aria-label="Question details"
        >
          {meta.map((item) => (
            <li
              key={item}
              className="cm-mono rounded-md bg-[#EFF6FF] px-2.5 py-1 text-[11px] uppercase tracking-wide text-[#1D4ED8]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <EquationText
          text={exam.question}
          className="text-xl font-medium leading-snug tracking-tight sm:text-2xl"
        />
      </div>

      {children}
    </CircuitCard>
  );
}