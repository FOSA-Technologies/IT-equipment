/** Schéma technique : SSD SATA au format 2,5 pouces. */
export function SsdSataIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un SSD SATA"
    >
      <rect x="60" y="38" width="100" height="70" rx="8" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <rect x="72" y="48" width="76" height="26" rx="3" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <rect x="72" y="84" width="76" height="14" rx="2" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <rect x="78" y="89" width="48" height="3" fill="#7A8190" />
      <g fill="none" stroke="#22262E" strokeWidth="1.5">
        <circle cx="66" cy="44" r="2" />
        <circle cx="154" cy="44" r="2" />
        <circle cx="66" cy="102" r="2" />
      </g>
      <circle cx="150" cy="98" r="3" fill="#A94E22" />
    </svg>
  );
}
