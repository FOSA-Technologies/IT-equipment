import { useMemo, useState } from "react";

import { CatalogueEtat } from "@/components/produit/CatalogueEtat";
import { Bouton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SaleCartLine } from "@/components/vente/SaleCartLine";
import { SaleProductCard } from "@/components/vente/SaleProductCard";
import { decomposerTva, LIBELLES_PAIEMENT } from "@/domain/commandes";
import { formatPrix } from "@/domain/format";
import { nbArticles, totalPanier } from "@/domain/panier";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/http";
import { useCatalogueStore } from "@/store/catalogueStore";
import { useUiStore } from "@/store/uiStore";
import {
  CATEGORIES,
  type Categorie,
  type LignePanier,
  type MoyenPaiement,
  type Produit,
} from "@/types";

const MOYENS = [
  { valeur: "especes" as MoyenPaiement, libelle: "Espèces" },
  { valeur: "carte" as MoyenPaiement, libelle: "Carte bancaire" },
];

/** Écran de caisse : recherche, catégories, panier de vente, encaissement. */
export function AdminSalePage() {
  const produits = useCatalogueStore((s) => s.produits);
  const statutCatalogue = useCatalogueStore((s) => s.statut);
  const chargerCatalogue = useCatalogueStore((s) => s.charger);
  const afficherToast = useUiStore((s) => s.afficherToast);

  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState<Categorie | "">("");
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [paiement, setPaiement] = useState<MoyenPaiement>("especes");
  const [enCours, setEnCours] = useState(false);

  const terme = recherche.trim().toLowerCase();
  const produitsAffiches = produits.filter((p) => {
    if (categorie && p.cat !== categorie) return false;
    if (!terme) return true;
    return `${p.nom} ${p.ref}`.toLowerCase().includes(terme);
  });

  const produitsParId = useMemo(
    () => new Map(produits.map((p) => [p.id, p])),
    [produits],
  );
  const lignesPanier: { ligne: LignePanier; produit: Produit }[] = panier
    .map((ligne) => ({ ligne, produit: produitsParId.get(ligne.produitId) }))
    .filter(
      (x): x is { ligne: LignePanier; produit: Produit } =>
        x.produit !== undefined,
    );

  const total = totalPanier(panier, produits);
  const { ht, tva } = decomposerTva(total);
  const nb = nbArticles(panier);

  function ajouter(produitId: string) {
    const produit = produitsParId.get(produitId);
    if (!produit) return;
    setPanier((lignes) => {
      const existante = lignes.find((l) => l.produitId === produitId);
      const quantiteActuelle = existante?.quantite ?? 0;
      if (quantiteActuelle >= produit.stock) return lignes;
      return existante
        ? lignes.map((l) =>
            l.produitId === produitId ? { ...l, quantite: l.quantite + 1 } : l,
          )
        : [...lignes, { produitId, quantite: 1 }];
    });
  }

  function incrementer(produitId: string) {
    ajouter(produitId);
  }

  function decrementer(produitId: string) {
    setPanier((lignes) =>
      lignes.flatMap((l) => {
        if (l.produitId !== produitId) return [l];
        return l.quantite > 1 ? [{ ...l, quantite: l.quantite - 1 }] : [];
      }),
    );
  }

  function retirer(produitId: string) {
    setPanier((lignes) => lignes.filter((l) => l.produitId !== produitId));
  }

  async function encaisser() {
    if (enCours || panier.length === 0) return;
    setEnCours(true);
    try {
      const vente = await api.commandes.creerVente(paiement, panier);
      afficherToast(
        `Vente encaissée — ${vente.reference} — ${formatPrix(vente.total)}`,
      );
      setPanier([]);
      void chargerCatalogue(); // le stock a changé
    } catch (e) {
      afficherToast(messageErreur(e));
      void chargerCatalogue();
    } finally {
      setEnCours(false);
    }
  }

  if (statutCatalogue !== "pret") return <CatalogueEtat integre />;

  return (
    <>
      <div className="mb-[26px]">
        <h1 className="text-[26px] font-bold">Nouvelle vente</h1>
        <p className="mt-1 text-[14.5px] text-encre-2">
          Encaissez rapidement une vente réalisée en magasin.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_340px] items-start gap-5 max-lg:grid-cols-1">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="relative flex-1">
              <Icon
                name="loupe"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-encre-3"
              />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un produit…"
                aria-label="Rechercher un produit"
                className="h-[42px] w-full rounded-lg border-[1.5px] border-ligne bg-white pl-10 pr-3.5 text-[14.5px]"
              />
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategorie("")}
              className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                categorie === ""
                  ? "border-cuivre bg-cuivre/10 text-cuivre"
                  : "border-ligne bg-white text-encre-2 hover:border-encre"
              }`}
            >
              Tous
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategorie(cat)}
                className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  categorie === cat
                    ? "border-cuivre bg-cuivre/10 text-cuivre"
                    : "border-ligne bg-white text-encre-2 hover:border-encre"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {produitsAffiches.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-ligne bg-white px-6 py-14 text-center text-[14.5px] text-encre-2">
              Aucun produit ne correspond à cette recherche.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
              {produitsAffiches.map((produit) => (
                <SaleProductCard
                  key={produit.id}
                  produit={produit}
                  quantiteAuPanier={
                    panier.find((l) => l.produitId === produit.id)?.quantite ??
                    0
                  }
                  onAjouter={() => ajouter(produit.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[10px] border border-ligne bg-white p-[18px] lg:sticky lg:top-[88px]">
          <div className="mb-3.5 flex items-baseline justify-between">
            <h3 className="text-base font-bold">Panier ({nb})</h3>
            {panier.length > 0 && (
              <button
                type="button"
                onClick={() => setPanier([])}
                className="text-[12.5px] text-encre-3 underline underline-offset-4 hover:text-rouge"
              >
                Vider
              </button>
            )}
          </div>

          {lignesPanier.length === 0 ? (
            <p className="py-6 text-center text-[13.5px] text-encre-3">
              Ajoutez des produits pour commencer une vente.
            </p>
          ) : (
            <div className="grid gap-3.5">
              {lignesPanier.map(({ ligne, produit }) => (
                <SaleCartLine
                  key={ligne.produitId}
                  ligne={ligne}
                  produit={produit}
                  onIncrementer={() => incrementer(ligne.produitId)}
                  onDecrementer={() => decrementer(ligne.produitId)}
                  onRetirer={() => retirer(ligne.produitId)}
                />
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-1.5 border-t border-ligne pt-4">
            {MOYENS.map((moyen) => (
              <button
                key={moyen.valeur}
                type="button"
                onClick={() => setPaiement(moyen.valeur)}
                className={`rounded-lg border-[1.5px] py-2 text-[13px] font-medium transition-colors ${
                  paiement === moyen.valeur
                    ? "border-cuivre bg-cuivre/5 text-cuivre"
                    : "border-ligne text-encre-2"
                }`}
              >
                {moyen.libelle}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-1.5 border-t border-ligne pt-4 font-mono text-[13.5px]">
            <div className="flex justify-between text-encre-2">
              <span>Sous-total (HT)</span>
              <span>{formatPrix(ht)}</span>
            </div>
            <div className="flex justify-between text-encre-2">
              <span>TVA (20 %)</span>
              <span>{formatPrix(tva)}</span>
            </div>
            <div className="flex justify-between text-[17px] font-bold text-encre">
              <span>Total</span>
              <span>{formatPrix(total)}</span>
            </div>
          </div>

          <Bouton
            variant="cuivre"
            className="mt-4 w-full"
            disabled={panier.length === 0 || enCours}
            onClick={() => void encaisser()}
          >
            {enCours ? "Encaissement…" : `Encaisser — ${formatPrix(total)}`}
          </Bouton>
          <p className="mt-2.5 text-center text-[11.5px] text-encre-3">
            {LIBELLES_PAIEMENT[paiement]} · stock mis à jour immédiatement
          </p>
        </div>
      </div>
    </>
  );
}
