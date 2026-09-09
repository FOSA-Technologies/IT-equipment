import { useState, type FormEvent } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";

const MOYENS_PAIEMENT: {
  valeur: string;
  libelle: string;
  icone?: IconName;
  initiale?: string;
}[] = [
  { valeur: "carte", libelle: "Carte bancaire", icone: "carte" },
  { valeur: "virement", libelle: "Virement", icone: "banque" },
  { valeur: "paypal", libelle: "PayPal", initiale: "P" },
];

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

interface CheckoutFormProps {
  onCommander: (email: string) => void;
}

/** Formulaire de commande : coordonnées, livraison, paiement. */
export function CheckoutForm({ onCommander }: CheckoutFormProps) {
  const [champs, setChamps] = useState({
    email: "",
    tel: "",
    nom: "",
    adresse: "",
    cp: "",
    ville: "",
    paiement: "carte",
  });

  function maj(nom: string, valeur: string) {
    setChamps((c) => ({ ...c, [nom]: valeur }));
  }

  function soumettre(e: FormEvent) {
    e.preventDefault();
    onCommander(champs.email.trim());
  }

  return (
    <form id="form-commande" onSubmit={soumettre} className="grid gap-5">
      <div className="rounded-[10px] border border-ligne bg-white p-6">
        <h2 className="mb-4 text-[17px] font-bold">Coordonnées</h2>
        <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
          <Champ
            id="cmd-email"
            label="Adresse e-mail"
            type="email"
            valeur={champs.email}
            onChange={(v) => maj("email", v)}
            placeholder="vous@exemple.fr"
            requis
          />
          <Champ
            id="cmd-tel"
            label="Téléphone"
            type="tel"
            valeur={champs.tel}
            onChange={(v) => maj("tel", v)}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div className="rounded-[10px] border border-ligne bg-white p-6">
        <h2 className="mb-4 text-[17px] font-bold">Livraison</h2>
        <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
          <Champ
            id="cmd-nom"
            label="Nom complet"
            valeur={champs.nom}
            onChange={(v) => maj("nom", v)}
            placeholder="Alex Martin"
            pleineLargeur
            requis
          />
          <Champ
            id="cmd-adresse"
            label="Adresse"
            valeur={champs.adresse}
            onChange={(v) => maj("adresse", v)}
            placeholder="12 rue des Composants"
            pleineLargeur
            requis
          />
          <Champ
            id="cmd-cp"
            label="Code postal"
            valeur={champs.cp}
            onChange={(v) => maj("cp", v)}
            placeholder="75011"
            requis
          />
          <Champ
            id="cmd-ville"
            label="Ville"
            valeur={champs.ville}
            onChange={(v) => maj("ville", v)}
            placeholder="Paris"
            requis
          />
        </div>
      </div>

      <div className="rounded-[10px] border border-ligne bg-white p-6">
        <h2 className="mb-4 text-[17px] font-bold">Paiement</h2>
        <div className="grid grid-cols-3 gap-2.5 max-sm:grid-cols-1">
          {MOYENS_PAIEMENT.map((moyen) => (
            <label
              key={moyen.valeur}
              className={`flex cursor-pointer flex-col items-start gap-2 rounded-lg border-[1.5px] p-3 text-[13.5px] font-medium ${
                champs.paiement === moyen.valeur
                  ? "border-cuivre bg-cuivre/5"
                  : "border-ligne"
              }`}
            >
              {moyen.icone && (
                <Icon name={moyen.icone} className="h-5 w-5 text-encre-2" />
              )}
              {moyen.initiale && (
                <span className="font-mono text-base font-semibold text-encre-2">
                  {moyen.initiale}
                </span>
              )}
              {moyen.libelle}
              <input
                type="radio"
                name="paiement"
                value={moyen.valeur}
                checked={champs.paiement === moyen.valeur}
                onChange={(e) => maj("paiement", e.target.value)}
                className="h-[15px] w-[15px] accent-cuivre"
              />
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
