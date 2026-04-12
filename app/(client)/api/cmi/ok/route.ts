import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// CMI redirects the user here after a successful payment (POST)
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const oid = formData.get("oid")?.toString() || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return NextResponse.redirect(`${baseUrl}/success?orderNumber=${encodeURIComponent(oid)}`, {
    status: 303,
  });
}

// Fallback GET (some CMI configs use GET redirect)
export async function GET(req: NextRequest) {
  const oid = new URL(req.url).searchParams.get("oid") || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return NextResponse.redirect(`${baseUrl}/success?orderNumber=${encodeURIComponent(oid)}`, {
    status: 302,
  });
}
