import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  PackageX,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  alerts: AdminOverviewData["operationalAlerts"];
};

const toneClassName = {
  danger: "border-rose-200 bg-rose-50 text-rose-950 hover:border-rose-300",
  warning: "border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-300",
  info: "border-sky-200 bg-sky-50 text-sky-950 hover:border-sky-300",
} as const;

const iconClassName = {
  danger: "bg-rose-100 text-rose-700",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  info: "bg-sky-100 text-sky-700",
} as const;

const iconByKey = {
  orders: AlertTriangle,
  stock: PackageX,
  payments: CreditCard,
  deliveries: Truck,
} as const;

export default function AdminOperationalAlerts({ alerts }: Props) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {alerts.map((alert) => {
        const Icon = alert.value > 0 ? iconByKey[alert.key] : CheckCircle2;

        return (
          <Link
            key={alert.key}
            href={alert.href}
            className={cn(
              "group rounded-[22px] border p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-36px_rgba(15,23,42,0.35)]",
              toneClassName[alert.tone]
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{alert.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{alert.value}</p>
              </div>
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:-translate-y-0.5",
                  iconClassName[alert.tone]
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 min-h-10 text-sm leading-5 opacity-75">{alert.helper}</p>
          </Link>
        );
      })}
    </section>
  );
}
