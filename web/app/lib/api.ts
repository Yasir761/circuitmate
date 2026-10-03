import { API_URL } from "./constant";
import type {
  ChatMode,
  DocumentInfo,
  ExamSettings,
  Marks,
  Message,
  Source,
} from "../types";


export class ApiError extends Error {}


async function request<T>(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    /* non-JSON body */
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof (data as { detail: unknown }).detail === "string"
        ? (data as { detail: string }).detail
        : fallbackMessage;

    throw new ApiError(detail);
  }

  return data as T;
}


const JSON_HEADERS = {
  "Content-Type": "application/json",
};


export function uploadNotes(
  file: File,
  sessionId: string,
): Promise<DocumentInfo> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("session_id", sessionId);

  return request<DocumentInfo>(
    "/api/documents/upload",
    {
      method: "POST",
      body: formData,
    },
    "Failed to upload the document.",
  );
}


export function askNotes(payload: {
  message: string;
  mode: ChatMode;
  subject: string;
  sessionId: string;
}): Promise<{
  answer: string;
  sources?: Source[];
}> {
  return request(
    "/api/chat",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        message: payload.message,
        mode: payload.mode,
        subject: payload.subject,
        session_id: payload.sessionId,
      }),
    },
    "Failed to get a response.",
  );
}


export function getChatHistory(
  sessionId: string,
): Promise<{
  document: DocumentInfo | null;
  messages: Message[];
}> {
  return request(
    `/api/chat/history/${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
    },
    "Failed to restore your study session.",
  );
}


export function startExam(
  subject: string,
  settings: ExamSettings,
): Promise<{
  question: string;
  sources?: Source[];
}> {
  return request(
    "/api/exam/start",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        subject,
        difficulty: settings.difficulty,
        marks: settings.marks,
        question_type: settings.questionType,
      }),
    },
    "Failed to start Exam Mode.",
  );
}


export function evaluateAnswer(payload: {
  question: string;
  answer: string;
  subject: string;
  marks: Marks;
}): Promise<{
  evaluation: string;
  sources?: Source[];
}> {
  return request(
    "/api/exam/answer",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    },
    "Failed to evaluate the answer.",
  );
}