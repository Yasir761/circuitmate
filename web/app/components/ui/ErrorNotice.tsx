import type { ReactNode } from "react";

export function ErrorNotice({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 ${className}`}
    >
      {children}
    </div>
  );
}
