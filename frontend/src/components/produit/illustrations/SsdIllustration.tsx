/** Schéma technique : SSD NVMe au format M.2. */
export function SsdIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un SSD NVMe"
    >
      <rect x="92" y="14" width="42" height="104" rx="4" fill="#fff" stroke="#22262E" strokeWidth="2.5" />
      <rect x="92" y="118" width="42" height="16" rx="2" fill="#E9CFC0" stroke="#22262E" strokeWidth="2" />
      <g fill="#F0F2F5" stroke="#22262E" strokeWidth="1.5">
        <rect x="97" y="22" width="32" height="26" rx="3" />
        <rect x="97" y="56" width="32" height="26" rx="3" />
        <rect x="97" y="90" width="32" height="20" rx="3" />
      </g>
      <circle cx="113" cy="51" r="2.5" fill="#A94E22" />
      <path d="M113 48 V46" stroke="#A94E22" strokeWidth="2" />
      <rect x="99" y="97" width="28" height="3" fill="#7A8190" />
      <rect x="99" y="103" width="18" height="3" fill="#7A8190" />
    </svg>
  );
}
