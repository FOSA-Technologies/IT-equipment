/** Schéma technique : souris sans fil. */
export function SourisIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'une souris"
    >
      <path
        d="M110 30 C88 30 78 46 78 78 C78 112 92 126 110 126 C128 126 142 112 142 78 C142 46 132 30 110 30 Z"
        fill="#fff"
        stroke="#22262E"
        strokeWidth="2.5"
      />
      <path d="M110 30 V62" fill="none" stroke="#22262E" strokeWidth="2" />
      <rect x="103" y="58" width="14" height="20" rx="4" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <path d="M110 126 V146" fill="none" stroke="#22262E" strokeWidth="2" />
      <circle cx="110" cy="90" r="3" fill="#A94E22" />
    </svg>
  );
}
