import { CircuitMateLogo } from "../brand/CircuitMateLogo";
import { Button } from "../ui/Button";
import { StatusIndicator } from "../ui/StatusIndicator";
import { focusRing } from "../ui/focus";
import type { DocumentInfo, UploadPhase } from "../../types";

const PHASE_LABEL: Record<Exclude<UploadPhase, null>, string> = {
  reading: "Reading your notes...",
  indexing: "Building your study map...",
};

export function Header({
  material,
  uploading,
  uploadPhase,
  onHome,
  onUpload,
}: {
  material: DocumentInfo | null;
  uploading: boolean;
  uploadPhase: UploadPhase;
  onHome: () => void;
  onUpload: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onHome}
        aria-label="CircuitMate home"
        className={`rounded-lg ${focusRing}`}
      >
        <CircuitMateLogo showTagline />
      </button>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          {uploading ? (
            <StatusIndicator
              tone="busy"
              label={PHASE_LABEL[uploadPhase ?? "reading"]}
            />
          ) : material ? (
            <StatusIndicator tone="ready" label="Notes ready" />
          ) : (
            <StatusIndicator tone="idle" label="No notes yet" />
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onUpload}
          disabled={uploading}
        >
          {uploading ? "Indexing..." : material ? "Replace notes" : "Upload notes"}
        </Button>
      </div>
    </header>
  );
}
