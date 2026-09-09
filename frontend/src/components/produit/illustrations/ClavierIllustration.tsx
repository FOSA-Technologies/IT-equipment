/** Schéma technique : clavier mécanique TKL. */
export function ClavierIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un clavier mécanique"
    >
      <defs>
        <pattern id="p-clav" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="11" height="11" rx="2" fill="#F0F2F5" stroke="#22262E" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="25" y="34" width="170" height="82" rx="8" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <rect x="33" y="42" width="154" height="66" rx="3" fill="url(#p-clav)" />
      <rect x="62" y="98" width="96" height="8" rx="2" fill="#F0F2F5" stroke="#22262E" strokeWidth="1" />
      <rect x="33" y="42" width="11" height="11" rx="2" fill="#A94E22" stroke="#22262E" strokeWidth="1" />
      <path d="M195 92 C206 92 206 112 197 114" fill="none" stroke="#22262E" strokeWidth="2" />
    </svg>
  );
}
