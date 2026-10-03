import { EXPLAIN_HEADINGS, SOLUTION_HEADINGS } from "../../lib/constant";
import {
  isStructuredSolution,
  isUngrounded,
  parseSections,
} from "../../lib/parsing";
import { CircuitMateMark } from "../brand/CircuitMateMark";
import { SectionLabel } from "../ui/SectionLabel";
import { SourceReferences } from "./SourceReferences";
import { StreamingText } from "./StreamingText";
import { StructuredAnswer } from "./StructuredAnswer";
import type { Message } from "../../types";

function AssistantBody({
  message,
  onRevealed,
}: {
  message: Message;
  onRevealed: (id: string) => void;
}) {
  if (message.isError) {
    return (
      <p role="alert" className="text-sm leading-7 text-red-700">
        {message.content}
      </p>
    );
  }

  if (message.mode === "solve" && isStructuredSolution(message.content)) {
    return (
      <StructuredAnswer
        sections={parseSections(message.content, SOLUTION_HEADINGS)}
      />
    );
  }

  if (message.mode === "explain") {
    const sections = parseSections(message.content, EXPLAIN_HEADINGS);
    if (sections.length >= 2) return <StructuredAnswer sections={sections} />;
  }

  return (
    <StreamingText
      text={message.content}
      animate={Boolean(message.fresh)}
      onDone={() => onRevealed(message.id)}
    />
  );
}

export function MessageBubble({
  message,
  onRevealed,
}: {
  message: Message;
  onRevealed: (id: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] sm:max-w-[75%]">
        <SectionLabel className="mb-2 text-right">You</SectionLabel>
        <div className="whitespace-pre-wrap rounded-2xl bg-[#151817] px-5 py-4 text-sm leading-7 text-white">
          {message.content}
        </div>
      </div>
    );
  }

  const ungrounded = !message.isError && isUngrounded(message.content);
  const showSources =
    !message.isError &&
    !ungrounded &&
    !message.fresh &&
    (message.sources?.length ?? 0) > 0;

  return (
    <div className="max-w-full sm:max-w-[92%]">
      <div className="mb-2 flex items-center gap-2">
        <CircuitMateMark size={18} className="text-[#151817]" />
        <SectionLabel as="span">CircuitMate</SectionLabel>
      </div>

      {ungrounded && (
        <SectionLabel tone="amber" className="mb-2">
          Not found in your notes
        </SectionLabel>
      )}

      <AssistantBody message={message} onRevealed={onRevealed} />

      {showSources && message.sources && (
        <SourceReferences sources={message.sources} className="mt-5" />
      )}
    </div>
  );
}
