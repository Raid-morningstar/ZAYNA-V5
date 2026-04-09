import { searchProducts, SortOption } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const categoriesParam = params.get("categories")?.trim() || "";
    const brandsParam = params.get("brands")?.trim() || "";
    const selectedCategories = categoriesParam ? categoriesParam.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const selectedBrands = brandsParam ? brandsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const q = params.get("q")?.trim() || "";
    const limit = Number(params.get("limit") || "");
    const sortBy = (params.get("sort") || "relevance") as SortOption;

    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    const parsedMin = minPriceParam ? Number(minPriceParam) : NaN;
    const parsedMax = maxPriceParam ? Number(maxPriceParam) : NaN;
    const hasPriceFilter = Number.isFinite(parsedMin) && Number.isFinite(parsedMax);

    const products = await searchProducts({
      selectedCategories,
      selectedBrands,
      searchTerm: q,
      minPrice: hasPriceFilter ? parsedMin : null,
      maxPrice: hasPriceFilter ? parsedMax : null,
      limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
      sortBy,
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to search products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
