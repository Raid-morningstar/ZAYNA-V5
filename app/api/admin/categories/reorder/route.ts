import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getAdminDataTag } from "@/lib/admin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  await requireAdmin();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as any).ids)) {
    return NextResponse.json({ error: "Missing ids array" }, { status: 400 });
  }

  const ids = (body as any).ids.filter((id: unknown) => typeof id === "string");

  if (!ids.length) {
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      ids.map((id: string, index: number) =>
        prisma.category.update({ where: { id }, data: { range: index } })
      )
    );

    revalidateTag(getAdminDataTag(), "max");
    revalidatePath("/admin", "layout");
    revalidatePath("/", "layout");

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
