
"use client";

import "./globals.css";

import { useCircuitMate } from "./hooks/usecircuitmate";
import { LandingHero } from "./components/landing/LandingHero";
import { AppShell } from "./components/layout/AppShell";
import { Header } from "./components/layout/Header";
import { StudyWorkspace } from "./components/study/StudyWorkspace";
import { ErrorNotice } from "./components/ui/ErrorNotice";

export default function Home() {
  const app = useCircuitMate();

  return (
    <AppShell
      header={
        <Header
          material={app.material}
          uploading={app.uploading}
          uploadPhase={app.uploadPhase}
          onHome={() => app.selectMode("chat")}
          onUpload={app.openFilePicker}
        />
      }
    >
      <input
        ref={app.fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        tabIndex={-1}
        aria-label="Upload PDF notes"
        onChange={app.handleFileChange}
      />

      {app.uploadError && (
        <ErrorNotice className="mx-auto mt-4 w-full max-w-6xl">
          {app.uploadError}
        </ErrorNotice>
      )}

      {!app.material ? (
        <LandingHero
          uploading={app.uploading}
          uploadPhase={app.uploadPhase}
          onUpload={app.openFilePicker}
        />
      ) : (
        <StudyWorkspace
          material={app.material}
          subject={app.subject}
          onSubjectChange={app.changeSubject}
          mode={app.mode}
          onSelectMode={app.selectMode}
          chat={app.chat}
          exam={app.exam}
        />
      )}
    </AppShell>
  );
}