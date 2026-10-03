import type { CSSProperties } from "react";
import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";
import { EquationText } from "./EquationText";
import type { AnswerSection } from "../../types";

function toneFor(title: string) {
  if (title === "RESULT") return "green" as const;
  if (title === "EXAM NOTE") return "amber" as const;
  if (title === "SOLUTION" || title === "EQUATION") return "blue" as const;
  return "none" as const;
}

/** Sections joined by a vertical signal line, each one a distinct card. */
export function StructuredAnswer({ sections }: { sections: AnswerSection[] }) {
  return (
    <ol className="relative space-y-3 pl-7 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-[#2563EB]/25 before:content-['']">
      {sections.map((section, index) => {
        const accent = toneFor(section.title);
        const emphasis = section.title === "RESULT";

        return (
          <li
            key={`${section.title}-${index}`}
            style={{ "--d": `${index * 90}ms` } as CSSProperties}
            className="cm-rise relative"
          >
            <span
              aria-hidden="true"
              className={`absolute -left-7 top-5 h-[15px] w-[15px] rounded-full border-2 ${
                accent === "green"
                  ? "border-[#10B981] bg-[#10B981]"
                  : accent === "amber"
                    ? "border-[#F59E0B] bg-white"
                    : "border-[#2563EB] bg-white"
              }`}
            />

            <CircuitCard accent={accent} className="p-5">
              <SectionLabel
                tone={accent === "none" ? "muted" : accent}
                className="mb-3"
              >
                {section.title}
              </SectionLabel>

              <EquationText
                text={section.content}
                className={`text-sm leading-7 text-[#2B312E] ${
                  emphasis ? "text-base font-medium" : ""
                }`}
              />
            </CircuitCard>
          </li>
        );
      })}
    </ol>
  );
}
