import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  adminCurrencyFormatter,
  adminSurfaceClassName,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import {
  TIER_LABELS,
  TIER_BENEFITS,
  getPointsToNextTier,
} from "@/lib/loyalty";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Crown,
  CreditCard,
  Medal,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LoyaltyTier } from "@prisma/client";

type Props = { params: Promise<{ id: string }> };

const TIER_STYLE: Record<
  LoyaltyTier,
  { gradient: string; text: string; icon: React.ElementType; ring: string; bar: string }
> = {
  bronze: {
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    text:     "text-amber-100",
    icon:     Shield,
    ring:     "ring-amber-300/40",
    bar:      "bg-amber-500",
  },
  silver: {
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    text:     "text-slate-100",
    icon:     Medal,
    ring:     "ring-slate-300/40",
    bar:      "bg-slate-400",
  },
  gold: {
    gradient: "from-yellow-400 via-amber-400 to-yellow-500",
    text:     "text-yellow-900",
    icon:     Crown,
    ring:     "ring-yellow-300/60",
    bar:      "bg-yellow-400",
  },
};

async function getClientDetail(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id:                  true,
      fullName:            true,
      email:               true,
      loyaltyCardNumber:   true,
      loyaltyPoints:       true,
      loyaltyTier:         true,
      installmentsEligible: true,
      createdAt:           true,
      orders: {
        select: {
          id:            true,
          orderNumber:   true,
          status:        true,
          paymentStatus: true,
          paymentMethod: true,
          totalPrice:    true,
          orderDate:     true,
          shippingCity:  true,
          items: {
            select: {
              productNameSnapshot: true,
              quantity:            true,
              productPriceSnapshot: true,
            },
            take: 3,
          },
        },
        orderBy: { orderDate: "desc" },
      },
    },
  });

  if (!user) notFound();

  // Only count orders that are delivered AND paid
  const settledOrders = user.orders.filter(
    (o) => o.status === "delivered" && o.paymentStatus === "paid"
  );
  const totalSpent = settledOrders.reduce((s, o) => s + Number(o.totalPrice), 0);
  const avgOrder   = settledOrders.length ? totalSpent / settledOrders.length : 0;
  const paidOrders = settledOrders.length;

  return { user, totalSpent, avgOrder, paidOrders };
}

