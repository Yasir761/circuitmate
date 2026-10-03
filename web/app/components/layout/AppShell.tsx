import type { ReactNode } from "react";

export function AppShell({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F6F4] text-[#151817]">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-[#151817] px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div
        aria-hidden="true"
        className="cm-grid pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col">
        {header}

        <main id="main" className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
