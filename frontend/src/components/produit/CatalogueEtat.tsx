import { Bouton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCatalogueStore } from "@/store/catalogueStore";

interface CatalogueEtatProps {
  /** Sans conteneur : à utiliser quand le parent gère déjà la largeur. */
  integre?: boolean;
}

/** État d'attente ou d'échec du chargement du catalogue (avec « Réessayer »). */
export function CatalogueEtat({ integre = false }: CatalogueEtatProps) {
  const statut = useCatalogueStore((s) => s.statut);
  const erreur = useCatalogueStore((s) => s.erreur);
  const charger = useCatalogueStore((s) => s.charger);

  const contenu =
    statut === "erreur" ? (
      <EmptyState
        titre="Catalogue indisponible"
        texte={erreur ?? "Impossible de charger le catalogue."}
      >
        <Bouton onClick={() => void charger()}>Réessayer</Bouton>
      </EmptyState>
    ) : (
      <EmptyState titre="Chargement du catalogue…" texte="Un instant." />
    );

  if (integre) return contenu;
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6">{contenu}</div>
  );
}
