import Link from "next/link";
import {
  AlertTriangle,
  CircleDollarSign,
  Package2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  AdminPageHero,
  adminCurrencyFormatter,
} from "@/components/admin/AdminPagePrimitives";
import AdminCommercePulseSection from "@/components/admin/dashboard/AdminCommercePulseSection";
import AdminKpiCards, { type KpiCard } from "@/components/admin/dashboard/AdminKpiCards";
import AdminLowStockCard from "@/components/admin/dashboard/AdminLowStockCard";
import AdminRecentCustomersCard from "@/components/admin/dashboard/AdminRecentCustomersCard";
import AdminRecentOrdersSection from "@/components/admin/dashboard/AdminRecentOrdersSection";
import AdminShortcutsCard from "@/components/admin/dashboard/AdminShortcutsCard";
import { getAdminOverviewData } from "@/lib/admin-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// ─── helpers ──────────────────────────────────────────────────────────────────

const compactFmt = new Intl.NumberFormat("fr-MA", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

const getWindowChange = (values: number[]) => {
  const mid = Math.ceil(values.length / 2);
  const prev = sum(values.slice(0, mid));
  const curr = sum(values.slice(mid));
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

const signedPct = (v: number) => {
  const r = Math.round(v);
  return r > 0 ? `+${r}%` : `${r}%`;
};

const trendCn = (v: number, invert = false) => {
  if (v === 0) return "bg-slate-100 text-slate-700 ring-slate-200";
  const good = invert ? v < 0 : v > 0;
  return good
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
};

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
};

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [resolvedParams, data] = await Promise.all([
    searchParams,
    getAdminOverviewData(),
  ]);

  const statusMessage = getParam(resolvedParams, "status");
  const errorMessage  = getParam(resolvedParams, "error");

  // ── derived series values ──
  const revenueTrend    = getWindowChange(data.revenueSeries.map((p) => p.revenue));
  const orderTrend      = getWindowChange(data.revenueSeries.map((p) => p.orders));
  const latestWeekSeries = data.revenueSeries.slice(-7);
  const latestWeekRevenue = sum(latestWeekSeries.map((p) => p.revenue));
  const latestWeekOrders  = sum(latestWeekSeries.map((p) => p.orders));
  const latestWeekLabel =
    latestWeekSeries[0] && latestWeekSeries[latestWeekSeries.length - 1]
      ? `${latestWeekSeries[0].label} -> ${latestWeekSeries[latestWeekSeries.length - 1].label}`
      : "Semaine glissante";

  // ── derived metrics ──
  const { metrics } = data;
  const openRate       = metrics.totalOrders ? (metrics.pendingOrders / metrics.totalOrders) * 100 : 0;
  const stockPressure  = metrics.totalProducts ? (metrics.lowStockProducts / metrics.totalProducts) * 100 : 0;
  const alertsCount    = metrics.lowStockProducts + metrics.expiringPromoCodes;
  const revenuePerCat  = metrics.totalCategories ? metrics.totalProducts / metrics.totalCategories : 0;

  // ── KPI cards ──
  const kpiCards: readonly KpiCard[] = [
    {
      label: "Revenus encaisses",
      value: adminCurrencyFormatter.format(metrics.totalRevenue),
      note:  `${signedPct(revenueTrend)} vs 7 jours precedents`,
      helper: `${adminCurrencyFormatter.format(latestWeekRevenue)} sur la derniere fenetre.`,
      icon:  CircleDollarSign,
      accent: "from-[#1677ff]/16 via-[#1677ff]/5 to-transparent border-sky-100/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,246,255,0.88))]",
      iconTone: "bg-[#1677ff] text-white shadow-[0_18px_34px_-16px_rgba(22,119,255,0.55)]",
      badgeClassName: trendCn(revenueTrend),
    },
    {
      label: "Commandes ouvertes",
      value: compactFmt.format(metrics.pendingOrders),
      note:  `${Math.round(openRate)}% du volume total`,
      helper: `${latestWeekOrders} commandes creees sur les 7 derniers jours.`,
      icon:  ShoppingBag,
      accent: "from-[#11b8a5]/18 via-[#11b8a5]/6 to-transparent border-teal-100/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(240,253,250,0.92))]",
      iconTone: "bg-[#11b8a5] text-white shadow-[0_18px_34px_-16px_rgba(17,184,165,0.52)]",
      badgeClassName: trendCn(orderTrend),
    },
    {
      label: "Catalogue actif",
      value: compactFmt.format(metrics.totalProducts),
      note:  `${metrics.totalCategories} categories · ${metrics.totalBrands} marques`,
      helper: `${revenuePerCat.toFixed(1)} produits par categorie en moyenne.`,
      icon:  Package2,
      accent: "from-[#7c69ee]/18 via-[#7c69ee]/6 to-transparent border-violet-100/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,243,255,0.92))]",
      iconTone: "bg-[#7c69ee] text-white shadow-[0_18px_34px_-16px_rgba(124,105,238,0.52)]",
      badgeClassName: "bg-violet-50 text-violet-700 ring-violet-200",
    },
    {
      label: "Points de vigilance",
      value: compactFmt.format(alertsCount),
      note:  `${metrics.lowStockProducts} stock faible · ${metrics.expiringPromoCodes} promos proches`,
      helper: `${Math.round(stockPressure)}% du catalogue est en surveillance stock.`,
      icon:  AlertTriangle,
      accent: "from-[#f59e0b]/16 via-[#ef4444]/5 to-transparent border-amber-100/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,251,235,0.92))]",
      iconTone: "bg-[#f59e0b] text-white shadow-[0_18px_34px_-16px_rgba(245,158,11,0.5)]",
      badgeClassName: alertsCount > 0
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  ] as const;

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* ─── Hero ─── */}
      <AdminPageHero
        badge="Admin premium"
        title="Un dashboard plus net, plus clinique et vraiment pilote par la data."
        description="Zayna garde sa structure admin existante, mais l'accueil devient une vraie console de supervision: revenus, commandes, stock sensible, promos et profils clients sont lisibles en quelques secondes."
        actions={
          <>
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-2xl bg-shop_btn_dark_green px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Ouvrir les commandes
            </Link>
            <Link
              href="/admin/products#new-product"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Ajouter un produit
            </Link>
            <Link
              href="/admin/promos#new-promo"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Lancer une promo
            </Link>
          </>
        }
        aside={
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-shop_btn_dark_green" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Capteurs prioritaires
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              <div className="rounded-[24px] border border-slate-200 bg-slate-100 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">A traiter</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.pendingOrders}</p>
                <p className="mt-2 text-xs text-slate-500">Commandes encore en circuit operatoire.</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-100 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Stock sensible</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.lowStockProducts}</p>
                <p className="mt-2 text-xs text-slate-500">Produits a reapprovisionner rapidement.</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-100 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Promos proches</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.expiringPromoCodes}</p>
                <p className="mt-2 text-xs text-slate-500">Codes promo a verifier cette semaine.</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Cadence recente</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{latestWeekLabel}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                    orderTrend >= 0
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  {signedPct(orderTrend)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {latestWeekOrders} commandes creees et{" "}
                {adminCurrencyFormatter.format(latestWeekRevenue)} encaisses sur la fenetre
                glissante la plus recente.
              </p>
            </div>
          </div>
        }
      />

      {/* ─── Alert banners ─── */}
      {statusMessage && (
        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      )}

      {/* ─── KPI cards ─── */}
      <AdminKpiCards cards={kpiCards} />

      {/* ─── Commerce pulse (chart + stage ring + top products) ─── */}
      <AdminCommercePulseSection
        revenueSeries={data.revenueSeries}
        orderStageBreakdown={data.orderStageBreakdown}
        topProducts={data.topProducts}
        latestWeekLabel={latestWeekLabel}
      />

      {/* ─── Recent orders + right panel ─── */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
        <AdminRecentOrdersSection recentOrders={data.recentOrders} />

        <div className="space-y-6">
          <AdminLowStockCard lowStockItems={data.lowStockItems} />
          <AdminRecentCustomersCard recentCustomers={data.recentCustomers} />
          <AdminShortcutsCard />
        </div>
      </section>
    </div>
  );
}
