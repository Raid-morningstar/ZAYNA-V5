"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";

import { adminSelectClassName } from "@/components/admin/AdminPagePrimitives";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  filters: AdminOverviewData["filters"];
  options: AdminOverviewData["filterOptions"];
};

const labelize = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AdminDashboardFilters({ filters, options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isDefault =
      (name === "range" && value === "last_30_days") ||
      (name !== "range" && value === "all");

    if (!value || isDefault) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    if (name === "range" && value !== "custom") {
      params.delete("from");
      params.delete("to");
    }

    router.replace(params.toString() ? `/admin?${params.toString()}` : "/admin", {
      scroll: false,
    });
  };

  const updateCustomDate = (name: "from" | "to", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("range", "custom");
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`/admin?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_46px_-40px_rgba(15,23,42,0.32)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex items-center gap-2 xl:w-44">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Filter className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Filtres
            </p>
            <p className="text-sm font-semibold text-slate-950">Dashboard global</p>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Periode</span>
            <select
              value={filters.dateRange}
              onChange={(event) => updateParam("range", event.target.value)}
              className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
            >
              {options.dateRanges.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Debut</span>
            <Input
              type="date"
              value={filters.from}
              onChange={(event) => updateCustomDate("from", event.target.value)}
              className="h-10 rounded-xl border-slate-200 bg-white"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Fin</span>
            <Input
              type="date"
              value={filters.to}
              onChange={(event) => updateCustomDate("to", event.target.value)}
              className="h-10 rounded-xl border-slate-200 bg-white"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Commande</span>
            <select
              value={filters.orderStatus}
              onChange={(event) => updateParam("orderStatus", event.target.value)}
              className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
            >
              {options.orderStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "all" ? option.label : labelize(option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Paiement</span>
            <select
              value={filters.paymentStatus}
              onChange={(event) => updateParam("paymentStatus", event.target.value)}
              className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
            >
              {options.paymentStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "all" ? option.label : labelize(option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Livraison</span>
            <select
              value={filters.deliveryStatus}
              onChange={(event) => updateParam("deliveryStatus", event.target.value)}
              className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
            >
              {options.deliveryStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "all" ? option.label : labelize(option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Categorie</span>
            <select
              value={filters.categoryId}
              onChange={(event) => updateParam("categoryId", event.target.value)}
              className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
            >
              <option value="all">Toutes</option>
              {options.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reinitialiser
        </Link>
      </div>
    </section>
  );
}
