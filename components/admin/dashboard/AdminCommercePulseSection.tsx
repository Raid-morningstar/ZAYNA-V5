import { Activity, CreditCard, Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  adminCurrencyFormatter,
  adminSurfaceClassName,
  formatLabel,
} from "@/components/admin/AdminPagePrimitives";
import { cn } from "@/lib/utils";
import AdminRevenueChart from "./AdminRevenueChart";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  analytics: AdminOverviewData["analytics"];
  latestWeekLabel: string;
};

const countFormatter = new Intl.NumberFormat("fr-MA");

const BarRow = ({
  label,
  value,
  max,
  helper,
}: {
  label: string;
  value: number;
  max: number;
  helper?: string;
}) => {
  const width = max > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-950">{countFormatter.format(value)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-shop_btn_dark_green"
          style={{ width: `${width}%` }}
        />
      </div>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
};

export default function AdminCommercePulseSection({
  analytics,
  latestWeekLabel,
}: Props) {
  const maxPayment = Math.max(...analytics.paidVsUnpaid.map((item) => item.count), 1);
  const maxStatus = Math.max(...analytics.ordersByStatus.map((item) => item.count), 1);
  const maxCategory = Math.max(...analytics.ordersByCategory.map((item) => item.orders), 1);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
      <div className={cn(adminSurfaceClassName, "overflow-hidden p-5")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50">Analytics</Badge>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
              Revenus et commandes
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Fenetre active: {latestWeekLabel}.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <AdminRevenueChart data={analytics.revenueSeries} />
        </div>
      </div>

      <div className="grid gap-5">
        <div className={cn(adminSurfaceClassName, "p-5")}>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-shop_btn_dark_green" />
            <h2 className="text-base font-semibold text-slate-950">Payees vs non payees</h2>
          </div>
          <div className="mt-5 space-y-4">
            {analytics.paidVsUnpaid.length ? (
              analytics.paidVsUnpaid.map((item) => (
                <BarRow
                  key={item.status}
                  label={formatLabel(item.status)}
                  value={item.count}
                  max={maxPayment}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Aucun paiement dans la periode.
              </p>
            )}
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-5")}>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-shop_btn_dark_green" />
            <h2 className="text-base font-semibold text-slate-950">Commandes par statut</h2>
          </div>
          <div className="mt-5 space-y-4">
            {analytics.ordersByStatus.length ? (
              analytics.ordersByStatus.map((item) => (
                <BarRow
                  key={item.status}
                  label={formatLabel(item.status)}
                  value={item.count}
                  max={maxStatus}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Aucune commande dans la periode.
              </p>
            )}
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-5")}>
          <div className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-shop_btn_dark_green" />
            <h2 className="text-base font-semibold text-slate-950">Commandes par categorie</h2>
          </div>
          <div className="mt-5 space-y-4">
            {analytics.ordersByCategory.length ? (
              analytics.ordersByCategory.map((item) => (
                <BarRow
                  key={item.category}
                  label={item.category}
                  value={item.orders}
                  max={maxCategory}
                  helper={adminCurrencyFormatter.format(item.revenue)}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Aucune categorie vendue dans la periode.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
