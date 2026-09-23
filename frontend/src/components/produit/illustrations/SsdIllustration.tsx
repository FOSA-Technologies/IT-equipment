/** Schéma technique : SSD NVMe au format M.2. */
export function SsdIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'un SSD NVMe"
    >
      <rect x="92" y="14" width="42" height="104" rx="4" fill="#fff" stroke="var(--color-encre)" strokeWidth="2.5" />
      <rect x="92" y="118" width="42" height="16" rx="2" fill="var(--color-cuivre-clair)" stroke="var(--color-encre)" strokeWidth="2" />
      <g fill="var(--color-illu)" stroke="var(--color-encre)" strokeWidth="1.5">
        <rect x="97" y="22" width="32" height="26" rx="3" />
        <rect x="97" y="56" width="32" height="26" rx="3" />
        <rect x="97" y="90" width="32" height="20" rx="3" />
      </g>
      <circle cx="113" cy="51" r="2.5" fill="var(--color-cuivre)" />
      <path d="M113 48 V46" stroke="var(--color-cuivre)" strokeWidth="2" />
      <rect x="99" y="97" width="28" height="3" fill="var(--color-encre-3)" />
      <rect x="99" y="103" width="18" height="3" fill="var(--color-encre-3)" />
    </svg>
  );
}
