import { Navigate, Outlet } from "react-router-dom";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuthStore } from "@/store/authStore";

/** Layout des pages propriétaire, protégé : redirige vers la connexion. */
export function AdminLayout() {
  const connecte = useAuthStore((s) => s.connecte);

  if (!connecte) {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] max-lg:grid-cols-1">
      <AdminSidebar />
      <main className="max-w-[1080px] px-9 py-8 max-lg:px-5">
        <Outlet />
      </main>
    </div>
  );
}
