"use client";

import { useEffect, useRef } from "react";
import { CHAT_LOADING_LABEL } from "../../lib/constant";
import { CircuitMateMark } from "../brand/CircuitMateMark";
import { LoadingState } from "../ui/LoadingState";
import { MessageBubble } from "./MessageBubble";
import type { ChatMode, Message } from "../../types";

export function MessageList({
  messages,
  mode,
  loadingMode,
  onRevealed,
}: {
  messages: Message[];
  mode: ChatMode;
  loadingMode: ChatMode | null;
  onRevealed: (id: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const showLoading = loadingMode === mode;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, showLoading]);

  return (
    <div className="space-y-8 pb-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRevealed={onRevealed}
        />
      ))}

      {showLoading && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CircuitMateMark size={18} className="text-[#151817]" />
            <span className="cm-mono text-[10px] uppercase tracking-[0.14em] text-[#6B716D]">
              CircuitMate
            </span>
          </div>
          <LoadingState label={CHAT_LOADING_LABEL[mode]} />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
