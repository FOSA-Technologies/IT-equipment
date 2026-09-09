import { RecentOrders } from "@/components/admin/RecentOrders";
import { SalesChart } from "@/components/admin/SalesChart";
import { StatsTiles } from "@/components/admin/StatsTiles";
import { StockAlerts } from "@/components/admin/StockAlerts";

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Dashboard propriétaire : indicateurs, ventes, alertes, commandes. */
export function DashboardPage() {
  const date = FORMAT_DATE.format(new Date());

  return (
    <>
      <div className="mb-[26px] flex flex-wrap items-center gap-[18px]">
        <h1 className="text-[26px] font-bold">Vue d'ensemble</h1>
        <span className="ml-auto font-mono text-[13px] text-encre-3">
          {date}
        </span>
      </div>

      <StatsTiles />

      <div className="mb-5 mt-5 grid grid-cols-[2fr_1fr] gap-4 max-lg:grid-cols-1">
        <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
          <h3 className="text-base font-bold">Ventes</h3>
          <p className="mb-4 mt-1 font-mono text-[11.5px] text-encre-3">
            Sept derniers jours, en euros. La barre « Aujourd'hui » est
            partielle.
          </p>
          <SalesChart />
        </div>
        <StockAlerts />
      </div>

      <div className="rounded-[10px] border border-ligne bg-white p-[22px]">
        <h3 className="text-base font-bold">Dernières commandes</h3>
        <p className="mb-4 mt-1 font-mono text-[11.5px] text-encre-3">
          Les cinq plus récentes
        </p>
        <RecentOrders />
      </div>
    </>
  );
}
