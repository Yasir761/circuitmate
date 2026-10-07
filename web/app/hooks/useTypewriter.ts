"use client";

import { useEffect, useRef, useState } from "react";

export function useTypewriter(
  text: string,
  enabled: boolean,
  onDone?: () => void,
) {
  const [progress, setProgress] = useState({
    text: "",
    count: 0,
  });

  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!enabled) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const frame = requestAnimationFrame(() => {
        setProgress({
          text,
          count: text.length,
        });

        onDoneRef.current?.();
      });

      return () => cancelAnimationFrame(frame);
    }

    const duration = Math.min(2600, Math.max(500, text.length * 6));

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;

      const progressValue = Math.min(
        1,
        (now - start) / duration,
      );

      setProgress({
        text,
        count: Math.ceil(progressValue * text.length),
      });

      if (progressValue < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onDoneRef.current?.();
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [text, enabled]);

  const count = progress.text === text ? progress.count : 0;

  return {
    shown: enabled ? text.slice(0, count) : text,
    done: !enabled || count >= text.length,
  };
}