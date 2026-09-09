import { BoutonLien } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Panier vide : invitation à parcourir le catalogue. */
export function CartEmpty() {
  return (
    <EmptyState
      titre="Votre panier est vide"
      texte="Parcourez le catalogue pour trouver le composant qu'il vous faut."
    >
      <BoutonLien to="/boutique" variant="cuivre">
        Parcourir le catalogue
      </BoutonLien>
    </EmptyState>
  );
}
