/** Schéma technique : barrette de mémoire DDR5. */
export function RamIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'une barrette de mémoire"
    >
      <rect x="30" y="52" width="160" height="46" rx="5" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <g fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5">
        <rect x="44" y="64" width="13" height="24" rx="2" />
        <rect x="62" y="64" width="13" height="24" rx="2" />
        <rect x="80" y="64" width="13" height="24" rx="2" />
        <rect x="98" y="64" width="13" height="24" rx="2" />
        <rect x="116" y="64" width="13" height="24" rx="2" />
        <rect x="134" y="64" width="13" height="24" rx="2" />
        <rect x="152" y="64" width="13" height="24" rx="2" />
        <rect x="170" y="64" width="13" height="24" rx="2" />
      </g>
      <path d="M30 74 H42" stroke="#A94E22" strokeWidth="2.5" />
      <circle cx="32" cy="74" r="3" fill="#A94E22" />
      <rect x="181" y="66" width="6" height="18" rx="2" fill="#A94E22" />
    </svg>
  );
}
