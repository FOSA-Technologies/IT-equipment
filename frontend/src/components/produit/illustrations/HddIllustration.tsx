/** Schéma technique : disque dur 3,5 pouces. */
export function HddIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un disque dur"
    >
      <rect
        x="40"
        y="18"
        width="140"
        height="104"
        rx="10"
        fill="#fff"
        stroke="var(--color-encre)"
        strokeWidth="2.5"
      />
      <circle
        cx="72"
        cy="52"
        r="20"
        fill="none"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <circle
        cx="72"
        cy="52"
        r="6"
        fill="var(--color-illu)"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <rect
        x="60"
        y="88"
        width="100"
        height="22"
        rx="3"
        fill="var(--color-illu)"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <rect x="66" y="94" width="64" height="3" fill="var(--color-encre-3)" />
      <rect x="66" y="101" width="42" height="3" fill="var(--color-encre-3)" />
      <g fill="none" stroke="var(--color-encre)" strokeWidth="1.5">
        <circle cx="48" cy="26" r="2.5" />
        <circle cx="172" cy="26" r="2.5" />
        <circle cx="48" cy="114" r="2.5" />
        <circle cx="172" cy="114" r="2.5" />
      </g>
      <rect x="132" y="58" width="6" height="6" fill="var(--color-cuivre)" />
      <path d="M138 61 H172" stroke="var(--color-cuivre)" strokeWidth="2" />
    </svg>
  );
}
