import Link from "next/link";
import { PackagePlus, ShoppingBag } from "lucide-react";

import AdminCommercePulseSection from "@/components/admin/dashboard/AdminCommercePulseSection";
import AdminDashboardFilters from "@/components/admin/dashboard/AdminDashboardFilters";
import AdminKpiCards from "@/components/admin/dashboard/AdminKpiCards";
import AdminLowStockCard from "@/components/admin/dashboard/AdminLowStockCard";
import AdminOperationalAlerts from "@/components/admin/dashboard/AdminOperationalAlerts";
import AdminPriorityTasks from "@/components/admin/dashboard/AdminPriorityTasks";
import AdminRecentCustomersCard from "@/components/admin/dashboard/AdminRecentCustomersCard";
import AdminRecentOrdersSection from "@/components/admin/dashboard/AdminRecentOrdersSection";
import AdminShortcutsCard from "@/components/admin/dashboard/AdminShortcutsCard";
import {
  getAdminOverviewData,
  parseAdminDashboardFilters,
} from "@/lib/admin-pages";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const filters = parseAdminDashboardFilters(resolvedParams);
  const data = await getAdminOverviewData(filters);
  const statusMessage = getParam(resolvedParams, "status");
  const errorMessage = getParam(resolvedParams, "error");

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Console operations
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            Dashboard admin
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Fenetre active: {data.dateWindow.label}. Les alertes ci-dessous sont cliquables.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders?stage=priority#orders-list"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-shop_btn_dark_green px-3 text-sm font-semibold text-white transition-colors hover:bg-shop_btn_dark_green/90"
          >
            <ShoppingBag className="h-4 w-4" />
            Traiter commandes
          </Link>
          <Link
            href="/admin/products#new-product"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <PackagePlus className="h-4 w-4" />
            Ajouter produit
          </Link>
        </div>
      </section>

      {statusMessage ? (
        <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      ) : null}

      <AdminOperationalAlerts alerts={data.operationalAlerts} />

      <AdminDashboardFilters filters={data.filters} options={data.filterOptions} />

      <AdminPriorityTasks tasks={data.priorityTasks} />

      <AdminKpiCards groups={data.businessKpis} />

      <AdminCommercePulseSection
        analytics={data.analytics}
        latestWeekLabel={data.dateWindow.label}
      />

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <AdminRecentOrdersSection recentOrders={data.recentOrders} />

        <div className="space-y-5">
          <AdminLowStockCard
            lowStockItems={data.lowStockItems}
            inventorySummary={data.inventorySummary}
          />
          <AdminRecentCustomersCard recentCustomers={data.recentCustomers} />
          <AdminShortcutsCard />
        </div>
      </section>
    </div>
  );
}
