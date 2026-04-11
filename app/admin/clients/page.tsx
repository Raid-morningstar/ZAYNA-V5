import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  AdminPageHero,
  MetricCard,
  adminCurrencyFormatter,
  adminSurfaceClassName,
} from "@/components/admin/AdminPagePrimitives";
import { TIER_LABELS, TIER_THRESHOLDS } from "@/lib/loyalty";
import { Crown, Medal, Search, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LoyaltyTier } from "@prisma/client";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const TIER_STYLE: Record<LoyaltyTier, { badge: string; icon: React.ElementType; ring: string }> = {
  bronze: { badge: "bg-amber-50 text-amber-700 ring-amber-200",    icon: Shield, ring: "ring-amber-200/60"  },
  silver: { badge: "bg-slate-100 text-slate-600 ring-slate-300",   icon: Medal,  ring: "ring-slate-200/60"  },
  gold:   { badge: "bg-yellow-50 text-yellow-700 ring-yellow-300", icon: Crown,  ring: "ring-yellow-300/60" },
};

async function getClientsData(search?: string, tier?: string) {
  await requireAdmin();

  const whereSearch = search
    ? {
        OR: [
          { fullName:          { contains: search, mode: "insensitive" as const } },
          { email:             { contains: search, mode: "insensitive" as const } },
          { loyaltyCardNumber: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const whereTier = tier && ["bronze", "silver", "gold"].includes(tier)
    ? { loyaltyTier: tier as LoyaltyTier }
    : {};

  const [users, totals] = await Promise.all([
    prisma.user.findMany({
      where: { ...whereSearch, ...whereTier },
      select: {
        id:                true,
        fullName:          true,
        email:             true,
        loyaltyCardNumber: true,
        loyaltyPoints:     true,
        loyaltyTier:       true,
        createdAt:         true,
        _count: { select: { orders: true } },
        orders: {
          select: {
            totalPrice:    true,
            orderDate:     true,
            orderNumber:   true,
            status:        true,
            paymentStatus: true,
          },
          orderBy: { orderDate: "desc" },
        },
      },
      orderBy: { loyaltyPoints: "desc" },
      take: 100,
    }),
    prisma.user.groupBy({
      by: ["loyaltyTier"],
      _count: { id: true },
    }),
  ]);

  const totalByTier = Object.fromEntries(
    totals.map((t) => [t.loyaltyTier, t._count.id])
  ) as Partial<Record<LoyaltyTier, number>>;

  const mapped = users.map((u) => {
    // Only count orders that are delivered AND paid
    const settledOrders = u.orders.filter(
      (o) => o.status === "delivered" && o.paymentStatus === "paid"
    );
    return {
      ...u,
      orderCount:   u._count.orders,
      totalSpent:   settledOrders.reduce((s, o) => s + Number(o.totalPrice), 0),
      lastOrderAt:  u.orders[0]?.orderDate ?? null,
    };
  });

  return {
    clients:       mapped,
    totalClients:  (totalByTier.bronze ?? 0) + (totalByTier.silver ?? 0) + (totalByTier.gold ?? 0),
    goldClients:   totalByTier.gold   ?? 0,
    silverClients: totalByTier.silver ?? 0,
  };
}

export default async function AdminClientsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = typeof params.q    === "string" ? params.q.trim()    : undefined;
  const tier   = typeof params.tier === "string" ? params.tier.trim() : undefined;

  const { clients, totalClients, goldClients, silverClients } =
    await getClientsData(search, tier);

  const totalPointsDistributed = clients.reduce((s, c) => s + c.loyaltyPoints, 0);

  const dateFormatter = new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminPageHero
        badge="Clients"
        title="Programme de fidélité et profils clients"
        description="Consultez les points accumulés, le tier de chaque client et son historique. Règle : 100 MAD dépensés = 10 points. À partir de 600 points, le client passe Gold et bénéficie d'avantages exclusifs. Les points et le total dépensé sont mis à jour uniquement quand la commande est livrée et payée."
        aside={
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Synthèse fidélité
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: "Total clients",     value: totalClients,                                    color: "text-shop_btn_dark_green" },
                { label: "Gold",              value: goldClients,                                     color: "text-yellow-600"          },
                { label: "Argent",            value: silverClients,                                   color: "text-slate-500"           },
                { label: "Points distribués", value: totalPointsDistributed.toLocaleString("fr-MA"), color: "text-shop_light_green"    },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className={cn("text-xl font-bold", color)}>{value}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </>
        }
      />

      {/* Loyalty rule banner */}
      <div className="flex flex-wrap items-center gap-4 rounded-[22px] border border-yellow-200/80 bg-gradient-to-r from-yellow-50 to-amber-50/60 px-5 py-4 shadow-sm">
        <Crown className="h-5 w-5 shrink-0 text-yellow-500" />
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span className="font-semibold text-yellow-800">Règle fidélité :</span>
          <span className="text-yellow-700"><strong>100 MAD</strong> dépensés = <strong>10 points</strong></span>
          <span className="text-amber-700"><strong>300 points</strong> → Tier Argent</span>
          <span className="font-semibold text-yellow-700"><strong>600 points</strong> → Tier Gold 🏆 (avantages VIP)</span>
          <span className="text-slate-500 italic">Points crédités à la livraison uniquement</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          icon={Users}  label="Total clients"
          value={String(totalClients)}
          helper="Comptes enregistrés"
          tone="bg-shop_btn_dark_green/8 text-shop_btn_dark_green ring-shop_btn_dark_green/20"
        />
        <MetricCard
          icon={Crown}  label="Clients Gold"
          value={String(goldClients)}
          helper="≥ 600 points · VIP"
          tone="bg-yellow-50 text-yellow-600 ring-yellow-200"
        />
        <MetricCard
          icon={Medal}  label="Clients Argent"
          value={String(silverClients)}
          helper="300 – 599 points"
          tone="bg-slate-100 text-slate-500 ring-slate-200"
        />
        <MetricCard
          icon={Star}   label="Points distribués"
          value={totalPointsDistributed.toLocaleString("fr-MA")}
          helper="Total cumulé · livrés"
          tone="bg-shop_light_green/10 text-shop_light_green ring-shop_light_green/20"
        />
      </div>

      {/* Search + filter */}
      <div className={cn(adminSurfaceClassName, "p-5")}>
        <form method="GET" className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Rechercher par nom, email, carte…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-shop_btn_dark_green focus:ring-4 focus:ring-shop_light_green/15"
            />
          </div>

          <div className="flex gap-2">
            {([undefined, "bronze", "silver", "gold"] as const).map((t) => {
              const active = (tier ?? "") === (t ?? "");
              return (
                <Link
                  key={t ?? "all"}
                  href={`/admin/clients?${new URLSearchParams({
                    ...(search ? { q: search } : {}),
                    ...(t ? { tier: t } : {}),
                  }).toString()}`}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                    active
                      ? "border-shop_btn_dark_green bg-shop_btn_dark_green text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {t ? TIER_LABELS[t] : "Tous"}
                </Link>
              );
            })}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-shop_btn_dark_green px-4 py-2.5 text-xs font-semibold text-white hover:bg-shop_btn_dark_green/90"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Clients list */}
      <div className={cn(adminSurfaceClassName, "overflow-hidden")}>
        <div className="border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-semibold text-slate-700">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
            {search ? ` pour « ${search} »` : ""}
            {tier ? ` · ${TIER_LABELS[tier as LoyaltyTier]}` : ""}
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {clients.map((client) => {
              const style    = TIER_STYLE[client.loyaltyTier];
              const TierIcon = style.icon;
              const initials = client.fullName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const nextThreshold =
                client.loyaltyTier === "bronze" ? TIER_THRESHOLDS.silver :
                client.loyaltyTier === "silver" ? TIER_THRESHOLDS.gold   : null;
              const prevThreshold =
                client.loyaltyTier === "silver" ? TIER_THRESHOLDS.silver :
                client.loyaltyTier === "gold"   ? TIER_THRESHOLDS.gold   : 0;
              const progressPct = nextThreshold
                ? Math.min(100, Math.round(
                    ((client.loyaltyPoints - prevThreshold) /
                      (nextThreshold - prevThreshold)) * 100
                  ))
                : 100;

              return (
                <div
                  key={client.id}
                  className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/60"
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ring-2",
                      client.loyaltyTier === "gold"
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white ring-yellow-300/60"
                        : client.loyaltyTier === "silver"
                        ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white ring-slate-200/60"
                        : "bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-amber-200/60"
                    )}
                  >
                    {initials}
                  </div>

                  {/* Identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{client.fullName}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                          style.badge
                        )}
                      >
                        <TierIcon className="h-3 w-3" />
                        {TIER_LABELS[client.loyaltyTier]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{client.email}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                      Carte : {client.loyaltyCardNumber}
                    </p>
                  </div>

                  {/* Points + progress bar */}
                  <div className="hidden w-36 sm:block">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-shop_btn_dark_green">
                        {client.loyaltyPoints.toLocaleString("fr-MA")} pts
                      </span>
                      {nextThreshold && (
                        <span className="text-[10px] text-slate-400">/ {nextThreshold}</span>
                      )}
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          client.loyaltyTier === "gold"   ? "bg-yellow-400" :
                          client.loyaltyTier === "silver" ? "bg-slate-400"  : "bg-amber-500"
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats — delivered + paid only */}
                  <div className="hidden gap-6 text-center md:flex">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{client.orderCount}</p>
                      <p className="text-[10px] text-slate-400">commandes</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {adminCurrencyFormatter.format(client.totalSpent)}
                      </p>
                      <p className="text-[10px] text-slate-400">dépensé (livré)</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {client.lastOrderAt
                          ? dateFormatter.format(new Date(client.lastOrderAt))
                          : "—"}
                      </p>
                      <p className="text-[10px] text-slate-400">dernière commande</p>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-shop_btn_dark_green hover:text-shop_btn_dark_green"
                  >
                    Voir le profil →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
