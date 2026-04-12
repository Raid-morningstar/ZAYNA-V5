import type { Metadata } from "next";
import { Suspense } from "react";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartUserGuard from "@/components/CartUserGuard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    template: "%s - Zayna",
    default: "Zayna",
  },
  description: "Boutique en ligne Zayna, tout ce dont vous avez besoin au meme endroit.",
};

/** Minimal static skeleton shown while Header data loads (rare — cache hit is instant) */
function HeaderFallback() {
  return (
    <div className="sticky top-0 z-50 border-b border-shop_light_green/20 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1300px] items-center justify-between px-4 md:px-6" />
    </div>
  );
}

function FooterFallback() {
  return <div className="border-t border-shop_light_green/20 bg-white h-24" />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <CartUserGuard />
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={<FooterFallback />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}
