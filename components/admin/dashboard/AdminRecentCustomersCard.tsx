import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminCurrencyFormatter,
  adminSurfaceClassName,
  EmptyState,
  formatTier,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  recentCustomers: AdminOverviewData["recentCustomers"];
};

export default function AdminRecentCustomersCard({ recentCustomers }: Props) {
  return (
    <div className={cn(adminSurfaceClassName, "p-6")}>
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-shop_btn_dark_green" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Clients
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Profils recents
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {recentCustomers.length ? (
          recentCustomers.slice(0, 4).map((customer) => (
            <div
              key={customer.id}
              className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{customer.fullName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{customer.email}</p>
                </div>
                <StatusPill value={customer.loyaltyTier} label={formatTier(customer.loyaltyTier)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200">
                  {customer.orderCount} commande(s)
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200">
                  {adminCurrencyFormatter.format(customer.totalSpent)}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200">
                  {customer.loyaltyPoints} pts
                </span>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="Aucun profil actif"
            description="Les profils clients apparaitront ici apres les premieres commandes."
          />
        )}
      </div>
    </div>
  );
}
