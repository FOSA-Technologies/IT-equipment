/** Schéma technique : disque dur 3,5 pouces. */
export function HddIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un disque dur"
    >
      <rect x="40" y="18" width="140" height="104" rx="10" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <circle cx="72" cy="52" r="20" fill="none" stroke="#22262E" strokeWidth="1.5" />
      <circle cx="72" cy="52" r="6" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <rect x="60" y="88" width="100" height="22" rx="3" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <rect x="66" y="94" width="64" height="3" fill="#7A8190" />
      <rect x="66" y="101" width="42" height="3" fill="#7A8190" />
      <g fill="none" stroke="#22262E" strokeWidth="1.5">
        <circle cx="48" cy="26" r="2.5" />
        <circle cx="172" cy="26" r="2.5" />
        <circle cx="48" cy="114" r="2.5" />
        <circle cx="172" cy="114" r="2.5" />
      </g>
      <rect x="132" y="58" width="6" height="6" fill="#A94E22" />
      <path d="M138 61 H172" stroke="#A94E22" strokeWidth="2" />
    </svg>
  );
}
