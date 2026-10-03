/**
 * A C-shaped trace with two terminals and a branch node.
 * Strokes use currentColor; the branch node carries the blue accent.
 */
export function CircuitMateMark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M17 6.5H10.5A4.5 4.5 0 0 0 6 11v2a4.5 4.5 0 0 0 4.5 4.5H17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12h6.5"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="6.5" r="2" fill="currentColor" />
      <circle
        cx="17"
        cy="17.5"
        r="2"
        fill="#F5F6F4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="14.5" cy="12" r="1.9" fill="#2563EB" />
    </svg>
  );
}
