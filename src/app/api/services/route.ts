import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;

  const services = await prisma.service.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(services);
}
