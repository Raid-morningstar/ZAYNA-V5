import Link from "next/link";
import { AlertTriangle, ArrowRight, Package2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  adminDateFormatter,
  adminSurfaceClassName,
  EmptyState,
  MediaThumb,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  lowStockItems: AdminOverviewData["lowStockItems"];
  inventorySummary: AdminOverviewData["inventorySummary"];
};

export default function AdminLowStockCard({
  lowStockItems,
  inventorySummary,
}: Props) {
  return (
    <div className={cn(adminSurfaceClassName, "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-shop_btn_dark_green" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Inventaire
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
              Alertes stock
            </h2>
          </div>
        </div>

        <Link
          href="/admin/products?stock=low#products-list"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:bg-slate-50"
        >
          Inventaire
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
          <p className="text-xs font-semibold text-rose-700">Rupture</p>
          <p className="mt-1 text-2xl font-semibold text-rose-950">
            {inventorySummary.outOfStock}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-700">Stock faible</p>
          <p className="mt-1 text-2xl font-semibold text-amber-950">
            {inventorySummary.lowStock}
          </p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3">
          <p className="text-xs font-semibold text-orange-700">Critique</p>
          <p className="mt-1 text-2xl font-semibold text-orange-950">
            {inventorySummary.criticalStock}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {lowStockItems.length ? (
          lowStockItems.map((item) => {
            const progress = Math.max(Math.round((item.stock / 5) * 100), item.stock > 0 ? 14 : 5);

            return (
              <Link
                key={item.id}
                href={`/admin/products?stock=${item.stock === 0 ? "out" : "low"}#products-list`}
                className="block rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4 transition-colors hover:border-shop_light_green/40 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <MediaThumb src={item.imageUrl} alt={item.name} icon={Package2} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate font-medium text-slate-900">{item.name}</p>
                      <StatusPill
                        value={item.stock === 0 ? "out" : "pending"}
                        label={item.stock === 0 ? "Rupture" : `${item.stock} restant(s)`}
                      />
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.stock === 0
                            ? "bg-rose-500"
                            : item.stock <= 2
                              ? "bg-orange-500"
                              : "bg-amber-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Dernier reapprovisionnement:{" "}
                      {item.lastRestockedAt
                        ? adminDateFormatter.format(item.lastRestockedAt)
                        : "non renseigne"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <EmptyState
            title="Stock confortable"
            description="Tous les produits ont actuellement un niveau de stock sain."
          />
        )}
      </div>
    </div>
  );
}
