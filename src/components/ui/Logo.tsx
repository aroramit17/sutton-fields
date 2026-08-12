// The Sutton Fields printer's mark: signal-accent badge, double editorial
// rule, serif SF monogram over field-furrow rules. Keep in sync with
// src/app/icon.svg (the favicon), which is the same drawing.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#b3410e" />
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="10"
        fill="none"
        stroke="#faf8f4"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <rect
        x="7.5"
        y="7.5"
        width="49"
        height="49"
        rx="7"
        fill="none"
        stroke="#faf8f4"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <text
        x="32"
        y="41.5"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="27"
        fontWeight="bold"
        letterSpacing="0.5"
        textAnchor="middle"
        fill="#faf8f4"
      >
        SF
      </text>
      <path
        d="M16 49.5 H48"
        stroke="#faf8f4"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M21 53.5 H43"
        stroke="#faf8f4"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
