import { ASK_SUGGESTIONS } from "../../lib/constant";
import { ModeEmptyState } from "../study/ModeEmptyState";
import { SuggestionList } from "../study/SuggestionList";

export function AskNotesMode({ onPick }: { onPick: (text: string) => void }) {
  return (
    <ModeEmptyState title="Your notes are indexed.">
      <SuggestionList label="Try asking" items={ASK_SUGGESTIONS} onPick={onPick} />
    </ModeEmptyState>
  );
}
