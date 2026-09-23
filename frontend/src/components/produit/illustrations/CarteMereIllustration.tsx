/** Schéma technique : carte mère ATX. */
export function CarteMereIllustration() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-auto w-full"
      role="img"
      aria-label="Schéma d'une carte mère"
    >
      <rect
        x="35"
        y="14"
        width="150"
        height="122"
        rx="6"
        fill="#fff"
        stroke="var(--color-encre)"
        strokeWidth="2.5"
      />
      <rect
        x="150"
        y="20"
        width="26"
        height="90"
        rx="3"
        fill="var(--color-illu)"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <rect
        x="75"
        y="30"
        width="34"
        height="34"
        rx="3"
        fill="var(--color-illu)"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <rect
        x="83"
        y="38"
        width="18"
        height="18"
        rx="2"
        fill="var(--color-cuivre-clair)"
        stroke="var(--color-encre)"
        strokeWidth="1.5"
      />
      <g fill="var(--color-illu)" stroke="var(--color-encre)" strokeWidth="1.5">
        <rect x="45" y="80" width="80" height="10" rx="2" />
        <rect x="45" y="96" width="80" height="10" rx="2" />
        <rect x="45" y="112" width="80" height="10" rx="2" />
      </g>
      <path
        d="M109 47 H146"
        fill="none"
        stroke="var(--color-cuivre)"
        strokeWidth="1.5"
      />
      <circle cx="148" cy="47" r="2.5" fill="var(--color-cuivre)" />
      <path
        d="M109 60 H132 V78"
        fill="none"
        stroke="var(--color-cuivre)"
        strokeWidth="1.5"
      />
      <circle cx="132" cy="80" r="2.5" fill="var(--color-cuivre)" />
    </svg>
  );
}
