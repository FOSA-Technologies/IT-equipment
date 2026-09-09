import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ProductIllustration } from "@/components/produit/ProductIllustration";
import { SpecTable } from "@/components/produit/SpecTable";
import { Bouton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StockStatus } from "@/components/ui/StockStatus";
import { statutStock } from "@/domain/catalogue";
import { formatPrix } from "@/domain/format";
import { useCatalogueStore } from "@/store/catalogueStore";
import { usePanierStore } from "@/store/panierStore";
import { useUiStore } from "@/store/uiStore";

const QUANTITES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Fiche produit : schéma, prix, stock, fiche technique. */
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const produit = useCatalogueStore((s) =>
    s.produits.find((p) => p.id === id),
  );
  const ajouter = usePanierStore((s) => s.ajouter);
  const afficherToast = useUiStore((s) => s.afficherToast);
  const [quantite, setQuantite] = useState(1);

  if (!produit) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-20 text-center sm:px-6">
        <h1 className="mb-2 text-2xl font-bold">Produit introuvable</h1>
        <p className="mb-5 text-encre-2">
          Ce produit n'existe plus dans le catalogue.
        </p>
        <Link
          to="/boutique"
          className="text-sm text-cuivre underline underline-offset-4"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const statut = statutStock(produit);
  // Copie étroite après le garde : garantit le typage dans la fermeture.
  const produitChoisi = produit;

  function ajouterAuPanier() {
    ajouter(produitChoisi.id, quantite);
    afficherToast(`Ajouté au panier — ${produitChoisi.ref}`);
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-9 sm:px-6">
      <p className="mb-[22px] font-mono text-[12.5px] text-encre-3">
        <Link to="/boutique" className="hover:text-cuivre">
          Catalogue
        </Link>{" "}
        /{" "}
        <Link
          to={`/boutique?cat=${produit.cat}`}
          className="hover:text-cuivre"
        >
          {produit.cat}
        </Link>{" "}
        / <span className="text-encre-2">{produit.nom}</span>
      </p>

      <div className="grid grid-cols-2 items-start gap-12 max-lg:grid-cols-1 max-lg:gap-7">
        <div className="rounded-[10px] border border-ligne bg-illu p-9">
          <ProductIllustration nom={produit.illu} />
        </div>

        <div>
          <p className="font-mono text-[12.5px] tracking-wide text-encre-3">
            {produit.ref}
          </p>
          <h1 className="mb-2.5 mt-2 text-[clamp(24px,3vw,32px)] font-bold tracking-tight">
            {produit.nom}
          </h1>
          <p className="mb-[18px] max-w-[52ch] text-encre-2">{produit.desc}</p>

          <p className="mb-3.5 font-mono text-[27px] font-semibold">
            {produit.prixBarre && (
              <s className="mr-1.5 text-[17px] font-normal text-encre-3">
                {formatPrix(produit.prixBarre)}
              </s>
            )}
            {formatPrix(produit.prix)}
          </p>

          <p className="text-sm">
            <StockStatus statut={statut} />
            {produit.stock > 0 && " — expédié sous 24 h"}
          </p>

          <div className="my-5 flex items-center gap-3">
            <select
              value={quantite}
              onChange={(e) => setQuantite(Number(e.target.value))}
              aria-label="Quantité"
              className="rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]"
            >
              {QUANTITES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <Bouton variant="cuivre" onClick={ajouterAuPanier}>
              Ajouter au panier
            </Bouton>
          </div>

          <ul className="grid gap-2 border-t border-ligne pt-[18px]">
            {[
              "Expédié sous 24 h",
              `Garantie ${produit.fiche.Garantie}`,
              "Retour 30 jours",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-encre-2"
              >
                <Icon name="check" className="h-4 w-4 shrink-0 text-vert" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-9 max-w-[620px]">
        <h2 className="mb-[22px] text-xl font-bold">Fiche technique</h2>
        <SpecTable fiche={produit.fiche} />
      </div>
    </div>
  );
}
