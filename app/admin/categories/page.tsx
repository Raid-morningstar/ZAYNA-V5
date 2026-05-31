import { Layers3, Package2, Sparkles } from "lucide-react";

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import {
  AdminPageHero,
  EmptyState,
  Field,
  MediaThumb,
  MetricCard,
  SectionHeading,
  StatusPill,
  adminDateFormatter,
  adminSurfaceClassName,
} from "@/components/admin/AdminPagePrimitives";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import ImageDropInput from "@/components/admin/ImageDropInput";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminCategoriesPageData } from "@/lib/admin-pages";
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

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [resolvedSearchParams, data] = await Promise.all([
    searchParams,
    getAdminCategoriesPageData(),
  ]);
  const statusMessage = getQueryValue(resolvedSearchParams, "status");
  const errorMessage = getQueryValue(resolvedSearchParams, "error");

  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminPageHero
        badge="Categories"
        title="Organisez le catalogue avec des rayons simples et visibles."
        description="Cette page est dediee aux categories. Vous pouvez creer, mettre en avant et illustrer chaque rayon sans charger toute la gestion produits."
        aside={
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Reperes
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Categories
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.totalCategories}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Mises en avant
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.featuredCategories}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Produits classes
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.totalProducts}</p>
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
          icon={Layers3}
          label="Total categories"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.totalCategories)}
          helper="Nombre total de rayons disponibles dans la boutique."
          tone="bg-orange-50 text-orange-700 ring-orange-200"
        />
        <MetricCard
          icon={Sparkles}
          label="Mises en avant"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.featuredCategories)}
          helper="Categories affichees en avant sur le storefront."
          tone="bg-cyan-50 text-cyan-700 ring-cyan-200"
        />
        <MetricCard
          icon={Package2}
          label="Produits lies"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.totalProducts)}
          helper="Produits actuellement relies aux categories."
          tone="bg-violet-50 text-violet-700 ring-violet-200"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div id="new-category" className="xl:sticky xl:top-28 xl:self-start">
          <div className={cn(adminSurfaceClassName, "p-6")}>
            <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
              Nouvelle categorie
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Ajouter une categorie
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Donnez un nom clair, ajoutez une image et activez la mise en avant si besoin.
            </p>

            <form action={createCategoryAction} className="mt-6 space-y-5">
              <Field label="Nom de la categorie" htmlFor="category-title">
                <Input
                  id="category-title"
                  name="title"
                  placeholder="Ex: Hygiene bucco-dentaire"
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <Field label="Ordre d'affichage" htmlFor="category-sort-order">
                <Input
                  id="category-sort-order"
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <Field label="Petite description" htmlFor="category-description">
                <Textarea
                  id="category-description"
                  name="description"
                  placeholder="Expliquez rapidement ce que contient cette categorie."
                  className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
                />
              </Field>

              <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="featured"
                  className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                />
                Afficher cette categorie parmi les mises en avant
              </label>

              <ImageDropInput
                id="category-image"
                name="imageFile"
                label="Image de categorie"
                helper="L'image sera optimisee automatiquement pour un chargement plus rapide."
              />

              <AdminSubmitButton
                pendingLabel="Ajout..."
                className="h-11 w-full rounded-2xl bg-shop_btn_dark_green text-white hover:bg-shop_dark_green"
              >
                Ajouter la categorie
              </AdminSubmitButton>
            </form>
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-6")}>
          <SectionHeading
            badge="Rayons"
            title="Categories existantes"
            description="Modifiez la presentation de vos rayons et mettez en avant les univers importants."
          />

          <div className="mt-6 space-y-4">
            {data.categories.length ? (
              data.categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <MediaThumb src={category.imageUrl} alt={category.title} icon={Layers3} />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-slate-950">
                            {category.title}
                          </h4>
                          {category.featured ? (
                            <StatusPill value="featured" label="Mise en avant" />
                          ) : null}
                        </div>
                        <p className="text-sm text-slate-600">
                          {category.productCount} produit(s)
                        </p>
                        <p className="text-xs text-slate-500">
                          Ordre d&apos;affichage: {category.sortOrder}
                        </p>
                        {category.description ? (
                          <p className="max-w-2xl text-sm leading-6 text-slate-500">
                            {category.description}
                          </p>
                        ) : null}
                        <p className="text-xs text-slate-500">
                          Maj {adminDateFormatter.format(category.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <AdminDeleteButton
                        confirmMessage={`Supprimer la categorie "${category.title}" ?`}
                      />
                    </form>
                  </div>

                  <details className="mt-5 rounded-[24px] border border-slate-200 bg-white">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                      Modifier la categorie
                    </summary>
                    <div className="border-t border-slate-200 p-5">
                      <form action={updateCategoryAction} className="space-y-5">
                        <input type="hidden" name="id" value={category.id} />

                        <Field label="Nom de la categorie" htmlFor={`category-title-${category.id}`}>
                          <Input
                            id={`category-title-${category.id}`}
                            name="title"
                            defaultValue={category.title}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <Field label="Ordre d'affichage" htmlFor={`category-sort-order-${category.id}`}>
                          <Input
                            id={`category-sort-order-${category.id}`}
                            name="sortOrder"
                            type="number"
                            min={0}
                            defaultValue={category.sortOrder}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <Field
                          label="Petite description"
                          htmlFor={`category-description-${category.id}`}
                        >
                          <Textarea
                            id={`category-description-${category.id}`}
                            name="description"
                            defaultValue={category.description || ""}
                            className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={category.featured}
                            className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                          />
                          Afficher cette categorie parmi les mises en avant
                        </label>

                        <ImageDropInput
                          id={`category-image-${category.id}`}
                          name="imageFile"
                          label="Changer l'image"
                          existingImageUrls={
                            category.imageUrl ? [resolveImageUrl(category.imageUrl)] : []
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
                title="Aucune categorie"
                description="Ajoutez vos premieres categories pour organiser la boutique."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
