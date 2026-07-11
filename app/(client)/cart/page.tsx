"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { urlFor } from "@/lib/image";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, resetCart } = useStore();
  const hasHydrated = useStore((state) => state.hasHydrated);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const safeGroupedItems = hasHydrated ? groupedItems : [];
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const subtotal = hasHydrated ? getTotalPrice() : 0;

  const handleResetCart = () => {
    if (window.confirm("Voulez-vous vraiment vider votre panier ?")) {
      resetCart();
    }
  };

  return (
    <div className="min-h-screen bg-shop_light_bg/30 pb-16">
      {isSignedIn ? (
        !hasHydrated ? (
          <Container>
            <div className="py-10">
              <div className="space-y-3">
                <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          </Container>
        ) : safeGroupedItems.length ? (
          <Container>
            <div className="flex items-center gap-2.5 py-6">
              <ShoppingBag className="text-shop_btn_dark_green" size={22} />
              <Title className="text-xl font-bold text-shop_btn_dark_green">
                Mon Panier
              </Title>
              <span className="ml-1 rounded-full bg-shop_btn_dark_green/10 px-2.5 py-0.5 text-xs font-semibold text-shop_btn_dark_green">
                {safeGroupedItems.length} article{safeGroupedItems.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Product list */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-2xl border border-shop_light_green/20 bg-white shadow-sm">
                  {safeGroupedItems.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <div
                        key={product?._id}
                        className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-b-0"
                      >
                        {/* Image */}
                        {product?.images?.[0] && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="shrink-0 overflow-hidden rounded-xl border border-slate-100"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product?.name || "Produit"}
                              width={300}
                              height={300}
                              className="h-24 w-24 object-contain p-1 transition-transform duration-300 hover:scale-105 md:h-28 md:w-28"
                            />
                          </Link>
                        )}

                        {/* Info */}
                        <div className="flex flex-1 flex-col gap-1.5">
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="line-clamp-2 text-sm font-semibold text-shop_dark_green hover:text-shop_btn_dark_green"
                          >
                            {product?.name}
                          </Link>
                          {product?.categories && product.categories.length > 0 && (
                            <p className="text-xs text-lightColor">
                              {product.categories.map((c) => c).join(", ")}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <ProductSideMenu
                              product={product}
                              className="relative top-0 right-0"
                            />
                            <button
                              onClick={() => {
                                deleteCartProduct(product?._id);
                                toast.success("Produit retiré du panier");
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Price + qty */}
                        <div className="flex flex-col items-end gap-2">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                            className="text-sm font-bold text-shop_btn_dark_green"
                          />
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleResetCart}
                  className="mt-3 text-xs font-medium text-slate-400 underline underline-offset-2 hover:text-red-500"
                >
                  Vider le panier
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-2xl border border-shop_light_green/20 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-base font-bold text-shop_btn_dark_green">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3">
                    {safeGroupedItems.map(({ product }) => {
                      const qty = getItemCount(product?._id);
                      return (
                        <div key={product?._id} className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1 flex-1 text-xs text-lightColor">
                            {product?.name}
                            <span className="ml-1 font-medium text-shop_dark_green">×{qty}</span>
                          </span>
                          <PriceFormatter
                            amount={(product?.price as number) * qty}
                            className="shrink-0 text-xs font-semibold text-shop_dark_green"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="my-4 border-t border-slate-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-lightColor">Sous-total</span>
                    <PriceFormatter amount={subtotal} className="text-sm font-semibold text-shop_dark_green" />
                  </div>
                  <p className="mt-1 text-[11px] text-lightColor/70">
                    Frais de livraison calculés à l&apos;étape suivante
                  </p>

                  <div className="my-4 border-t border-slate-100" />

                  <button
                    onClick={() => router.push("/checkout")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-shop_btn_dark_green px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-shop_btn_dark_green/90 active:scale-[0.98]"
                  >
                    Valider la commande
                    <ArrowRight size={16} />
                  </button>

                  <Link
                    href="/shop"
                    className="mt-3 block text-center text-xs text-lightColor underline underline-offset-2 hover:text-shop_btn_dark_green"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        ) : (
          <EmptyCart />
        )
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
