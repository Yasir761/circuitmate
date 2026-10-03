export type Source = {
  page: number;
  score: number;
};

export type ChatMode = "chat" | "explain" | "solve";
export type StudyMode = ChatMode | "exam";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** The study mode this message belongs to. Each mode keeps its own thread. */
  mode: ChatMode;
  sources?: Source[];
  /** True until the progressive reveal has finished. */
  fresh?: boolean;
  isError?: boolean;
};

export type DocumentInfo = {
  subject: string;
  filename: string;
  pages: number;
  chunks: number;
};

export type Difficulty = "easy" | "medium" | "hard";
export type Marks = 2 | 5 | 10;
export type QuestionType = "theory" | "numerical" | "conceptual" | "mixed";

export type ExamSettings = {
  difficulty: Difficulty;
  marks: Marks;
  questionType: QuestionType;
};

export type ExamState = {
  question: string;
  sources: Source[];
  answer: string;
  evaluation: string;
  /** Settings the question was generated with (not the live controls). */
  settings: ExamSettings;
  /** Subject the question was generated for. */
  subject: string;
};

export type ExamPhase = "generating" | "evaluating" | null;
export type UploadPhase = "reading" | "indexing" | null;

export type AnswerSection = {
  title: string;
  content: string;
};

export type ParsedEvaluation = {
  score: number | null;
  right: string[];
  improve: string[];
  modelAnswer: string;
  raw: string;
};

export type ChatController = {
  messages: Message[];
  draft: string;
  setDraft: (value: string) => void;
  loadingMode: ChatMode | null;
  send: () => void;
  sendText: (text: string) => void;
  markRevealed: (id: string) => void;
};

export type ExamController = {
  exam: ExamState | null;
  phase: ExamPhase;
  error: string;
  number: number;
  settings: ExamSettings;
  settingsDirty: boolean;
  updateSettings: (patch: Partial<ExamSettings>) => void;
  setAnswer: (value: string) => void;
  generate: () => void;
  submit: () => void;
  next: () => void;
};