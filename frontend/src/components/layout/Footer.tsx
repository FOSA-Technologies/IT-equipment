import { Link } from "react-router-dom";

const COLONNES = [
  { titre: "Aide", liens: ["Livraison et retours", "Garantie", "Nous contacter"] },
  { titre: "Compte", liens: ["Espace propriétaire", "Suivre une commande"] },
  { titre: "Légal", liens: ["Conditions générales", "Confidentialité", "Mentions légales"] },
] as const;

/** Pied de page côté client. */
export function Footer() {
  return (
    <footer className="mt-[30px] border-t border-ligne bg-white">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 px-4 py-11 sm:px-6 max-sm:grid-cols-1">
        <div>
          <Link to="/" className="font-titre text-[19px] font-bold tracking-tight">
            IT<span className="text-cuivre">-</span>equipment
          </Link>
          <p className="mt-2.5 max-w-[34ch] text-sm text-encre-2">
            Composants informatiques testés et garantis, expédiés depuis notre atelier.
          </p>
        </div>
        {COLONNES.map((colonne) => (
          <div key={colonne.titre}>
            <h4 className="mb-3 text-[13.5px] font-semibold">{colonne.titre}</h4>
            {colonne.liens.map((libelle) => (
              <Link
                key={libelle}
                to={libelle === "Espace propriétaire" ? "/connexion" : "/boutique"}
                className="block py-1 text-sm text-encre-2 hover:text-cuivre"
              >
                {libelle}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-ligne px-6 py-4 text-center font-mono text-xs text-encre-3">
        © 2026 IT-equipment
      </div>
    </footer>
  );
}
