import { EXPLAIN_SUGGESTIONS } from "../../lib/constant";
import { ModeEmptyState } from "../study/ModeEmptyState";
import { SuggestionList } from "../study/SuggestionList";

export function ExplainConceptMode({
  onPick,
}: {
  onPick: (text: string) => void;
}) {
  return (
    <ModeEmptyState title="Pick a concept, or type your own below.">
      <SuggestionList
        label="Start with"
        items={EXPLAIN_SUGGESTIONS}
        onPick={onPick}
      />
    </ModeEmptyState>
  );
}
