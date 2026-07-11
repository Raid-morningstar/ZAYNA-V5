import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  tasks: AdminOverviewData["priorityTasks"];
};

const toneClassName = {
  danger: "border-rose-200 bg-rose-50 text-rose-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  info: "border-sky-200 bg-sky-50 text-sky-950",
} as const;

export default function AdminPriorityTasks({ tasks }: Props) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_46px_-40px_rgba(15,23,42,0.32)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Priorites
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Taches actionnables</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {tasks.map((task) => (
          <Link
            key={task.label}
            href={task.href}
            className={cn(
              "group flex min-h-36 flex-col justify-between rounded-[18px] border p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-36px_rgba(15,23,42,0.35)]",
              task.value > 0 ? toneClassName[task.tone] : toneClassName.success
            )}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-5">{task.label}</p>
                {task.value === 0 ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : null}
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{task.value}</p>
              <p className="mt-2 text-xs leading-5 opacity-75">{task.helper}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold">
              Ouvrir
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
