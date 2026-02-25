import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  const images = await prisma.galleryImage.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(images);
}
