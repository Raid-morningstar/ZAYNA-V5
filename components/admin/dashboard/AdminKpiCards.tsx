import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

import {
  adminCurrencyFormatter,
  adminSurfaceClassName,
} from "@/components/admin/AdminPagePrimitives";
import { cn } from "@/lib/utils";
import type { AdminOverviewData, DashboardKpi } from "@/lib/admin-pages";

type Props = {
  groups: AdminOverviewData["businessKpis"];
};

const numberFormatter = new Intl.NumberFormat("fr-MA");

const groupLabels = {
  financial: "Financier",
  orders: "Commandes",
  performance: "Performance",
} as const;

const toneClassName = {
  success: "border-emerald-100 bg-emerald-50/65",
  warning: "border-amber-100 bg-amber-50/65",
  danger: "border-rose-100 bg-rose-50/65",
  info: "border-sky-100 bg-sky-50/65",
  neutral: "border-slate-200 bg-slate-50/70",
} as const;

const toneTextClassName = {
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
  info: "text-sky-700",
  neutral: "text-slate-700",
} as const;

const formatDuration = (hours: number) => {
  if (hours <= 0) return "0h";
  if (hours < 24) return `${numberFormatter.format(Number(hours.toFixed(1)))}h`;
  return `${numberFormatter.format(Number((hours / 24).toFixed(1)))}j`;
};

const formatValue = (kpi: DashboardKpi) => {
  if (kpi.format === "currency") {
    return adminCurrencyFormatter.format(kpi.value);
  }

  if (kpi.format === "percent") {
    return `${numberFormatter.format(Number(kpi.value.toFixed(1)))}%`;
  }

  if (kpi.format === "duration") {
    return formatDuration(kpi.value);
  }

  return numberFormatter.format(Math.round(kpi.value));
};

const getTrendTone = (kpi: DashboardKpi) => {
  if (Math.round(kpi.changePct) === 0) {
    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  const isGood = kpi.invertTrend ? kpi.changePct < 0 : kpi.changePct > 0;

  return isGood
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
};

const TrendIcon = ({ kpi }: { kpi: DashboardKpi }) => {
  if (Math.round(kpi.changePct) === 0) {
    return <ArrowRight className="h-3.5 w-3.5" />;
  }

  return kpi.changePct > 0 ? (
    <ArrowUpRight className="h-3.5 w-3.5" />
  ) : (
    <ArrowDownRight className="h-3.5 w-3.5" />
  );
};

const MiniTrend = ({ values, tone }: { values: number[]; tone: DashboardKpi["tone"] }) => {
  const points = values.length ? values : [0];
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = Math.max(max - min, 1);
  const width = 116;
  const height = 34;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const path = points
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 6) - 3;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        className={toneTextClassName[tone]}
      />
    </svg>
  );
};

export default function AdminKpiCards({ groups }: Props) {
  return (
    <section className="space-y-4">
      {(Object.keys(groupLabels) as Array<keyof typeof groupLabels>).map((groupKey) => (
        <div key={groupKey} className={cn(adminSurfaceClassName, "p-4 md:p-5")}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <BarChart3 className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-950">
                KPI {groupLabels[groupKey]}
              </h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {groups[groupKey].map((kpi) => (
              <article
                key={`${groupKey}-${kpi.label}`}
                className={cn("rounded-[18px] border p-4", toneClassName[kpi.tone])}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {kpi.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      {formatValue(kpi)}
                    </p>
                  </div>
                  <MiniTrend values={kpi.trend} tone={kpi.tone} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                      getTrendTone(kpi)
                    )}
                  >
                    <TrendIcon kpi={kpi} />
                    {kpi.changePct > 0 ? "+" : ""}
                    {numberFormatter.format(Math.round(kpi.changePct))}%
                  </span>
                  <span className="text-xs text-slate-500">
                    prec. {formatValue({ ...kpi, value: kpi.previousValue })}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-600">{kpi.helper}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
