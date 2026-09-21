import { useState } from "react";

import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { CatalogueEtat } from "@/components/produit/CatalogueEtat";
import { Bouton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { messageErreur } from "@/lib/http";
import { useCatalogueStore } from "@/store/catalogueStore";
import { useUiStore } from "@/store/uiStore";
import type { Produit, SaisieProduit } from "@/types";

/** Gestion des produits : recherche, ajout, modification, suppression. */
export function AdminProductsPage() {
  const produits = useCatalogueStore((s) => s.produits);
  const statutCatalogue = useCatalogueStore((s) => s.statut);
  const ajouterProduit = useCatalogueStore((s) => s.ajouterProduit);
  const modifierProduit = useCatalogueStore((s) => s.modifierProduit);
  const supprimerProduit = useCatalogueStore((s) => s.supprimerProduit);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const [recherche, setRecherche] = useState("");
  const [formOuvert, setFormOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);
  const [produitASupprimer, setProduitASupprimer] = useState<Produit | null>(null);
  const [enCours, setEnCours] = useState(false);

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

  async function enregistrer(saisie: SaisieProduit) {
    if (enCours) return;
    setEnCours(true);
    try {
      if (produitEnEdition) {
        await modifierProduit(produitEnEdition.id, saisie);
        afficherToast(`Produit modifié — ${saisie.ref}`);
      } else {
        await ajouterProduit(saisie);
        afficherToast(`Produit enregistré — ${saisie.ref}`);
      }
      setFormOuvert(false);
    } catch (e) {
      // La modale reste ouverte pour permettre de corriger la saisie.
      afficherToast(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function confirmerSuppression() {
    if (!produitASupprimer || enCours) return;
    setEnCours(true);
    try {
      await supprimerProduit(produitASupprimer.id);
      afficherToast("Produit supprimé");
      setProduitASupprimer(null);
    } catch (e) {
      afficherToast(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  if (statutCatalogue !== "pret") return <CatalogueEtat integre />;

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
        enCours={enCours}
      />
      <DeleteConfirmModal
        ouvert={produitASupprimer !== null}
        produitNom={produitASupprimer?.nom ?? ""}
        onConfirmer={() => void confirmerSuppression()}
        onAnnuler={() => setProduitASupprimer(null)}
      />
    </>
  );
}
