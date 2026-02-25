import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  return NextResponse.json(bookings);
}
