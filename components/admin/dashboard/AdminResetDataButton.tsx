"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { resetAllDataAction } from "@/app/admin/actions";

export default function AdminResetDataButton() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const canConfirm = confirmed.trim().toUpperCase() === "RESET";

  function handleReset() {
    startTransition(async () => {
      await resetAllDataAction();
      setDone(true);
      setOpen(false);
      setConfirmed("");
    });
  }

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(true); setConfirmed(""); setDone(false); }}
        className="group flex w-full items-center gap-3 rounded-[24px] border border-rose-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,241,242,0.72))] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/60 hover:shadow-[0_22px_40px_-34px_rgba(239,68,68,0.25)]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <RotateCcw className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-900">Réinitialiser les données</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            Supprimer toutes les commandes · Remettre les points à zéro
          </p>
        </div>
      </button>

      {done && (
        <p className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          Données réinitialisées avec succès.
        </p>
      )}

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.35)]">
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">
              <AlertTriangle className="h-7 w-7 text-rose-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Réinitialiser toutes les données ?
            </h2>

            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Cette action va :</p>
              <ul className="ml-4 list-disc space-y-1 text-slate-700">
                <li>Supprimer <strong>toutes les commandes</strong> et leurs articles</li>
                <li>Remettre les <strong>points fidélité à 0</strong> pour tous les clients</li>
                <li>Repasser tous les clients au tier <strong>Bronze</strong></li>
              </ul>
              <p className="mt-3 font-medium text-slate-700">
                Les comptes clients, produits et paramètres sont conservés.
              </p>
              <p className="font-semibold text-rose-600">
                Cette action est irréversible.
              </p>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tapez <span className="text-rose-600 font-mono">RESET</span> pour confirmer
              </label>
              <input
                type="text"
                value={confirmed}
                onChange={(e) => setConfirmed(e.target.value)}
                placeholder="RESET"
                disabled={isPending}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 disabled:opacity-60"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={!canConfirm || isPending}
                className="flex-1 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? "Réinitialisation…" : "Confirmer le reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
