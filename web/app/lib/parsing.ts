// import type { AnswerSection, ParsedEvaluation } from "../types";

// export function cleanResponseText(text: string): string {
//   return text
//     .replace(/\r/g, "")
//     .replace(/\*\*(.+?)\*\*/g, "$1")
//     .replace(/__(.+?)__/g, "$1")
//     .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$|[.,;:!?])/g, "$1$2")
//     .replace(/(^|\s)_([^_\n]+)_(?=\s|$|[.,;:!?])/g, "$1$2")
//     .replace(/`([^`\n]+)`/g, "$1")
//     .replace(/^#{1,6}\s+/gm, "")
//     .replace(/\\\[|\\\]/g, "")
//     .replace(/\$\$/g, "")
//     .replace(/\\([-*•])/g, "$1")
//     .replace(/\n{3,}/g, "\n\n")
//     .trim();
// }

// export function parseSections(
//   answer: string,
//   headings: readonly string[],
// ): AnswerSection[] {
//   const cleaned = cleanResponseText(answer);

//   const found = headings
//     .map((heading) => ({ heading, index: cleaned.indexOf(heading) }))
//     .filter((item) => item.index !== -1)
//     .sort((a, b) => a.index - b.index);

//   return found
//     .map((item, position) => {
//       const start = item.index + item.heading.length;
//       const end =
//         position + 1 < found.length
//           ? found[position + 1].index
//           : cleaned.length;

//       return {
//         title: item.heading.replace(/:$/, ""),
//         content: cleaned.slice(start, end).trim(),
//       };
//     })
//     .filter((section) => section.content.length > 0);
// }

// export function isStructuredSolution(answer: string): boolean {
//   return (
//     answer.includes("PROBLEM:") &&
//     answer.includes("GIVEN:") &&
//     answer.includes("APPROACH:") &&
//     answer.includes("SOLUTION:")
//   );
// }

// export type ContentBlock = {
//   type: "text" | "equation";
//   text: string;
// };

// function looksLikeEquation(line: string): boolean {
//   const trimmed = line.trim();

//   if (trimmed.length < 3 || trimmed.length > 120 || !trimmed.includes("=")) {
//     return false;
//   }

//   const words = trimmed.match(/[A-Za-z]{4,}/g) ?? [];
//   return words.length <= 2;
// }

// export function splitContentBlocks(text: string): ContentBlock[] {
//   const blocks: ContentBlock[] = [];
//   let buffer: string[] = [];

//   const cleanedText = cleanResponseText(text);

//   const flush = () => {
//     const joined = buffer.join("\n").trim();
//     if (joined) blocks.push({ type: "text", text: joined });
//     buffer = [];
//   };

//   for (const line of cleanedText.split("\n")) {
//     if (looksLikeEquation(line)) {
//       flush();

//       const last = blocks[blocks.length - 1];

//       if (last && last.type === "equation") {
//         last.text += `\n${line.trim()}`;
//       } else {
//         blocks.push({ type: "equation", text: line.trim() });
//       }
//     } else {
//       buffer.push(line);
//     }
//   }

//   flush();
//   return blocks;
// }

// export function isUngrounded(content: string): boolean {
//   return /couldn['’]?t find enough (?:relevant )?information/i.test(content);
// }

// type SectionKey = "right" | "improve" | "model";

// const HEADINGS: { key: SectionKey; pattern: RegExp }[] = [
//   {
//     key: "right",
//     pattern:
//       /^(what you got right|you got right|what was right|strengths?|correct points?)\b/i,
//   },
//   {
//     key: "improve",
//     pattern:
//       /^(what to improve|to improve|areas? (?:for|to) improve(?:ment)?|improvements?|what was missing|missing points?)\b/i,
//   },
//   {
//     key: "model",
//     pattern:
//       /^(model answer|ideal answer|sample answer|reference answer)\b/i,
//   },
// ];

// const BULLET = /^(?:[-•*]|\d+[.)])\s+/;

// export function parseEvaluation(raw: string): ParsedEvaluation {
//   const text = cleanResponseText(raw);

//   const result: ParsedEvaluation = {
//     score: null,
//     right: [],
//     improve: [],
//     modelAnswer: "",
//     raw: text,
//   };

