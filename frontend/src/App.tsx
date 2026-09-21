import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ToastHost } from "@/components/ui/Toast";
import { AdminProductsPage } from "@/pages/AdminProductsPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ProductPage } from "@/pages/ProductPage";
import { ShopPage } from "@/pages/ShopPage";
import { useCatalogueStore } from "@/store/catalogueStore";
import { usePanierStore } from "@/store/panierStore";

/** Racine de l'application : chargement du catalogue, routes et layouts. */
export default function App() {
  const charger = useCatalogueStore((s) => s.charger);
  const statut = useCatalogueStore((s) => s.statut);
  const produits = useCatalogueStore((s) => s.produits);
  const purger = usePanierStore((s) => s.purger);

  useEffect(() => {
    void charger();
  }, [charger]);

  // Un produit supprimé par le propriétaire ne doit pas rester dans un panier.
  useEffect(() => {
    if (statut === "pret") purger(new Set(produits.map((p) => p.id)));
  }, [statut, produits, purger]);

  return (
    <>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
        </Route>
        <Route path="/connexion" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminProductsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  );
}
