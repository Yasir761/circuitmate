import type { ChatMode, StudyMode } from "../types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const SUBJECTS = [
  "Network Theory",
  "Analog Electronics",
  "Digital Electronics",
  "Signals & Systems",
  "Communication Systems",
  "Electromagnetics",
  "Microprocessors",
  "Other ECE",
] as const;

export const MODE_ORDER: StudyMode[] = ["chat", "explain", "solve", "exam"];

type ModeMeta = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
};

export const MODE_META: Record<ChatMode, ModeMeta> = {
  chat: {
    label: "Ask my notes",
    eyebrow: "Ask my notes",
    title: "Ask questions about your ECE material.",
    description:
      "Find answers inside your own notes. Each answer lists the pages it was drawn from.",
    placeholder: "Ask something about your notes...",
  },
  explain: {
    label: "Explain concept",
    eyebrow: "Explain concept",
    title: "Turn difficult concepts into clear explanations.",
    description:
      "Get the concept, the intuition, the equation and an exam note, based on your notes.",
    placeholder: "e.g. Explain maximum power transfer simply...",
  },
  solve: {
    label: "Solve problem",
    eyebrow: "Solve problem",
    title: "Work through a problem step by step.",
    description:
      "Paste a problem. You get the given values, approach, solution and result as separate steps.",
    placeholder: "e.g. Solve this using mesh analysis...",
  },
};

export const TAB_LABELS: Record<StudyMode, string> = {
  chat: MODE_META.chat.label,
  explain: MODE_META.explain.label,
  solve: MODE_META.solve.label,
  exam: "Exam simulator",
};

export const CHAT_LOADING_LABEL: Record<ChatMode, string> = {
  chat: "Searching your notes...",
  explain: "Finding the concept in your notes...",
  solve: "Working through the problem...",
};

export const ASK_SUGGESTIONS = [
  "What is maximum power transfer?",
  "Explain the condition for resonance.",
  "What is the difference between mesh and nodal analysis?",
];

export const EXPLAIN_SUGGESTIONS = [
  "Explain resonance simply",
  "Explain Thevenin's theorem",
  "Explain coefficient of coupling",
];

export const SOLVE_EXAMPLES = [
  "Find the load resistance for maximum power transfer in this network, and the power delivered.",
  "Find the resonant frequency and Q factor of a series RLC circuit with R = 10 ohm, L = 10 mH, C = 1 uF.",
];

export const SOLUTION_HEADINGS = [
  "PROBLEM:",
  "GIVEN:",
  "APPROACH:",
  "SOLUTION:",
  "RESULT:",
  "EXAM NOTE:",
  "SOURCES:",
] as const;

export const EXPLAIN_HEADINGS = [
  "CONCEPT:",
  "INTUITION:",
  "EQUATION:",
  "EXAMPLE:",
  "EXAM NOTE:",
] as const;
