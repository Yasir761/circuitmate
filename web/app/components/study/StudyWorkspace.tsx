"use client";

import { useMemo } from "react";
import { AskNotesMode } from "../modes/AskNotesMode";
import { ExplainConceptMode } from "../modes/ExplainConceptMode";
import { SolveProblemMode } from "../modes/SolveProblemMode";
import { ExamWorkspace } from "../exam/ExamWorkspace";
import { WorkspaceHeader } from "../layout/WorkspaceHeader";
import { ChatComposer, COMPOSER_ID } from "./ChatComposer";
import { MessageList } from "./MessageList";
import { StudyMaterialCard } from "./StudyMaterialCard";
import { StudyModeTabs } from "./StudyModeTabs";
import { SubjectSelector } from "./SubjectSelector";
import type {
  ChatController,
  DocumentInfo,
  ExamController,
  StudyMode,
} from "../../types";

export function StudyWorkspace({
  material,
  subject,
  onSubjectChange,
  mode,
  onSelectMode,
  chat,
  exam,
}: {
  material: DocumentInfo;
  subject: string;
  onSubjectChange: (value: string) => void;
  mode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  chat: ChatController;
  exam: ExamController;
}) {
  const chatMode = mode === "exam" ? null : mode;

  const thread = useMemo(
    () =>
      chatMode ? chat.messages.filter((item) => item.mode === chatMode) : [],
    [chat.messages, chatMode],
  );

  function fillComposer(text: string) {
    chat.setDraft(text);
    requestAnimationFrame(() =>
      document.getElementById(COMPOSER_ID)?.focus(),
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col py-6 sm:py-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <StudyMaterialCard material={material} />
        <SubjectSelector value={subject} onChange={onSubjectChange} />
      </div>

      <div className="mt-6">
        <StudyModeTabs
          mode={mode}
          onSelect={onSelectMode}
          examBusy={exam.phase !== null}
        />
      </div>

      <div
        id="study-panel"
        role="tabpanel"
        aria-labelledby={`mode-tab-${mode}`}
        className="flex flex-1 flex-col pt-8"
      >
        {chatMode === null ? (
          <ExamWorkspace controller={exam} subject={subject} />
        ) : (
          <>
            <WorkspaceHeader mode={chatMode} />

            <div className="flex-1">
              {thread.length === 0 ? (
                chatMode === "chat" ? (
                  <AskNotesMode onPick={chat.sendText} />
                ) : chatMode === "explain" ? (
                  <ExplainConceptMode onPick={chat.sendText} />
                ) : (
                  <SolveProblemMode onPick={fillComposer} />
                )
              ) : (
                <MessageList
                  messages={thread}
                  mode={chatMode}
                  loadingMode={chat.loadingMode}
                  onRevealed={chat.markRevealed}
                />
              )}
            </div>

            <ChatComposer
              value={chat.draft}
              onChange={chat.setDraft}
              onSubmit={chat.send}
              loading={chat.loadingMode !== null}
              mode={chatMode}
              subject={subject}
            />
          </>
        )}
      </div>
    </div>
  );
}
