/** Schéma technique : alimentation ATX. */
export function AlimIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'une alimentation"
    >
      <rect x="50" y="30" width="120" height="84" rx="8" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <circle cx="110" cy="72" r="26" fill="#F0F2F5" stroke="#22262E" strokeWidth="2" />
      <g stroke="#7A8190" strokeWidth="1.5">
        <path d="M110 72 V46" />
        <path d="M110 72 V98" />
        <path d="M110 72 H84" />
        <path d="M110 72 H136" />
        <path d="M150 42 v60" />
        <path d="M158 42 v60" />
        <path d="M166 42 v60" />
      </g>
      <rect x="58" y="102" width="40" height="6" rx="2" fill="#A94E22" />
      <g fill="none" stroke="#22262E" strokeWidth="1.5">
        <circle cx="58" cy="38" r="2.5" />
        <circle cx="162" cy="38" r="2.5" />
        <circle cx="58" cy="106" r="2.5" />
        <circle cx="162" cy="106" r="2.5" />
      </g>
    </svg>
  );
}
