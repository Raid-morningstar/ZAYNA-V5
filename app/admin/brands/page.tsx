import { Boxes, Store, Tag } from "lucide-react";

import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/app/admin/actions";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import {
  AdminPageHero,
  EmptyState,
  Field,
  MediaThumb,
  MetricCard,
  SectionHeading,
  adminDateFormatter,
  adminSurfaceClassName,
} from "@/components/admin/AdminPagePrimitives";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import ImageDropInput from "@/components/admin/ImageDropInput";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminBrandsPageData } from "@/lib/admin-pages";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const getQueryValue = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
};

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [resolvedSearchParams, data] = await Promise.all([
    searchParams,
    getAdminBrandsPageData(),
  ]);
  const statusMessage = getQueryValue(resolvedSearchParams, "status");
  const errorMessage = getQueryValue(resolvedSearchParams, "error");

  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminPageHero
        badge="Marques"
        title="Gerer les partenaires et leurs logos dans un espace dedie."
        description="Les marques ont maintenant leur propre page. Vous pouvez enrichir le catalogue avec une presentation propre des laboratoires et partenaires sans ralentir la gestion des autres contenus."
        aside={
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              En bref
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Marques
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.totalBrands}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Marques actives
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.activeBrands}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Produits sans marque
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {data.metrics.brandlessProducts}
                </p>
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
          icon={Store}
          label="Total marques"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.totalBrands)}
          helper="Toutes les marques creees dans le back office."
          tone="bg-cyan-50 text-cyan-700 ring-cyan-200"
        />
        <MetricCard
          icon={Tag}
          label="Marques actives"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.activeBrands)}
          helper="Marques associees a au moins un produit."
          tone="bg-emerald-50 text-emerald-700 ring-emerald-200"
        />
        <MetricCard
          icon={Boxes}
          label="Produits sans marque"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.brandlessProducts)}
          helper="Produits qui peuvent encore etre rattaches a une marque."
          tone="bg-amber-50 text-amber-700 ring-amber-200"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div id="new-brand" className="xl:sticky xl:top-28 xl:self-start">
          <div className={cn(adminSurfaceClassName, "p-6")}>
            <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
              Nouvelle marque
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Ajouter une marque
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ajoutez un nom, une courte presentation et un logo pour renforcer la lisibilite
              du catalogue.
            </p>

            <form action={createBrandAction} className="mt-6 space-y-5">
              <Field label="Nom de la marque" htmlFor="brand-title">
                <Input
                  id="brand-title"
                  name="title"
                  placeholder="Ex: Vichy"
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <Field label="Petite description" htmlFor="brand-description">
                <Textarea
                  id="brand-description"
                  name="description"
                  placeholder="Quelques mots pour presenter la marque."
                  className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <ImageDropInput
                id="brand-image"
                name="imageFile"
                label="Logo de la marque"
                helper="Le logo sera optimise automatiquement pour une meilleure vitesse."
              />

              <AdminSubmitButton
                pendingLabel="Ajout..."
                className="h-11 w-full rounded-2xl bg-shop_btn_dark_green text-white hover:bg-shop_dark_green"
              >
                Ajouter la marque
              </AdminSubmitButton>
            </form>
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-6")}>
          <SectionHeading
            badge="Partenaires"
            title="Marques existantes"
            description="Mettez a jour les logos et textes de presentation depuis une liste claire et responsive."
          />

          <div className="mt-6 space-y-4">
            {data.brands.length ? (
              data.brands.map((brand) => (
                <div
                  key={brand.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <MediaThumb src={brand.imageUrl} alt={brand.title} icon={Store} />
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-slate-950">{brand.title}</h4>
                        <p className="text-sm text-slate-600">
                          {brand.productCount} produit(s)
                        </p>
                        {brand.description ? (
                          <p className="max-w-2xl text-sm leading-6 text-slate-500">
                            {brand.description}
                          </p>
                        ) : null}
                        <p className="text-xs text-slate-500">
                          Maj {adminDateFormatter.format(brand.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <form action={deleteBrandAction}>
                      <input type="hidden" name="id" value={brand.id} />
                      <AdminDeleteButton
                        confirmMessage={`Supprimer la marque "${brand.title}" ?`}
                      />
                    </form>
                  </div>

                  <details className="mt-5 rounded-[24px] border border-slate-200 bg-white">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                      Modifier la marque
                    </summary>
                    <div className="border-t border-slate-200 p-5">
                      <form action={updateBrandAction} className="space-y-5">
                        <input type="hidden" name="id" value={brand.id} />

                        <Field label="Nom de la marque" htmlFor={`brand-title-${brand.id}`}>
                          <Input
                            id={`brand-title-${brand.id}`}
                            name="title"
                            defaultValue={brand.title}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <Field
                          label="Petite description"
                          htmlFor={`brand-description-${brand.id}`}
                        >
                          <Textarea
                            id={`brand-description-${brand.id}`}
                            name="description"
                            defaultValue={brand.description || ""}
                            className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <ImageDropInput
                          id={`brand-image-${brand.id}`}
                          name="imageFile"
                          label="Changer le logo"
                          existingImageUrls={
                            brand.imageUrl ? [resolveImageUrl(brand.imageUrl)] : []
                          }
                        />

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
                title="Aucune marque"
                description="Ajoutez vos marques principales pour enrichir la navigation de la boutique."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
