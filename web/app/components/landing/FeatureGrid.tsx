import { CircuitCard } from "../ui/CircuitCard";
import { SectionLabel } from "../ui/SectionLabel";

const FEATURES = [
  {
    tag: "Ask",
    title: "Ask my notes",
    text: "Find explanations inside your own study material, with the pages they came from.",
  },
  {
    tag: "Explain",
    title: "Explain concepts",
    text: "Break a hard idea into concept, intuition, equation and an exam note.",
  },
  {
    tag: "Solve",
    title: "Solve problems",
    text: "Follow a problem from given values to result, one step at a time.",
  },
  {
    tag: "Practice",
    title: "Exam simulator",
    text: "Answer exam-style questions and see what you got right and what to fix.",
  },
] as const;

export function FeatureGrid() {
  return (
    <ul className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature) => (
        <li key={feature.title}>
          <CircuitCard className="h-full p-5 transition-colors duration-150 hover:border-black/25">
            <SectionLabel tone="blue">{feature.tag}</SectionLabel>
            <h3 className="mt-6 text-sm font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B716D]">{feature.text}</p>
          </CircuitCard>
        </li>
      ))}
    </ul>
  );
}
