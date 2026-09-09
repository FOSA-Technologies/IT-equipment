/** Schéma technique : écran 27 pouces. */
export function EcranIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un écran"
    >
      <rect x="35" y="16" width="150" height="92" rx="6" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <rect x="43" y="24" width="134" height="76" rx="2" fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5" />
      <rect x="104" y="108" width="12" height="16" fill="#fff" stroke="#22262E" strokeWidth="2" />
      <path d="M86 134 h48 l-10 -10 h-28 z" fill="#fff" stroke="#22262E" strokeWidth="2" />
      <circle cx="53" cy="104" r="3" fill="#A94E22" />
    </svg>
  );
}
