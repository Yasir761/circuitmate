"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Progressive reveal for responses that arrive complete. If true streaming is
 * added later, feed the streamed buffer in as `text` and set enabled=false
 * once the stream ends; consumers do not need to change.
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
  onDone?: () => void,
) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setCount(text.length);
      onDoneRef.current?.();
      return;
    }

    const duration = Math.min(2600, Math.max(500, text.length * 6));
    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / duration);
      setCount(Math.ceil(progress * text.length));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onDoneRef.current?.();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, enabled]);

  return { shown: text.slice(0, count), done: count >= text.length };
}
