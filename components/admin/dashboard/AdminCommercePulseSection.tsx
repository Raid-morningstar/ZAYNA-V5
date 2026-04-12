import { Activity, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { adminSurfaceClassName } from "@/components/admin/AdminPagePrimitives";
import AdminRevenueChart from "./AdminRevenueChart";
import AdminStageRing from "./AdminStageRing";
import AdminTopProductsList from "./AdminTopProductsList";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  revenueSeries: AdminOverviewData["revenueSeries"];
  orderStageBreakdown: AdminOverviewData["orderStageBreakdown"];
  topProducts: AdminOverviewData["topProducts"];
  latestWeekLabel: string;
};

export default function AdminCommercePulseSection({
  revenueSeries,
  orderStageBreakdown,
  topProducts,
  latestWeekLabel,
}: Props) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(350px,0.95fr)]">
      {/* ─── Revenue chart ─── */}
      <div className={cn(adminSurfaceClassName, "overflow-hidden border-sky-100/80 p-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50">Commerce pulse</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Revenus et cadence des commandes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Une lecture 14 jours pour voir si le flux du dashboard accelere, ralentit ou demande
              une action immediate.
            </p>
          </div>

          <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Fenetre courante
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{latestWeekLabel}</p>
          </div>
        </div>

        <div className="mt-6">
          <AdminRevenueChart data={revenueSeries} />
        </div>
      </div>

      {/* ─── Stage ring + Top products ─── */}
      <div className="space-y-6">
        <div className={cn(adminSurfaceClassName, "p-6")}>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-shop_btn_dark_green" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Distribution
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                Etats des commandes
              </h2>
            </div>
          </div>
          <div className="mt-5">
            <AdminStageRing data={orderStageBreakdown} />
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-6")}>
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-shop_btn_dark_green" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Best-sellers
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                Produits qui tirent le flux
              </h2>
            </div>
          </div>
          <div className="mt-5">
            <AdminTopProductsList items={topProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}
