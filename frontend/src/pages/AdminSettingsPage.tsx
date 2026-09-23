import { useState } from "react";

import { BoutiqueForm } from "@/components/admin/BoutiqueForm";
import { CompteForm } from "@/components/admin/CompteForm";
import { Bell, LucideIcon, Package, Printer, UserRound } from "lucide-react";

type Onglet = "compte" | "boutique" | "imprimante" | "notifications";

const ONGLETS: { id: Onglet; libelle: string; Icon: LucideIcon }[] = [
  { id: "compte", libelle: "Mon compte", Icon: UserRound },
  { id: "boutique", libelle: "Boutique", Icon: Package },
  { id: "imprimante", libelle: "Imprimante", Icon: Printer },
  { id: "notifications", libelle: "Notifications", Icon: Bell },
];

function PanneauBientotDisponible({ titre }: { titre: string }) {
  return (
    <div className="rounded-[10px] border border-dashed border-ligne bg-white px-6 py-14 text-center">
      <p className="text-[15px] font-semibold">{titre}</p>
      <p className="mt-1.5 text-[13.5px] text-encre-3">Bientôt disponible.</p>
    </div>
  );
}

/** Paramètres : compte propriétaire et paramètres de la boutique. */
export function AdminSettingsPage() {
  const [onglet, setOnglet] = useState<Onglet>("compte");

  return (
    <>
      <div className="mb-[26px]">
        <h1 className="text-[26px] font-bold">Paramètres</h1>
        <p className="mt-1 text-[14.5px] text-encre-2">
          Configurez votre boutique et votre compte.
        </p>
      </div>

      <div className="grid grid-cols-[220px_1fr] items-start gap-5 max-lg:grid-cols-1">
        <nav
          aria-label="Sections des paramètres"
          className="grid gap-0.5 rounded-[10px] border border-ligne bg-white p-2.5"
        >
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
              aria-current={onglet === o.id ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${
                onglet === o.id
                  ? "bg-cuivre/10 text-cuivre"
                  : "text-encre-2 hover:bg-illu"
              }`}
            >
              <o.Icon className="h-[17px] w-[17px]" />
              {o.libelle}
            </button>
          ))}
        </nav>

        <div className="grid gap-5">
          {onglet === "compte" && <CompteForm />}
          {onglet === "boutique" && <BoutiqueForm />}
          {onglet === "imprimante" && (
            <PanneauBientotDisponible titre="Imprimante de tickets" />
          )}
          {onglet === "notifications" && (
            <PanneauBientotDisponible titre="Notifications" />
          )}
        </div>
      </div>
    </>
  );
}