export default async function AdminClientDetailPage({ params }: Props) {
  const { id } = await params;
  const { user, totalSpent, avgOrder, paidOrders } = await getClientDetail(id);

  const style   = TIER_STYLE[user.loyaltyTier];
  const TierIcon = style.icon;
  const { nextTier, pointsNeeded, progressPct } = getPointsToNextTier(user.loyaltyPoints);
  const benefits = TIER_BENEFITS[user.loyaltyTier];

  const dateFormatter = new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-shop_btn_dark_green"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux clients
      </Link>

      {/* ── LOYALTY CARD (visual) ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] bg-gradient-to-br p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] ring-2",
            style.gradient,
            style.ring
          )}
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />

          {/* Top row */}
          <div className="relative flex items-start justify-between">
            <div>
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.22em] opacity-70", style.text)}>
                Zayna Parapharmacie
              </p>
              <p className={cn("mt-1 text-[11px] uppercase tracking-wider opacity-60", style.text)}>
                Carte de fidélité
              </p>
            </div>
            <div className={cn("flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-1.5", style.text)}>
              <TierIcon className="h-4 w-4" />
              <span className="text-sm font-bold">{TIER_LABELS[user.loyaltyTier]}</span>
            </div>
          </div>

          {/* Avatar + name */}
          <div className="relative mt-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/25 text-2xl font-black text-white">
              {initials}
            </div>
            <div>
              <p className={cn("text-xl font-bold", style.text)}>{user.fullName}</p>
              <p className={cn("text-xs opacity-70", style.text)}>{user.email}</p>
            </div>
          </div>

          {/* Card number + points */}
          <div className="relative mt-8 flex items-end justify-between">
            <div>
              <p className={cn("font-mono text-lg font-bold tracking-[0.2em]", style.text)}>
                {user.loyaltyCardNumber}
              </p>
              <p className={cn("mt-1 text-[11px] uppercase tracking-wider opacity-60", style.text)}>
                Numéro de carte
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-3xl font-black", style.text)}>
                {user.loyaltyPoints.toLocaleString("fr-MA")}
              </p>
              <p className={cn("text-[11px] uppercase tracking-wider opacity-60", style.text)}>
                points
              </p>
            </div>
          </div>

          {/* Member since */}
          <div className={cn("relative mt-6 border-t border-white/20 pt-4 text-[11px] opacity-60", style.text)}>
            Membre depuis {dateFormatter.format(new Date(user.createdAt))}
          </div>
        </div>

        {/* Tier progress + benefits */}
        <div className="space-y-4">
          {/* Progress */}
          <div className={cn(adminSurfaceClassName, "p-5")}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Progression vers le prochain palier
            </p>

            <div className="mt-4">
              {nextTier ? (
                <>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">
                      {TIER_LABELS[user.loyaltyTier]}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {TIER_LABELS[nextTier]}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full transition-all", style.bar)}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Plus que{" "}
                    <strong className="text-shop_btn_dark_green">
                      {pointsNeeded} points
                    </strong>{" "}
                    pour atteindre le tier{" "}
                    <strong>{TIER_LABELS[nextTier]}</strong>
                    {" "}(≈ {Math.ceil(pointsNeeded / 10) * 100} MAD d'achat)
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl bg-yellow-50 px-4 py-3">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm font-semibold text-yellow-800">
                    Tier Gold atteint — avantages VIP actifs
                  </p>
                </div>
              )}
            </div>

            {/* Rule reminder */}
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-500">Règle fidélité</p>
              <p className="mt-0.5 text-xs text-slate-600">
                <strong>100 MAD</strong> dépensés = <strong>10 points</strong> •{" "}
                <strong className="text-yellow-700">600 pts = Gold</strong>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className={cn(adminSurfaceClassName, "p-5")}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <Award className="h-3.5 w-3.5" />
              Avantages {TIER_LABELS[user.loyaltyTier]}
            </p>
            <ul className="mt-3 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-shop_light_green" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Commandes", value: user.orders.length, icon: ShoppingBag },
          { label: "Payées",    value: paidOrders,          icon: CreditCard   },
          { label: "Total dépensé", value: adminCurrencyFormatter.format(totalSpent), icon: TrendingUp },
          { label: "Panier moyen",  value: adminCurrencyFormatter.format(avgOrder),   icon: Package    },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={cn(adminSurfaceClassName, "flex items-center gap-3 p-5")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-shop_btn_dark_green/8 text-shop_btn_dark_green">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Orders history ── */}
      <div className={cn(adminSurfaceClassName, "overflow-hidden")}>
        <div className="border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-semibold text-slate-700">Historique des commandes</p>
        </div>

        {user.orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <ShoppingBag className="h-8 w-8 opacity-30" />
            <p className="text-sm">Aucune commande</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {user.orders.map((order) => {
              const itemsSummary = order.items
                .map((i) => `${i.productNameSnapshot} ×${i.quantity}`)
                .join(", ");
              const more = (order.items.length === 3 && order.items.length < 4) ? "…" : "";

              return (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-slate-50/60"
                >
                  {/* Order number */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/orders?order=${order.orderNumber}`}
                        className="font-mono text-xs font-semibold text-shop_btn_dark_green hover:underline"
                      >
                        #{order.orderNumber.slice(-8).toUpperCase()}
                      </Link>
                      <StatusPill value={order.status} />
                      <StatusPill value={order.paymentStatus} />
                    </div>
                    {itemsSummary && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {itemsSummary}{more}
                      </p>
                    )}
                    {order.shippingCity && (
                      <p className="text-[11px] text-slate-400">{order.shippingCity}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {dateFormatter.format(new Date(order.orderDate))}
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {adminCurrencyFormatter.format(Number(order.totalPrice))}
                    </p>
                    <p className="text-[11px] text-shop_light_green">
                      +{Math.floor(Number(order.totalPrice) / 100) * 10} pts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
