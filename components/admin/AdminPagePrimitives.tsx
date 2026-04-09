import type { ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export const adminCurrencyFormatter = new Intl.NumberFormat("fr-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 2,
});

export const adminDateFormatter = new Intl.DateTimeFormat("fr-MA", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const adminSurfaceClassName =
  "rounded-[30px] border border-white/75 bg-white/92 shadow-[0_26px_80px_-56px_rgba(15,23,42,0.42)] backdrop-blur";

export const adminSelectClassName =
  "flex h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-shop_btn_dark_green focus:ring-4 focus:ring-shop_light_green/15";

export const formatDateInput = (value: Date | null) =>
  value ? value.toISOString().slice(0, 10) : "";

export const formatLabel = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatTier = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const getStatusTone = (value: string) => {
  if (["delivered", "paid", "featured", "sale", "active"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (["pending", "confirmed", "preparing", "shipped", "partial", "expiring"].includes(value)) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  if (["cancelled", "failed", "inactive", "out"].includes(value)) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
};

export function Field({
  label,
  htmlFor,
  helper,
  children,
}: {
  label: string;
  htmlFor?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
        {label}
      </label>
      {children}
      {helper ? <p className="text-xs leading-5 text-slate-500">{helper}</p> : null}
    </div>
  );
}

export function StatusPill({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        getStatusTone(value)
      )}
    >
      {label || formatLabel(value)}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone: string;
}) {
  return (
    <div
      className={cn(
        adminSurfaceClassName,
        "group overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_34px_80px_-56px_rgba(15,23,42,0.45)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-300 group-hover:-translate-y-0.5",
            tone
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

export function MediaThumb({
  src,
  alt,
  icon: Icon,
}: {
  src: string | null;
  alt: string;
  icon: LucideIcon;
}) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50">
      {src ? (
        <Image
          src={resolveImageUrl(src)}
          alt={alt}
          fill
          unoptimized
          sizes="5rem"
          className="object-contain p-2"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-300">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

export function AdminPageHero({
  badge,
  title,
  description,
  actions,
  aside,
}: {
  badge: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_32px_-16px_rgba(15,23,42,0.12)]">
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
        <div>
          <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
            {badge}
          </Badge>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
          {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? (
          <div className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-5">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  badge,
  title,
  description,
  action,
}: {
  badge: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
          {badge}
        </Badge>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function QuickLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/75 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-shop_btn_dark_green/20 hover:bg-white hover:shadow-[0_22px_40px_-34px_rgba(15,23,42,0.25)]"
    >
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-shop_btn_dark_green transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
