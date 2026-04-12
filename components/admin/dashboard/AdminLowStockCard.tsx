import { AlertTriangle, Package2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminSurfaceClassName,
  EmptyState,
  MediaThumb,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  lowStockItems: AdminOverviewData["lowStockItems"];
};

export default function AdminLowStockCard({ lowStockItems }: Props) {
  return (
    <div className={cn(adminSurfaceClassName, "p-6")}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-shop_btn_dark_green" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Surveillance
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Stock faible
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {lowStockItems.length ? (
          lowStockItems.map((item) => {
            const progress = Math.max(Math.round((item.stock / 5) * 100), item.stock > 0 ? 16 : 6);

            return (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4"
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
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
