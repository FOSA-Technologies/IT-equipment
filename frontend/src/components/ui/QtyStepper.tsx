import { Icon } from "@/components/ui/Icon";

interface QtyStepperProps {
  quantite: number;
  onIncrementer: () => void;
  onDecrementer: () => void;
  ariaLabel?: string;
}

/** Sélecteur de quantité avec boutons − / +. */
export function QtyStepper({
  quantite,
  onIncrementer,
  onDecrementer,
  ariaLabel = "Quantité",
}: QtyStepperProps) {
  return (
    <div
      className="inline-flex items-center rounded-lg border-[1.5px] border-ligne bg-white"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={onDecrementer}
        aria-label="Diminuer la quantité"
        className="flex h-8 w-8 items-center justify-center text-encre-2 hover:text-cuivre"
      >
        <Icon name="moins" className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[26px] text-center font-mono text-sm">
        {quantite}
      </span>
      <button
        type="button"
        onClick={onIncrementer}
        aria-label="Augmenter la quantité"
        className="flex h-8 w-8 items-center justify-center text-encre-2 hover:text-cuivre"
      >
        <Icon name="plus" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
