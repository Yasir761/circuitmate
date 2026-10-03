"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ApiError,
  askNotes,
  evaluateAnswer,
  getChatHistory,
  startExam as requestExam,
  uploadNotes,
} from "../lib/api";

import { SUBJECTS } from "../lib/constant";

import type {
  ChatController,
  ChatMode,
  DocumentInfo,
  ExamController,
  ExamPhase,
  ExamSettings,
  ExamState,
  Message,
  StudyMode,
  UploadPhase,
} from "../types";

const DEFAULT_EXAM_SETTINGS: ExamSettings = {
  difficulty: "medium",
  marks: 5,
  questionType: "theory",
};

const CONNECTION_ERROR =
  "I couldn't connect to CircuitMate. Make sure the backend is running.";

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function getInitialSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = window.localStorage.getItem(
    "circuitmate_session_id",
  );

  if (stored) {
    return stored;
  }

  const id = newId();

  window.localStorage.setItem(
    "circuitmate_session_id",
    id,
  );

  return id;
}

/**
 * All application state and API calls live here;
 * components only render.
 */
export function useCircuitMate() {
  /* document */

  const [material, setMaterial] =
    useState<DocumentInfo | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadPhase, setUploadPhase] =
    useState<UploadPhase>(null);

  const [uploadError, setUploadError] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* workspace */

  const [mode, setMode] =
    useState<StudyMode>("chat");

  const [subject, setSubject] =
    useState<string>(SUBJECTS[0]);

  const [sessionId, setSessionId] =
    useState<string>(getInitialSessionId);

  /* chat */

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [draft, setDraft] =
    useState("");

  const [loadingMode, setLoadingMode] =
    useState<ChatMode | null>(null);

  /* exam */

  const [exam, setExam] =
    useState<ExamState | null>(null);

  const [examPhase, setExamPhase] =
    useState<ExamPhase>(null);

  const [examError, setExamError] =
    useState("");

  const [examNumber, setExamNumber] =
    useState(1);

  const [examSettings, setExamSettings] =
    useState<ExamSettings>(
      DEFAULT_EXAM_SETTINGS,
    );

  const [settingsDirty, setSettingsDirty] =
    useState(false);

  /* ---------- persist session id ---------- */

  useEffect(() => {
    if (!sessionId) return;

    window.localStorage.setItem(
      "circuitmate_session_id",
      sessionId,
    );
  }, [sessionId]);

  /* ---------- restore session ---------- */

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await getChatHistory(
          sessionId,
        );

        if (cancelled) return;

        if (data.document) {
          const restoredSubject =
            data.document.subject || SUBJECTS[0];

          setMaterial({
            filename: data.document.filename,
            pages: data.document.pages,
            chunks: data.document.chunks,
            subject: restoredSubject,
          });

          setSubject(restoredSubject);
        }

        if (data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error(
          "Failed to restore CircuitMate session:",
          error,
        );
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  /* ---------- upload progress ---------- */

  useEffect(() => {
    if (!uploading) {
      setUploadPhase(null);
      return;
    }

    setUploadPhase("reading");

    const timer = setTimeout(() => {
      setUploadPhase("indexing");
    }, 1400);

    return () => clearTimeout(timer);
  }, [uploading]);

  /* ---------- file picker ---------- */

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /* ---------- upload ---------- */

  const handleFileChange = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      if (file.type !== "application/pdf") {
        setUploadError(
          "Please upload a PDF file.",
        );
        return;
      }

      setUploading(true);
      setUploadError("");

      try {
        /*
         * Every uploaded document gets a new session.
         */
        const nextSessionId = newId();

        const data = await uploadNotes(
          file,
          nextSessionId,
        );

        setSessionId(nextSessionId);

        /*
         * uploadNotes returns the document directly,
         * not inside data.document.
         */
        setMaterial({
          filename: data.filename,
          pages: data.pages,
          chunks: data.chunks,
          subject: data.subject || SUBJECTS[0],
        });

        setSubject(
          data.subject || SUBJECTS[0],
        );

        setMessages([]);
        setDraft("");
        setExam(null);
        setExamError("");
        setExamNumber(1);
        setSettingsDirty(false);
        setMode("chat");
      } catch (error) {
        setUploadError(
          error instanceof Error
            ? error.message
            : "Failed to upload the document.",
        );
      } finally {
        setUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [],
  );

  /* ---------- chat ---------- */

  const sendText = useCallback(
    async (raw: string) => {
      const question = raw.trim();

      if (
        !question ||
        loadingMode ||
        mode === "exam"
      ) {
        return;
      }

      const chatMode: ChatMode = mode;

      setMessages((current) => [
        ...current,
        {
          id: newId(),
          role: "user",
          content: question,
          mode: chatMode,
        },
      ]);

      setDraft("");
      setLoadingMode(chatMode);

      try {
        const data = await askNotes({
          message: question,
          mode: chatMode,
          subject,
          sessionId,
        });

        setMessages((current) => [
          ...current,
          {
            id: newId(),
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            mode: chatMode,
            fresh: true,
          },
        ]);
      } catch (error) {
        setMessages((current) => [
          ...current,
          {
            id: newId(),
            role: "assistant",
            content:
              error instanceof ApiError
                ? error.message
                : CONNECTION_ERROR,
            mode: chatMode,
            isError: true,
          },
        ]);
      } finally {
        setLoadingMode(null);
      }
    },
    [
      loadingMode,
      mode,
      subject,
      sessionId,
    ],
  );

  const send = useCallback(() => {
    void sendText(draft);
  }, [draft, sendText]);

  const markRevealed = useCallback(
    (id: string) => {
      setMessages((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                fresh: false,
              }
            : item,
        ),
      );
    },
    [],
  );

  /* ---------- exam ---------- */

  const startExam = useCallback(
    async (resetNumber = false) => {
      if (!material || examPhase) return;

      setMode("exam");
      setExamPhase("generating");
      setExamError("");
      setExam(null);

      if (resetNumber) {
        setExamNumber(1);
      }

      setSettingsDirty(false);

      try {
        const data = await requestExam(
          subject,
          examSettings,
        );

        setExam({
          question: data.question,
          sources: data.sources ?? [],
          answer: "",
          evaluation: "",
          settings: examSettings,
          subject,
        });
      } catch (error) {
        setExamError(
          error instanceof Error
            ? error.message
            : "Couldn't start Exam Mode.",
        );
      } finally {
        setExamPhase(null);
      }
    },
    [
      material,
      examPhase,
      subject,
      examSettings,
    ],
  );

  const submitExamAnswer = useCallback(
    async () => {
      if (
        !exam ||
        !exam.answer.trim() ||
        examPhase
      ) {
        return;
      }

      setExamPhase("evaluating");
      setExamError("");

      try {
        const data =
          await evaluateAnswer({
            question: exam.question,
            answer: exam.answer,
            subject: exam.subject,
            marks: exam.settings.marks,
          });

        setExam((current) =>
          current
            ? {
                ...current,
                evaluation: data.evaluation,
                sources:
                  data.sources ??
                  current.sources,
              }
            : current,
        );
      } catch (error) {
        setExamError(
          error instanceof Error
            ? error.message
            : "Couldn't evaluate your answer.",
        );
      } finally {
        setExamPhase(null);
      }
    },
    [exam, examPhase],
  );

  const nextQuestion = useCallback(
    async () => {
      setExamNumber(
        (current) => current + 1,
      );

      await startExam();
    },
    [startExam],
  );

  const updateSettings = useCallback(
    (patch: Partial<ExamSettings>) => {
      setExamSettings(
        (current) => ({
          ...current,
          ...patch,
        }),
      );

      setSettingsDirty(true);
    },
    [],
  );

  const setAnswer = useCallback(
    (value: string) => {
      setExam((current) =>
        current
          ? {
              ...current,
              answer: value,
            }
          : current,
      );
    },
    [],
  );

  /* ---------- navigation ---------- */

  const selectMode = useCallback(
    (next: StudyMode) => {
      setExamError("");

      if (next === "exam") {
        if (exam) {
          setMode("exam");
        } else {
          void startExam(true);
        }

        return;
      }

      setMode(next);
    },
    [exam, startExam],
  );

  const changeSubject = useCallback(
    (next: string) => {
      setSubject(next);

      if (exam) {
        setSettingsDirty(true);
      }
    },
    [exam],
  );

  /* ---------- controllers ---------- */

  const chat: ChatController = {
    messages,
    draft,
    setDraft,
    loadingMode,
    send,
    sendText: (text) =>
      void sendText(text),
    markRevealed,
  };

  const examController: ExamController = {
    exam,
    phase: examPhase,
    error: examError,
    number: examNumber,
    settings: examSettings,
    settingsDirty,
    updateSettings,
    setAnswer,
    generate: () =>
      void startExam(!exam),
    submit: () =>
      void submitExamAnswer(),
    next: () =>
      void nextQuestion(),
  };

  return {
    material,
    uploading,
    uploadPhase,
    uploadError,
    fileInputRef,
    openFilePicker,
    handleFileChange,
    mode,
    selectMode,
    subject,
    changeSubject,
    chat,
    exam: examController,
  };
}