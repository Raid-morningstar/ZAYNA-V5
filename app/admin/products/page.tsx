import {
  AlertTriangle,
  Boxes,
  Layers3,
  Package2,
  Sparkles,
} from "lucide-react";

import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
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
  adminCurrencyFormatter,
  adminDateFormatter,
  adminSelectClassName,
  adminSurfaceClassName,
} from "@/components/admin/AdminPagePrimitives";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import ImageDropInput from "@/components/admin/ImageDropInput";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminProductsPageData } from "@/lib/admin-pages";
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

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [resolvedSearchParams, data] = await Promise.all([
    searchParams,
    getAdminProductsPageData(),
  ]);
  const statusMessage = getQueryValue(resolvedSearchParams, "status");
  const errorMessage = getQueryValue(resolvedSearchParams, "error");

  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminPageHero
        badge="Catalogue produits"
        title="Un espace pense pour ajouter, modifier et surveiller le stock."
        description="Les produits sont maintenant geres sur une page dediee. Vous chargez uniquement le catalogue, les marques et les categories utiles a ce travail, avec une interface plus stable sur desktop et mobile."
        aside={
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              A retenir
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Produits affiches
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.products.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Produits mis en avant
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.featuredProducts}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Stock faible
                </p>
                <p className="mt-2 text-3xl font-semibold">{data.metrics.lowStockProducts}</p>
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Package2}
          label="Catalogue"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.totalProducts)}
          helper="Nombre total de produits dans la boutique."
          tone="bg-violet-50 text-violet-700 ring-violet-200"
        />
        <MetricCard
          icon={Sparkles}
          label="Mis en avant"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.featuredProducts)}
          helper="Produits actuellement pousses dans la vitrine."
          tone="bg-cyan-50 text-cyan-700 ring-cyan-200"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Stock faible"
          value={new Intl.NumberFormat("fr-MA").format(data.metrics.lowStockProducts)}
          helper="Produits qui meritent un reapprovisionnement rapide."
          tone="bg-amber-50 text-amber-700 ring-amber-200"
        />
        <MetricCard
          icon={Layers3}
          label="Structure"
          value={`${data.metrics.totalCategories} cat. / ${data.metrics.totalBrands} marques`}
          helper="Categories et marques disponibles pour le classement."
          tone="bg-emerald-50 text-emerald-700 ring-emerald-200"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div id="new-product" className={cn(adminSurfaceClassName, "p-6")}>
            <div className="space-y-2">
              <Badge className="bg-shop_light_green/15 text-shop_btn_dark_green hover:bg-shop_light_green/15">
                Nouveau produit
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Ajouter un produit
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Remplissez uniquement les informations utiles pour la boutique. Aucun slug,
                identifiant ou chemin technique n&apos;est visible.
              </p>
            </div>

            {data.categories.length ? (
              <form action={createProductAction} className="mt-6 space-y-5">
                <Field label="Nom du produit" htmlFor="product-name">
                  <Input id="product-name" name="name" placeholder="Ex: Creme solaire SPF 50" />
                </Field>

                <Field label="Description courte" htmlFor="product-description">
                  <Textarea
                    id="product-description"
                    name="description"
                    placeholder="Description simple visible sur la fiche produit."
                    className="min-h-28 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  <Field label="Prix (MAD)" htmlFor="product-price">
                    <Input
                      id="product-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="149.00"
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                    />
                  </Field>
                <Field
                  label="Promotion (%)"
                  htmlFor="product-discount"
                  helper="Laissez 0 si le produit n&apos;est pas en promotion."
                >
                    <Input
                      id="product-discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      defaultValue="0"
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                    />
                  </Field>
                  <Field label="Stock" htmlFor="product-stock">
                    <Input
                      id="product-stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="25"
                      className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                    />
                  </Field>
                </div>

                <Field label="Marque" htmlFor="product-brand">
                  <select
                    id="product-brand"
                    name="brandId"
                    defaultValue=""
                    className={adminSelectClassName}
                  >
                    <option value="">Aucune marque</option>
                    {data.brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Categories</p>
                  <div className="grid gap-2 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                    {data.categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-3 py-3 text-sm text-slate-700 transition-colors hover:border-shop_btn_dark_green/15"
                      >
                        <input
                          type="checkbox"
                          name="categoryIds"
                          value={category.id}
                          className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                        />
                        <span>{category.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                  />
                  Mettre ce produit en avant sur la boutique
                </label>

                <ImageDropInput
                  id="product-images"
                  name="imageFiles"
                  label="Photos du produit"
                  helper="Les photos seront compressees, converties et redimensionnees automatiquement."
                  multiple
                  maxFiles={6}
                />

                <AdminSubmitButton
                  pendingLabel="Ajout..."
                  className="h-11 w-full rounded-2xl bg-shop_btn_dark_green text-white hover:bg-shop_dark_green"
                >
                  Ajouter le produit
                </AdminSubmitButton>
              </form>
            ) : (
              <EmptyState
                title="Ajoutez d'abord une categorie"
                description="Un produit doit appartenir a au moins une categorie avant d'etre ajoute."
              />
            )}
          </div>

          <div className={cn(adminSurfaceClassName, "p-6")}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-shop_btn_dark_green" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Reapprovisionnement
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Produits sensibles
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {data.lowStockItems.length ? (
                data.lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/75 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-slate-700">{item.name}</p>
                    <StatusPill
                      value={item.stock === 0 ? "out" : "pending"}
                      label={item.stock === 0 ? "Rupture" : `${item.stock} restant(s)`}
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Aucun stock faible"
                  description="Tous les produits affichent un stock confortable."
                />
              )}
            </div>
          </div>
        </div>

        <div className={cn(adminSurfaceClassName, "p-6")}>
          <SectionHeading
            badge="Catalogue"
            title="Produits existants"
            description={
              data.metrics.totalProducts > data.products.length
                ? `Les ${data.products.length} produits les plus recents sont affiches pour garder la page rapide.`
                : "Tous les produits sont affiches dans cette page."
            }
          />

          <div className="mt-6 space-y-4">
            {data.products.length ? (
              data.products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <MediaThumb src={product.imageUrl} alt={product.name} icon={Boxes} />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-slate-950">{product.name}</h4>
                          {product.isFeatured ? (
                            <StatusPill value="featured" label="Mis en avant" />
                          ) : null}
                          {product.discount > 0 ? (
                            <StatusPill value="sale" label={`Promo ${product.discount}%`} />
                          ) : null}
                          {product.stock <= 5 ? (
                            <StatusPill
                              value={product.stock === 0 ? "out" : "pending"}
                              label={product.stock === 0 ? "Rupture" : "Stock faible"}
                            />
                          ) : null}
                        </div>
                        <p className="text-sm text-slate-600">
                          {product.brandTitle || "Sans marque"} · {product.categoryTitles.join(", ")}
                        </p>
                        {product.description ? (
                          <p className="max-w-2xl text-sm leading-6 text-slate-500">
                            {product.description}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span>{adminCurrencyFormatter.format(product.price)}</span>
                          <span>{product.stock} en stock</span>
                          <span>{product.imagesCount} photo(s)</span>
                          <span>Maj {adminDateFormatter.format(product.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <AdminDeleteButton
                        confirmMessage={`Supprimer le produit "${product.name}" ?`}
                      />
                    </form>
                  </div>

                  <details className="mt-5 rounded-[24px] border border-slate-200 bg-white">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-shop_btn_dark_green transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                      Modifier le produit
                    </summary>
                    <div className="border-t border-slate-200 p-5">
                      <form action={updateProductAction} className="space-y-5">
                        <input type="hidden" name="id" value={product.id} />

                        <Field label="Nom du produit" htmlFor={`product-name-${product.id}`}>
                          <Input
                            id={`product-name-${product.id}`}
                            name="name"
                            defaultValue={product.name}
                            className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <Field
                          label="Description courte"
                          htmlFor={`product-description-${product.id}`}
                        >
                          <Textarea
                            id={`product-description-${product.id}`}
                            name="description"
                            defaultValue={product.description || ""}
                            className="min-h-24 rounded-2xl border-slate-200 bg-slate-50"
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Prix (MAD)" htmlFor={`product-price-${product.id}`}>
                            <Input
                              id={`product-price-${product.id}`}
                              name="price"
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={product.price}
                              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                            />
                          </Field>
                          <Field
                            label="Promotion (%)"
                            htmlFor={`product-discount-${product.id}`}
                          >
                            <Input
                              id={`product-discount-${product.id}`}
                              name="discount"
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              defaultValue={product.discount}
                              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                            />
                          </Field>
                          <Field label="Stock" htmlFor={`product-stock-${product.id}`}>
                            <Input
                              id={`product-stock-${product.id}`}
                              name="stock"
                              type="number"
                              min="0"
                              step="1"
                              defaultValue={product.stock}
                              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                            />
                          </Field>
                        </div>

                        <Field label="Marque" htmlFor={`product-brand-${product.id}`}>
                          <select
                            id={`product-brand-${product.id}`}
                            name="brandId"
                            defaultValue={product.brandId || ""}
                            className={adminSelectClassName}
                          >
                            <option value="">Aucune marque</option>
                            {data.brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.title}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-slate-900">Categories</p>
                          <div className="grid gap-2 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2">
                            {data.categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-3 py-3 text-sm text-slate-700 transition-colors hover:border-shop_btn_dark_green/15"
                              >
                                <input
                                  type="checkbox"
                                  name="categoryIds"
                                  value={category.id}
                                  defaultChecked={product.categoryIds.includes(category.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                                />
                                <span>{category.title}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            defaultChecked={product.isFeatured}
                            className="h-4 w-4 rounded border-slate-300 text-shop_btn_dark_green"
                          />
                          Mettre ce produit en avant
                        </label>

                        <ImageDropInput
                          id={`product-images-${product.id}`}
                          name="imageFiles"
                          label="Remplacer les photos"
                          helper="Si vous ajoutez de nouvelles photos, elles remplaceront la galerie actuelle."
                          multiple
                          maxFiles={6}
                          existingImageUrls={product.imageUrls.map((imageUrl) =>
                            resolveImageUrl(imageUrl)
                          )}
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
                title="Aucun produit"
                description="Ajoutez votre premier produit pour commencer a remplir la boutique."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
