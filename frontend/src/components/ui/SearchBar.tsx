import { Icon } from "@/components/ui/Icon";

interface SearchBarProps {
  valeur: string;
  onChange: (valeur: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  ariaLabel: string;
}

/** Barre de recherche du catalogue, contrôlée par la page parente. */
export function SearchBar({
  valeur,
  onChange,
  onSubmit,
  placeholder = "Chercher un composant…",
  ariaLabel,
}: SearchBarProps) {
  return (
    <form
      role="search"
      className="flex"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="search"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-[54px] flex-1 rounded-l-[10px] border-[1.5px] border-r-0 border-ligne bg-white px-[18px] text-base placeholder:text-encre-3"
      />
      <button
        type="submit"
        className="flex h-[54px] items-center gap-2 rounded-r-[10px] bg-cuivre px-[22px] text-[15px] font-semibold text-white hover:bg-cuivre-fonce"
      >
        <Icon name="loupe" className="h-[17px] w-[17px]" />
        Rechercher
      </button>
    </form>
  );
}
