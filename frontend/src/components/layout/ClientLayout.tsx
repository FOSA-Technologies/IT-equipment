import { Outlet } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useParametresStore } from "@/store/parametresStore";

/** Habillage commun des pages client : entête + contenu + pied de page. */
export function ClientLayout() {
  // formatPrix lit la devise courante via une variable de module (non réactive) :
  // s'abonner ici force le nouveau rendu de tout l'arbre quand elle change.
  useParametresStore((s) => s.boutique?.devise);

  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
