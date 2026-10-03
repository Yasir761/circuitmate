"use client";

import { useTypewriter } from "../../hooks/useTypewriter";
import { EquationText } from "./EquationText";

export function StreamingText({
  text,
  animate,
  onDone,
}: {
  text: string;
  animate: boolean;
  onDone: () => void;
}) {
  const { shown, done } = useTypewriter(text, animate, onDone);

  if (!done) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-8 text-[#2B312E]">
        {shown}
        <span aria-hidden="true" className="cm-cursor" />
      </p>
    );
  }

  return <EquationText text={text} className="text-sm leading-8 text-[#2B312E]" />;
}
