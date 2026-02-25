import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const reviews = await prisma.review.findMany({
    include: {
      booking: {
        include: { service: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}
