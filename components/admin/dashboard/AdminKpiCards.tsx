import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { adminSurfaceClassName } from "@/components/admin/AdminPagePrimitives";

export type KpiCard = {
  label: string;
  value: string;
  note: string;
  helper: string;
  icon: ElementType;
  accent: string;
  iconTone: string;
  badgeClassName: string;
};

export default function AdminKpiCards({ cards }: { cards: readonly KpiCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className={cn(
              adminSurfaceClassName,
              "group relative overflow-hidden border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_80px_-52px_rgba(15,23,42,0.45)]",
              card.accent
            )}
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),transparent_65%)] opacity-80" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {card.label}
                </p>
                <p className="text-3xl font-semibold tracking-tight text-slate-950">
                  {card.value}
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                    card.badgeClassName
                  )}
                >
                  {card.note}
                </span>
              </div>

              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5",
                  card.iconTone
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>

            <p className="relative mt-4 text-sm leading-6 text-slate-600">
              {card.helper}
            </p>
          </article>
        );
      })}
    </section>
  );
}
