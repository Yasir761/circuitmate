import { Button } from "../ui/Button";
import { ErrorNotice } from "../ui/ErrorNotice";
import { LoadingState } from "../ui/LoadingState";
import { SectionLabel } from "../ui/SectionLabel";
import { ExamAnswerBox } from "./ExamAnswerBox";
import { ExamControls } from "./ExamControls";
import { ExamQuestion } from "./ExamQuestion";
import { ExamResult } from "./ExamResult";
import type { ExamController } from "../../types";

export function ExamWorkspace({
  controller,
  subject,
}: {
  controller: ExamController;
  subject: string;
}) {
  const { exam, phase, error } = controller;
  const generating = phase === "generating";
  const evaluating = phase === "evaluating";

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 pb-12">
      <div className="mb-8">
        <SectionLabel tone="blue">Exam simulator</SectionLabel>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Test your understanding.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B716D]">
          Answer using your {subject} notes. CircuitMate checks your response
          against the same material.
        </p>
      </div>

      <ExamControls
        settings={controller.settings}
        dirty={controller.settingsDirty}
        busy={phase !== null}
        hasQuestion={exam !== null}
        onChange={controller.updateSettings}
        onGenerate={controller.generate}
      />

      <div className="mt-6">
        {error && <ErrorNotice className="mb-5">{error}</ErrorNotice>}

        {generating && !exam && (
          <LoadingState
            variant="block"
            label="Building your exam question..."
            hint="Using your study material."
          />
        )}

        {exam && (
          <>
            <ExamQuestion number={controller.number} exam={exam}>
              <ExamAnswerBox
                answer={exam.answer}
                evaluated={Boolean(exam.evaluation)}
                evaluating={evaluating}
                onChange={controller.setAnswer}
                onSubmit={controller.submit}
              />
            </ExamQuestion>

            {exam.evaluation && (
              <>
                <ExamResult
                  evaluation={exam.evaluation}
                  marks={exam.settings.marks}
                  sources={exam.sources}
                />

                <div className="flex justify-end pt-5">
                  <Button onClick={controller.next} disabled={phase !== null}>
                    {generating ? "Generating..." : "Next question"}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
