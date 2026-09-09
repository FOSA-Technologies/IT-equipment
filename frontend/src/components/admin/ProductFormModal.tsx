import { useState, type FormEvent } from "react";

import { Bouton, BoutonIcone } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { CATEGORIES, type Categorie, type Produit, type SaisieProduit } from "@/types";

const CHAMP_INPUT =
  "w-full rounded-lg border-[1.5px] border-ligne bg-white px-3 py-2.5 text-[15px]";

interface ChampProps {
  id: string;
  label: string;
  valeur: string;
  onChange: (valeur: string) => void;
  type?: string;
  placeholder?: string;
  requis?: boolean;
  pleineLargeur?: boolean;
}

function Champ({
  id,
  label,
  valeur,
  onChange,
  type = "text",
  placeholder,
  requis = false,
  pleineLargeur = false,
}: ChampProps) {
  return (
    <div className={`grid gap-1.5 ${pleineLargeur ? "col-span-2" : ""}`}>
      <label htmlFor={id} className="text-[13.5px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={requis}
        className={CHAMP_INPUT}
      />
    </div>
  );
}

interface FormProduitProps {
  produit: Produit | null;
  onEnregistrer: (saisie: SaisieProduit) => void;
  onAnnuler: () => void;
}

/** Contenu du formulaire ; la clé parente le réinitialise entre deux produits. */
function FormProduit({ produit, onEnregistrer, onAnnuler }: FormProduitProps) {
  const [nom, setNom] = useState(produit?.nom ?? "");
  const [ref, setRef] = useState(produit?.ref ?? "");
  const [cat, setCat] = useState<Categorie>(produit?.cat ?? "Stockage");
  const [prix, setPrix] = useState(produit ? String(produit.prix) : "");
  const [stock, setStock] = useState(produit ? String(produit.stock) : "");
  const [desc, setDesc] = useState(produit?.desc ?? "");

  function soumettre(e: FormEvent) {
    e.preventDefault();
    const prixNombre = Number.parseFloat(prix.replace(",", "."));
    const stockNombre = Number.parseInt(stock, 10);
    if (
      !nom.trim() ||
      !ref.trim() ||
      Number.isNaN(prixNombre) ||
      Number.isNaN(stockNombre)
    ) {
      return;
    }
    onEnregistrer({
      nom: nom.trim(),
      ref: ref.trim().toUpperCase(),
      cat,
      prix: prixNombre,
      stock: stockNombre,
      desc: desc.trim(),
    });
  }

  return (
    <form onSubmit={soumettre} className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
      <Champ
        id="mp-nom"
        label="Nom du produit"
        valeur={nom}
        onChange={setNom}
        placeholder="SSD NVMe 2 To"
        requis
        pleineLargeur
      />
      <Champ
        id="mp-ref"
        label="Référence"
        valeur={ref}
        onChange={setRef}
        placeholder="SSV-P41-2T"
        requis
      />
      <div className="grid gap-1.5">
        <label htmlFor="mp-cat" className="text-[13.5px] font-semibold">
          Catégorie
        </label>
        <select
          id="mp-cat"
          value={cat}
          onChange={(e) => setCat(e.target.value as Categorie)}
          className={CHAMP_INPUT}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <Champ
        id="mp-prix"
        label="Prix (€)"
        type="number"
        valeur={prix}
        onChange={setPrix}
        placeholder="149,00"
        requis
      />
      <Champ
        id="mp-stock"
        label="Stock"
        type="number"
        valeur={stock}
        onChange={setStock}
        placeholder="10"
        requis
      />
      <div className="grid gap-1.5 max-sm:col-span-1 col-span-2">
        <label htmlFor="mp-desc" className="text-[13.5px] font-semibold">
          Description
        </label>
        <textarea
          id="mp-desc"
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Une phrase pour présenter le produit."
          className={`${CHAMP_INPUT} resize-y`}
        />
      </div>
      <div className="col-span-2 mt-2 flex justify-end gap-2.5 max-sm:col-span-1">
        <Bouton type="button" variant="fantome" onClick={onAnnuler}>
          Annuler
        </Bouton>
        <Bouton type="submit" variant="cuivre">
          Enregistrer le produit
        </Bouton>
      </div>
    </form>
  );
}

interface ProductFormModalProps {
  ouvert: boolean;
  /** null = création, sinon modification du produit. */
  produit: Produit | null;
  onFermer: () => void;
  onEnregistrer: (saisie: SaisieProduit) => void;
}

/** Modale d'ajout / modification d'un produit. */
export function ProductFormModal({
  ouvert,
  produit,
  onFermer,
  onEnregistrer,
}: ProductFormModalProps) {
  return (
    <Modal ouvert={ouvert} onFermer={onFermer} titreId="titre-form-produit">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="titre-form-produit" className="text-[19px] font-bold">
          {produit ? "Modifier le produit" : "Ajouter un produit"}
        </h2>
        <BoutonIcone onClick={onFermer} aria-label="Fermer">
          <Icon name="croix" />
        </BoutonIcone>
      </div>
      <FormProduit
        key={produit?.id ?? "nouveau"}
        produit={produit}
        onEnregistrer={onEnregistrer}
        onAnnuler={onFermer}
      />
    </Modal>
  );
}
