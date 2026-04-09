import { Percent, Sparkles, TicketPercent } from "lucide-react";

import {
  createPromoCodeAction,
  deletePromoCodeAction,
  updatePromoCodeAction,
} from "@/app/admin/actions";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import {
  AdminPageHero,
  EmptyState,
  Field,
  MetricCard,
  SectionHeading,
  StatusPill,
  adminDateFormatter,
  adminSurfaceClassName,
  formatDateInput,
} from "@/components/admin/AdminPagePrimitives";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminPromoCodesPageData } from "@/lib/admin-pages";
import { cn } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const getQueryValue = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
};

export default async function AdminPromosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [resolvedSearchParams, data] = await Promise.all([
    searchParams,
    getAdminPromoCodesPageData(),
  ]);
  const statusMessage = getQueryValue(resolvedSearchParams, "status");
  const errorMessage = getQueryValue(resolvedSearchParams, "error");
  const expiringPromoIdSet = new Set(data.expiringPromoIds);

  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminPageHero
        badge="Promotions"
        title="Pilotez vos remises depuis une page legere et claire."
        description="Cette page rassemble uniquement les codes promo et leurs parametres essentiels. C'est plus rapide a ouvrir, plus simple a relire et plus confortable sur mobile."
        aside={
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Vue rapide
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Codes promo
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.totalPromoCodes}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Actifs
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.activePromoCodes}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Expirent vite
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.expiringPromoCodes}</p>
              </div>
            </div>
          </>
        }
      />

      {statusMessage ? (
        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={TicketPercent}
          label="Total promos"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.totalPromoCodes)}
          helper="Tous les codes promo crees dans le back office."
          tone="bg-pink-50 text-pink-700 ring-pink-200"
        />
        <MetricCard
          icon={Sparkles}
          label="Promos actives"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.activePromoCodes)}
          helper="Codes immediatement utilisables par les clients."
          tone="bg-emerald-50 text-emerald-700 ring-emerald-200"
        />
        <MetricCard
          icon={Percent}
          label="Remise moyenne"
          value={`${Math.round(data.metrics.averageDiscountValue || 0)}%`}
          helper="Moyenne des remises configurees dans vos codes promo."
          tone="bg-violet-50 text-violet-700 ring-violet-200"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div id="new-promo" className="xl:sticky xl:top-28 xl:self-start">
          <div className={cn(adminSurfaceClassName, "p-6")}>
            <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
              Nouvelle promo
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Ajouter un code promo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Donnez un nom a la campagne, choisissez le code visible par le client et fixez la
              remise.
            </p>

            <form action={createPromoCodeAction} className="mt-6 space-y-5">
              <Field label="Nom de la promo" htmlFor="promo-title">
                <Input
                  id="promo-title"
                  name="title"
                  placeholder="Ex: Offre Ramadan"
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <Field
                label="Code promo"
                htmlFor="promo-code"
                helper="Ce code sera saisi par le client dans le panier."
              >
                <Input
                  id="promo-code"
                  name="code"
                  placeholder="RAMADAN15"
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Field label="Reduction (%)" htmlFor="promo-discount">
                  <Input
                    id="promo-discount"
                    name="discountValue"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    placeholder="15"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </Field>
                <Field label="Date d'expiration" htmlFor="promo-end">
                  <Input
                    id="promo-end"
                    name="endsAt"
                    type="date"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                />
                Activer ce code promo des maintenant
              </label>

              <AdminSubmitButton
                pendingLabel="Ajout..."
                className="h-11 w-full rounded-2xl bg-shop_btn_dark_green text-white hover:bg-shop_dark_green"
              >
                Ajouter le code promo
              </AdminSubmitButton>
            </form>
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-6")}>
          <SectionHeading
            badge="Campagnes"
            title="Promos existantes"
            description="Activez, desactivez ou ajustez rapidement les remises en cours."
          />

          <div className="mt-6 space-y-4">
            {data.promoCodes.length ? (
              data.promoCodes.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-semibold text-slate-950">{promo.title}</h4>
                        <StatusPill
                          value={promo.active ? "active" : "inactive"}
                          label={promo.active ? "Actif" : "Inactif"}
                        />
                        {expiringPromoIdSet.has(promo.id) ? (
                          <StatusPill value="expiring" label="Expire bientot" />
                        ) : null}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{promo.code}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>{promo.discountValue}% de remise</span>
                        <span>
                          {promo.endsAt
                            ? `Expire le ${adminDateFormatter.format(promo.endsAt)}`
                            : "Sans date d'expiration"}
                        </span>
                        <span>Maj {adminDateFormatter.format(promo.updatedAt)}</span>
                      </div>
                    </div>

                    <form action={deletePromoCodeAction}>
                      <input type="hidden" name="id" value={promo.id} />
                      <AdminDeleteButton
                        confirmMessage={`Supprimer le code promo "${promo.code}" ?`}
                      />
                    </form>
                  </div>

                  <details className="mt-5 rounded-[24px] border border-slate-200 bg-white">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                      Modifier la promo
                    </summary>
                    <div className="border-t border-slate-200 p-5">
                      <form action={updatePromoCodeAction} className="space-y-5">
                        <input type="hidden" name="id" value={promo.id} />

                        <Field label="Nom de la promo" htmlFor={`promo-title-${promo.id}`}>
                          <Input
                            id={`promo-title-${promo.id}`}
                            name="title"
                            defaultValue={promo.title}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <Field label="Code promo" htmlFor={`promo-code-${promo.id}`}>
                          <Input
                            id={`promo-code-${promo.id}`}
                            name="code"
                            defaultValue={promo.code}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Reduction (%)"
                            htmlFor={`promo-discount-${promo.id}`}
                          >
                            <Input
                              id={`promo-discount-${promo.id}`}
                              name="discountValue"
                              type="number"
                              min="1"
                              max="100"
                              step="1"
                              defaultValue={promo.discountValue}
                              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                            />
                          </Field>
                          <Field label="Date d'expiration" htmlFor={`promo-end-${promo.id}`}>
                            <Input
                              id={`promo-end-${promo.id}`}
                              name="endsAt"
                              type="date"
                              defaultValue={formatDateInput(promo.endsAt)}
                              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                            />
                          </Field>
                        </div>

                        <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name="active"
                            defaultChecked={promo.active}
                            className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                          />
                          Laisser ce code actif
                        </label>

                        <AdminSubmitButton
                          pendingLabel="Enregistrement..."
                          className="h-11 rounded-2xl bg-shop_btn_dark_green px-6 text-white hover:bg-shop_dark_green"
                        >
                          Enregistrer les modifications
                        </AdminSubmitButton>
                      </form>
                    </div>
                  </details>
                </div>
              ))
            ) : (
              <EmptyState
                title="Aucune promo"
                description="Creez votre premier code promo pour lancer une campagne."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