//   const scoreMatch =
//     text.match(
//       /score\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:\/|out of)\s*\d+/i,
//     ) ??
//     text.match(/\b(\d+(?:\.\d+)?)\s*\/\s*(?:2|5|10)\b/);

//   if (scoreMatch) result.score = Number(scoreMatch[1]);

//   let current: SectionKey | null = null;
//   const modelLines: string[] = [];

//   const push = (key: SectionKey, line: string) => {
//     if (key === "model") {
//       modelLines.push(line);
//       return;
//     }

//     const item = line.trim().replace(BULLET, "").trim();
//     if (item) result[key].push(item);
//   };

//   for (const line of text.split("\n")) {
//     const probe = line.trim().replace(/^[#>\-•*\s]+/, "");
//     const heading = HEADINGS.find((item) => item.pattern.test(probe));

//     if (heading) {
//       current = heading.key;

//       const match = probe.match(heading.pattern);
//       const remainder = probe
//         .slice(match ? match[0].length : 0)
//         .replace(/^[\s:–\-]+/, "");

//       if (remainder) push(current, remainder);
//       continue;
//     }

//     if (/^score\b/i.test(probe)) continue;
//     if (current) push(current, line.replace(/\s+$/, ""));
//   }

//   result.modelAnswer = modelLines.join("\n").trim();
//   return result;
// }

// export function getScoreLabel(score: number | null, marks: number): string {
//   if (score === null) return "Answer evaluated";

//   const ratio = score / marks;
//   if (ratio >= 0.85) return "Excellent work";
//   if (ratio >= 0.65) return "Good work";
//   if (ratio >= 0.4) return "Partly there";
//   return "Needs more work";
// }




import type { AnswerSection, ParsedEvaluation } from "../types";

/**
 * Normalize model output before rendering.
 *
 * The backend may return Markdown/LaTeX-style escaping even though
 * CircuitMate renders its own technical formatting.
 */
