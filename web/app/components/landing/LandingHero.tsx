import { Button } from "../ui/Button";
import { LoadingState } from "../ui/LoadingState";
import { SectionLabel } from "../ui/SectionLabel";
import { EngineeringMotif } from "./EngineeringMotif";
import { FeatureGrid } from "./FeatureGrid";
import type { UploadPhase } from "../../types";

export function LandingHero({
  uploading,
  uploadPhase,
  onUpload,
}: {
  uploading: boolean;
  uploadPhase: UploadPhase;
  onUpload: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            <SectionLabel tone="blue">AI lab partner for ECE</SectionLabel>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Study your ECE material
            <br className="hidden sm:block" /> like you have a lab partner.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#6B716D]">
            Upload your notes. Understand difficult concepts, solve engineering
            problems, and practice exam questions using the material you
            actually study.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button onClick={onUpload} disabled={uploading}>
              Upload your notes
            </Button>

            {uploading ? (
              <LoadingState
                label={
                  uploadPhase === "indexing"
                    ? "Building your study map..."
                    : "Reading your notes..."
                }
              />
            ) : (
              <span className="text-sm text-[#6B716D]">PDF notes, any ECE subject</span>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2">
            <SectionLabel>Grounded in your notes</SectionLabel>
            <span aria-hidden="true" className="h-px w-6 bg-black/20" />
            <SectionLabel>Powered by Gemma</SectionLabel>
          </div>
        </div>

        <EngineeringMotif />
      </div>

      <FeatureGrid />
    </div>
  );
}
