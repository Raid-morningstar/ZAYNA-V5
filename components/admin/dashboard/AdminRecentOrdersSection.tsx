import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminCurrencyFormatter,
  adminDateFormatter,
  adminSurfaceClassName,
  EmptyState,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  recentOrders: AdminOverviewData["recentOrders"];
};

export default function AdminRecentOrdersSection({ recentOrders }: Props) {
  return (
    <div className={cn(adminSurfaceClassName, "p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-shop_btn_dark_green" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Execution
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Commandes recentes
            </h2>
          </div>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:border-shop_light_green/30 hover:bg-shop_light_green/10"
        >
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {recentOrders.length ? (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[24px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.22)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{order.customerName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    #{order.orderNumber.slice(-8).toUpperCase()} ·{" "}
                    {adminDateFormatter.format(order.orderDate)}
                  </p>
                </div>
                <StatusPill value={order.adminStage} />
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-600">
                    {order.items[0]?.name || "Commande multi-produits"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{order.itemsCount} article(s)</p>
                </div>
                <p className="text-base font-semibold text-slate-950">
                  {adminCurrencyFormatter.format(order.totalPrice)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{order.email}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{order.paymentMethod}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2">
            <EmptyState
              title="Aucune commande recente"
              description="Les nouvelles ventes apparaitront ici automatiquement."
            />
          </div>
        )}
      </div>
    </div>
  );
}