export function cleanResponseText(text: string): string {
  return text
    .replace(/\r/g, "")

    // Markdown emphasis
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(
      /(^|\s)\*([^*\n]+)\*(?=\s|$|[.,;:!?])/g,
      "$1$2",
    )
    .replace(
      /(^|\s)_([^_\n]+)_(?=\s|$|[.,;:!?])/g,
      "$1$2",
    )

    // Inline code
    .replace(/`([^`\n]+)`/g, "$1")

    // Headings
    .replace(/^#{1,6}\s+/gm, "")

    // LaTeX delimiters
    .replace(/\\\[|\\\]/g, "")
    .replace(/\$\$/g, "")

    // Common escaped characters emitted by the model
    .replace(/\\([\-*•])/g, "$1")
    .replace(/\\([{}])/g, "$1")

    // Keep LaTeX subscripts readable:
    // R\_{th} -> R_{th}
    .replace(/\\_/g, "_")

    // Remove an answer-level SOURCES section.
    // Sources are rendered separately by SourceReferences.
    .replace(
      /\n*\bSOURCES?\s*:?\s*\n(?:\s*[-•*]\s*Page\s+\d+\s*\n?)+\s*$/i,
      "",
    )

    // Clean excessive whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ---------- Sectioned answers (solve / explain) ---------- */

export function parseSections(
  answer: string,
  headings: readonly string[],
): AnswerSection[] {
  const cleaned = cleanResponseText(answer);

  const found = headings
    .map((heading) => ({
      heading,
      index: cleaned.indexOf(heading),
    }))
    .filter((item) => item.index !== -1)
    .sort((a, b) => a.index - b.index);

  return found
    .map((item, position) => {
      const start = item.index + item.heading.length;
      const end =
        position + 1 < found.length
          ? found[position + 1].index
          : cleaned.length;

      return {
        title: item.heading.replace(/:$/, ""),
        content: cleaned.slice(start, end).trim(),
      };
    })
    .filter((section) => section.content.length > 0);
}

export function isStructuredSolution(answer: string): boolean {
  return (
    answer.includes("PROBLEM:") &&
    answer.includes("GIVEN:") &&
    answer.includes("APPROACH:") &&
    answer.includes("SOLUTION:")
  );
}

/* ---------- Equation-aware text ---------- */

export type ContentBlock = {
  type: "text" | "equation";
  text: string;
};

function looksLikeEquation(line: string): boolean {
  const trimmed = line.trim();

  if (
    trimmed.length < 3 ||
    trimmed.length > 120 ||
    !trimmed.includes("=")
  ) {
    return false;
  }

  const words = trimmed.match(/[A-Za-z]{4,}/g) ?? [];

  return words.length <= 2;
}

export function splitContentBlocks(text: string): ContentBlock[] {
  const cleaned = cleanResponseText(text);
  const blocks: ContentBlock[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const joined = buffer.join("\n").trim();

    if (joined) {
      blocks.push({
        type: "text",
        text: joined,
      });
    }

    buffer = [];
  };

  for (const line of cleaned.split("\n")) {
    if (looksLikeEquation(line)) {
      flush();

      const last = blocks[blocks.length - 1];

      if (last && last.type === "equation") {
        last.text += `\n${line.trim()}`;
      } else {
        blocks.push({
          type: "equation",
          text: line.trim(),
        });
      }
    } else {
      buffer.push(line);
    }
  }

  flush();

  return blocks;
}

/* ---------- Grounding ---------- */

export function isUngrounded(content: string): boolean {
  return /couldn['’]?t find enough(?: relevant)? information/i.test(
    content,
  );
}

/* ---------- Exam evaluation ---------- */

type SectionKey = "right" | "improve" | "model";

const HEADINGS: {
  key: SectionKey;
  pattern: RegExp;
}[] = [
  {
    key: "right",
    pattern:
      /^(what you got right|you got right|what was right|strengths?|correct points?)\b/i,
  },
  {
    key: "improve",
    pattern:
      /^(what to improve|to improve|areas? (?:for|to) improve(?:ment)?|improvements?|what was missing|missing points?)\b/i,
  },
  {
    key: "model",
    pattern:
      /^(model answer|ideal answer|sample answer|reference answer)\b/i,
  },
];

const BULLET = /^(?:[-•*]|\d+[.)])\s+/;

export function parseEvaluation(
  raw: string,
): ParsedEvaluation {
  const text = cleanResponseText(raw);

  const result: ParsedEvaluation = {
    score: null,
    right: [],
    improve: [],
    modelAnswer: "",
    raw: text,
  };

  const scoreMatch =
    text.match(
      /score\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:\/|out of)\s*\d+/i,
    ) ??
    text.match(/\b(\d+(?:\.\d+)?)\s*\/\s*(?:2|5|10)\b/);

  if (scoreMatch) {
    result.score = Number(scoreMatch[1]);
  }

  let current: SectionKey | null = null;
  const modelLines: string[] = [];

  const push = (
    key: SectionKey,
    line: string,
  ) => {
    if (key === "model") {
      modelLines.push(line);
      return;
    }

    const item = line
      .trim()
      .replace(BULLET, "")
      .trim();

    if (item) {
      result[key].push(item);
    }
  };

  for (const line of text.split("\n")) {
    const probe = line
      .trim()
      .replace(/^[#>\-•*\s]+/, "");

    const heading = HEADINGS.find((item) =>
      item.pattern.test(probe),
    );

    if (heading) {
      current = heading.key;

      const match = probe.match(heading.pattern);

      const remainder = probe
        .slice(match ? match[0].length : 0)
        .replace(/^[\s:–\-]+/, "");

      if (remainder) {
        push(current, remainder);
      }

      continue;
    }

    if (/^score\b/i.test(probe)) {
      continue;
    }

    if (/^sources?\s*:?\s*$/i.test(probe)) {
      current = null;
      continue;
    }

    if (current) {
      push(
        current,
        line.replace(/\s+$/, ""),
      );
    }
  }

  result.modelAnswer = modelLines.join("\n").trim();

  return result;
}

export function getScoreLabel(
  score: number | null,
  marks: number,
): string {
  if (score === null) {
    return "Answer evaluated";
  }

  const ratio = score / marks;

  if (ratio >= 0.85) {
    return "Excellent work";
  }

  if (ratio >= 0.65) {
    return "Good work";
  }

  if (ratio >= 0.4) {
    return "Partly there";
  }

  return "Needs more work";
}