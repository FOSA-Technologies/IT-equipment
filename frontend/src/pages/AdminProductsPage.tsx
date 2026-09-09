import { useState } from "react";

import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Bouton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCatalogueStore } from "@/store/catalogueStore";
import { useUiStore } from "@/store/uiStore";
import type { Produit, SaisieProduit } from "@/types";

/** Gestion des produits : recherche, ajout, modification, suppression. */
export function AdminProductsPage() {
  const produits = useCatalogueStore((s) => s.produits);
  const ajouterProduit = useCatalogueStore((s) => s.ajouterProduit);
  const modifierProduit = useCatalogueStore((s) => s.modifierProduit);
  const supprimerProduit = useCatalogueStore((s) => s.supprimerProduit);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const [recherche, setRecherche] = useState("");
  const [formOuvert, setFormOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);
  const [produitASupprimer, setProduitASupprimer] = useState<Produit | null>(null);

  const terme = recherche.trim().toLowerCase();
  const produitsFiltres = terme
    ? produits.filter((p) =>
        `${p.nom} ${p.ref} ${p.cat}`.toLowerCase().includes(terme),
      )
    : produits;

  function ouvrirAjout() {
    setProduitEnEdition(null);
    setFormOuvert(true);
  }

  function ouvrirModification(id: string) {
    setProduitEnEdition(produits.find((p) => p.id === id) ?? null);
    setFormOuvert(true);
  }

  function enregistrer(saisie: SaisieProduit) {
    if (produitEnEdition) {
      modifierProduit(produitEnEdition.id, saisie);
      afficherToast(`Produit modifié — ${saisie.ref}`);
    } else {
      ajouterProduit(saisie);
      afficherToast(`Produit enregistré — ${saisie.ref}`);
    }
    setFormOuvert(false);
  }

  function confirmerSuppression() {
    if (!produitASupprimer) return;
    supprimerProduit(produitASupprimer.id);
    afficherToast("Produit supprimé");
    setProduitASupprimer(null);
  }

  return (
    <>
      <div className="mb-[26px] flex flex-wrap items-center gap-[18px]">
        <h1 className="text-[26px] font-bold">Produits</h1>
        <span className="font-mono text-xs text-encre-3">
          {produits.length} produits au catalogue
        </span>
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un produit…"
          aria-label="Rechercher dans le catalogue"
          className="ml-auto h-[42px] w-[260px] max-w-full rounded-lg border-[1.5px] border-ligne bg-white px-3.5 text-[14.5px] max-lg:ml-0 max-lg:w-full"
        />
        <Bouton variant="cuivre" onClick={ouvrirAjout}>
          <Icon name="plus" className="h-4 w-4" />
          Ajouter un produit
        </Bouton>
      </div>

      <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
        <ProductsTable
          produits={produitsFiltres}
          onModifier={ouvrirModification}
          onSupprimer={(id) =>
            setProduitASupprimer(produits.find((p) => p.id === id) ?? null)
          }
        />
      </div>

      <ProductFormModal
        ouvert={formOuvert}
        produit={produitEnEdition}
        onFermer={() => setFormOuvert(false)}
        onEnregistrer={enregistrer}
      />
      <DeleteConfirmModal
        ouvert={produitASupprimer !== null}
        produitNom={produitASupprimer?.nom ?? ""}
        onConfirmer={confirmerSuppression}
        onAnnuler={() => setProduitASupprimer(null)}
      />
    </>
  );
}
